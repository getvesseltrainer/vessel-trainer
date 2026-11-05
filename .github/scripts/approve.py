"""Checks the structure of an approved issue and adds it to the library. Text and files come from players."""
import gzip
import hashlib
import io
import json
import os
import re
import struct
import subprocess
import sys
import urllib.request
from pathlib import Path

MAX_FILE_BYTES = 32 * 1024 * 1024
MAX_UNPACKED_BYTES = 256 * 1024 * 1024
MAX_VOLUME = 500_000
FILE_LINK = re.compile(r'https://github\.com/user-attachments/files/\d+/[A-Za-z0-9._-]+')
COMMAND_BLOCKS = {'minecraft:command_block', 'minecraft:chain_command_block', 'minecraft:repeating_command_block'}


class Refused(Exception):
    """A reason shown to the person who submitted the structure."""


def read_nbt(data):
    at = 0

    def take(count):
        nonlocal at
        if count < 0 or at + count > len(data):
            raise Refused('The file is damaged.')
        chunk = data[at:at + count]
        at += count
        return chunk

    def number(code, size):
        return struct.unpack('>' + code, take(size))[0]

    def text():
        return take(number('H', 2)).decode('utf-8', 'replace')

    def payload(kind, depth=0):
        if depth > 32:
            raise Refused('The file is damaged.')
        if kind == 1:
            return number('b', 1)
        if kind == 2:
            return number('h', 2)
        if kind == 3:
            return number('i', 4)
        if kind == 4:
            return number('q', 8)
        if kind == 5:
            return number('f', 4)
        if kind == 6:
            return number('d', 8)
        if kind == 7:
            take(number('i', 4))
            return None
        if kind == 8:
            return text()
        if kind == 9:
            inner = number('b', 1)
            return [payload(inner, depth + 1) for _ in range(number('i', 4))]
        if kind == 10:
            compound = {}
            while True:
                inner = number('b', 1)
                if inner == 0:
                    return compound
                name = text()
                compound[name] = payload(inner, depth + 1)
        if kind == 11:
            take(number('i', 4) * 4)
            return None
        if kind == 12:
            take(number('i', 4) * 8)
            return None
        raise Refused('The file is damaged.')

    if number('b', 1) != 10:
        raise Refused('This is not a structure file.')
    text()
    return payload(10)


def validate(packed):
    """Returns the size and block count of a structure, or refuses it."""
    if len(packed) > MAX_FILE_BYTES:
        raise Refused('The file is larger than 32 MB.')
    if packed[:2] != b'\x1f\x8b':
        raise Refused('This is not a Minecraft .nbt structure.')
    try:
        with gzip.GzipFile(fileobj=io.BytesIO(packed)) as stream:
            data = stream.read(MAX_UNPACKED_BYTES + 1)
    except (OSError, EOFError) as error:
        raise Refused('The file is damaged.') from error
    if len(data) > MAX_UNPACKED_BYTES:
        raise Refused('The file is too large once unpacked.')

    try:
        return inspect(read_nbt(data), data)
    except (struct.error, RecursionError, AttributeError, TypeError) as error:
        raise Refused('The file is damaged.') from error


def inspect(root, data):
    size = root.get('size')
    blocks = root.get('blocks')
    palette = root.get('palette') or (root.get('palettes') or [None])[0]
    if not isinstance(size, list) or len(size) != 3 or not isinstance(blocks, list) or not palette:
        raise Refused('This .nbt file is not a structure.')
    if not all(isinstance(side, int) and side > 0 for side in size) or size[0] * size[1] * size[2] > MAX_VOLUME:
        raise Refused('The structure is larger than the 500,000 block limit.')

    names = [entry.get('id') or entry.get('Name') for entry in palette]
    if COMMAND_BLOCKS & set(names):
        raise Refused('The structure contains command blocks.')
    if b'run_command' in data:
        raise Refused('The structure contains text that can run a command.')
    count = 0
    for block in blocks:
        state = block.get('state', -1)
        if 0 <= state < len(names) and names[state] not in ('minecraft:air', 'minecraft:structure_void'):
            count += 1
    if count == 0:
        raise Refused('The structure has no blocks.')
    return size, count


def field(body, title):
    match = re.search(r'^### ' + re.escape(title) + r'\s*\n(.*?)(?=^### |\Z)', body, re.M | re.S)
    value = match.group(1).strip() if match else ''
    return '' if value == '_No response_' else value


def plain(text, limit):
    return re.sub(r'[\x00-\x1f\x7f§]+', ' ', text).strip()[:limit]


def slug(name, number):
    base = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')[:40] or 'structure'
    return f'{base}-{number}'


def run(*command):
    subprocess.run(command, check=True)


def add(issue, library):
    body = issue.get('body') or ''
    name = plain(field(body, 'Structure name'), 40)
    if not name:
        raise Refused('The structure has no name.')
    links = FILE_LINK.findall(field(body, 'Structure file'))
    if len(links) != 1:
        raise Refused('Attach exactly one structure file to the form.')

    request = urllib.request.Request(links[0], headers={'User-Agent': 'vessel-trainer-library'})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            packed = response.read(MAX_FILE_BYTES + 1)
    except OSError as error:
        raise Refused('The file could not be downloaded.') from error
    size, blocks = validate(packed)

    entry_id = slug(name, issue['number'])
    (library / f'{entry_id}.nbt').write_bytes(packed)
    index_path = library / 'index.json'
    index = json.loads(index_path.read_text(encoding='utf-8'))
    index = [entry for entry in index if entry['id'] != entry_id]
    text = plain(field(body, 'Description'), 240)
    index.append({
        'id': entry_id,
        'name': {'en': name, 'fr': name},
        'text': {'en': text, 'fr': text},
        'author': plain(field(body, 'Your name'), 40) or issue['user']['login'],
        'size': size,
        'blocks': blocks,
        'sha256': hashlib.sha256(packed).hexdigest(),
        'community': True,
    })
    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding='utf-8')
    return entry_id


def main():
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text(encoding='utf-8'))
    issue = event['issue']
    number = str(issue['number'])
    repository = os.environ['GITHUB_REPOSITORY']
    try:
        entry_id = add(issue, Path('library'))
    except Refused as reason:
        run('gh', 'issue', 'comment', number, '--body', f'This structure could not be added: {reason}')
        sys.exit(1)

    run('git', 'config', 'user.name', 'github-actions[bot]')
    run('git', 'config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com')
    run('git', 'add', 'library')
    run('git', 'commit', '-m', f'Add structure {entry_id}')
    run('git', 'push')
    run('gh', 'api', '-X', 'POST', f'repos/{repository}/pages/builds')
    run('gh', 'issue', 'close', number, '--comment', 'Thank you! Your structure is now in the library.')


if __name__ == '__main__':
    main()
