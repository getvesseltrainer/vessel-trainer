"""Publishes the files approved on the website to the library. Runs on GitHub with the Supabase service key.

Every file is checked again here, with the same rules as the issue form, before anything is published.
"""
import json
import os
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import approve  # noqa: E402

URL = os.environ['SUPABASE_URL'].rstrip('/')
KEY = os.environ['SUPABASE_SERVICE_KEY']
LIBRARY = Path('library')


def call(method, path, body=None, raw=False):
	headers = {'apikey': KEY, 'User-Agent': 'vessel-trainer-library'}
	# An old service_role key is a token and also goes in Authorization; a new sb_secret_ key only goes in apikey.
	if KEY.startswith('eyJ'):
		headers['Authorization'] = f'Bearer {KEY}'
	data = None
	if body is not None:
		headers['Content-Type'] = 'application/json'
		headers['Prefer'] = 'return=minimal'
		data = json.dumps(body).encode()
	request = urllib.request.Request(URL + path, data=data, method=method, headers=headers)
	with urllib.request.urlopen(request, timeout=60) as response:
		payload = response.read(approve.MAX_FILE_BYTES + 1)
	return payload if raw else (json.loads(payload) if payload else None)


def mark(entry, status, reason=None):
	body = {'status': status, 'reason': reason}
	call('PATCH', f"/rest/v1/submissions?id=eq.{entry['id']}", body)


def publish_structure(entry, data):
	size, blocks = approve.validate(data)
	entry_id = approve.slug(entry['name'], f"w{entry['id']}")
	(LIBRARY / f'{entry_id}.nbt').write_bytes(data)
	index_path = LIBRARY / 'index.json'
	index = [item for item in json.loads(index_path.read_text(encoding='utf-8')) if item['id'] != entry_id]
	name = approve.plain(entry['name'], 40)
	text = approve.plain(entry['description'], 240)
	index.append({
		'id': entry_id,
		'name': {'en': name, 'fr': name},
		'text': {'en': text, 'fr': text},
		'author': approve.plain(entry['author'], 40),
		'size': size,
		'blocks': blocks,
		'sha256': approve.hashlib.sha256(data).hexdigest(),
		'community': True,
	})
	index_path.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding='utf-8')
	return entry_id


def publish_banner(entry, data):
	kind = approve.check_banner(data)
	folder = LIBRARY / 'banners'
	entry_id = approve.slug(entry['name'], f"w{entry['id']}")
	(folder / f'{entry_id}.{kind}').write_bytes(data)
	index_path = folder / 'index.json'
	index = [item for item in json.loads(index_path.read_text(encoding='utf-8')) if item['id'] != entry_id]
	name = approve.plain(entry['name'], 40)
	index.append({
		'id': entry_id,
		'format': kind,
		'name': {'en': name, 'fr': name},
		'author': approve.plain(entry['author'], 40),
		'sha256': approve.hashlib.sha256(data).hexdigest(),
		'community': True,
	})
	index_path.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding='utf-8')
	return entry_id


def main():
	waiting = call('GET', '/rest/v1/submissions?status=eq.approved&select=id,kind,name,description,author,file_path&order=id')
	published = []
	for entry in waiting:
		try:
			path = urllib.parse.quote(entry['file_path'])
			data = call('GET', f'/storage/v1/object/submissions/{path}', raw=True)
			entry_id = (publish_banner if entry['kind'] == 'banner' else publish_structure)(entry, data)
		except approve.Refused as reason:
			mark(entry, 'rejected', str(reason))
			print(f"Refused {entry['id']}: {reason}")
			continue
		except OSError as error:
			print(f"Could not fetch {entry['id']}: {error}")
			continue
		published.append((entry, entry_id))
	if not published:
		print('Nothing to publish')
		return
	approve.run('git', 'config', 'user.name', 'github-actions[bot]')
	approve.run('git', 'config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com')
	approve.run('git', 'add', 'library')
	approve.run('git', 'commit', '-m', 'Add ' + ', '.join(entry_id for _, entry_id in published))
	approve.run('git', 'push')
	for entry, _ in published:
		mark(entry, 'published')
	repository = os.environ.get('GITHUB_REPOSITORY')
	if repository:
		subprocess.run(['gh', 'api', '-X', 'POST', f'repos/{repository}/pages/builds'], check=False)
	print('Published', len(published))


if __name__ == '__main__':
	main()
