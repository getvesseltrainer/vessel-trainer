/*
  Edit this file to update the site.
  CHANGELOG: add a new block at the TOP of the list for each release.
  ROADMAP: move items between the three lists.
  Each text has an English (en) and a French (fr) version.
*/
/* Project pages on the mod platforms. A button stays marked as coming soon until it has an address. */
const STORE_LINKS = { curseforge: '', modrinth: '' };

/* Donation pages. Paste your own address in url; a link stays hidden on the page until it has one. */
const SUPPORT_LINKS = [
  { name: 'Ko-fi', url: 'https://ko-fi.com/vesseltrainer', text: { en: 'Donate by card on Ko-fi.', fr: 'Fais un don par carte sur Ko-fi.' } },
  { name: 'PayPal', url: '', text: { en: 'A one-off donation by card or PayPal.', fr: 'Un don ponctuel par carte ou PayPal.' } },
  { name: 'GitHub Sponsors', url: '', text: { en: 'Support the project from your GitHub account.', fr: 'Soutiens le projet depuis ton compte GitHub.' } },
];

/*
  Discord partners, shown on the Partners page. Add one block per server.
  icon is a file in site/new/partners; icon and address are optional.
*/
const PARTNERS = [
  {
    name: 'Xyro Craft',
    invite: 'https://discord.gg/fhunbBMmm8',
    icon: 'xyro-craft.webp',
    address: 'gamenode3.cbr-cloud.com:25599',
    text: { en: 'A Minecraft Java server on version 26.3.', fr: 'Un serveur Minecraft Java en version 26.3.' },
  },
];

/* The form where players send structures. Empty it to hide the Share button. */
const SUBMIT_URL = 'https://github.com/getvesseltrainer/vessel-trainer/issues/new?template=structure.yml';

const CHANGELOG = [
  {
    version: '2.7.2 Forge 1.20.1',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'Forge 1.20.1 is here', fr: 'Forge 1.20.1 est là' },
    changes: [
      { type: 'added', en: 'The trainer now runs on Forge for Minecraft 1.20.1, with its menus, powers, disasters, Fun tab, structures and online library.', fr: 'Le trainer tourne maintenant sur Forge pour Minecraft 1.20.1, avec ses menus, pouvoirs, catastrophes, onglet Fun, structures et bibliothèque en ligne.' },
      { type: 'added', en: 'Structures made on Minecraft 26.3 can be placed on 1.20.1. Blocks that do not exist in 1.20.1 are left out.', fr: 'Les structures faites sur Minecraft 26.3 se posent en 1.20.1. Les blocs qui n\'existent pas en 1.20.1 sont ignorés.' },
      { type: 'missing', en: 'Player size, creature size and the Minuscule surprise: Minecraft only added the setting that resizes players and creatures in 1.20.5, so 1.20.1 does not have it.', fr: 'Taille du joueur, taille des créatures et surprise Minuscule : Minecraft n\'a ajouté le réglage qui change la taille des joueurs et des créatures qu\'en 1.20.5, donc la 1.20.1 ne l\'a pas.' },
      { type: 'missing', en: 'Time speed and time stop: Minecraft only added control over the game speed in 1.20.3, so 1.20.1 does not have it.', fr: 'Vitesse du temps et arrêt du temps : Minecraft n\'a ajouté le contrôle de la vitesse du jeu qu\'en 1.20.3, donc la 1.20.1 ne l\'a pas.' },
    ],
  },
  {
    version: '2.7.2',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'A new home', fr: 'Une nouvelle adresse' },
    changes: [
      { type: 'changed', en: 'The website moved to vesseltrainer.org, and the online library now uses it.', fr: 'Le site a déménagé sur vesseltrainer.org, et la bibliothèque en ligne utilise cette adresse.' },
    ],
  },
  {
    version: '2.7.1',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'Fun, everywhere', fr: 'Du fun partout' },
    changes: [
      { type: 'added', en: 'Fun, your character: trails, funny footsteps, disco walk, disguises, ghost mode and dancing.', fr: 'Fun, ton personnage : traînées, pas sonores, marche disco, déguisements, mode fantôme et danse.' },
      { type: 'added', en: 'Fun, creatures: hats, parades, choirs, pig towers, funny names, rainbow sheep and battle chickens.', fr: 'Fun, les créatures : chapeaux, parades, chorales, tours de cochons, noms rigolos, moutons arc-en-ciel et poulets de combat.' },
      { type: 'added', en: 'Fun, world: firework shows, mirror mode, screen filters, a tilted world, a huge moon and bouncy blocks.', fr: "Fun, le monde : spectacles de feux d'artifice, mode miroir, filtres d'écran, monde penché, lune énorme et blocs rebondissants." },
      { type: 'added', en: 'Fun, sounds: swapped sounds, a squeaky voice, club music and a fart button.', fr: 'Fun, les sons : sons échangés, voix aiguë, musique de boîte de nuit et bouton pet.' },
      { type: 'added', en: 'Five mini-games: the floor is lava, treasure hunt, chicken shooting, instant parkour and survive the wave.', fr: 'Cinq mini-jeux : sol de lave, chasse au trésor, tir aux poulets, parcours instantané et survis à la vague.' },
      { type: 'added', en: 'Fun, items: confetti gun, magic fishing rod, plastic sword and portable trampoline.', fr: 'Fun, les objets : pistolet à confettis, canne à pêche magique, épée en plastique et trampoline portable.' },
      { type: 'fixed', en: 'Holding R a little too long placed both portals in the same spot.', fr: 'Maintenir R un peu trop longtemps posait les deux portails au même endroit.' },
      { type: 'fixed', en: 'A portal lost its frame after you walked far away and came back.', fr: 'Un portail perdait son cadre quand tu partais loin puis que tu revenais.' },
      { type: 'changed', en: 'The mod is now under an All Rights Reserved license.', fr: 'Le mod est maintenant sous licence tous droits réservés.' },
    ],
  },
  {
    version: '2.7.0',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'Five new powers', fr: 'Cinq nouveaux pouvoirs' },
    changes: [
      { type: 'added', en: 'Dash: a burst of speed where you look, with a safe landing.', fr: 'Dash : un élan dans la direction du regard, avec un atterrissage sans danger.' },
      { type: 'added', en: 'Portal: place two linked doors. People, creatures and items go through.', fr: 'Portail : pose deux portes reliées. Joueur, créatures et objets les traversent.' },
      { type: 'added', en: 'Reverse gravity: creatures in the aimed area fall towards the sky.', fr: 'Gravité inversée : les créatures de la zone visée tombent vers le ciel.' },
      { type: 'added', en: 'Orbital beam: hold R and a beam from the sky follows your crosshair.', fr: 'Rayon orbital : maintiens R et un rayon venu du ciel suit ton viseur.' },
      { type: 'added', en: 'Energy shield: for 10 seconds, projectiles bounce back and monsters are pushed away.', fr: "Bouclier d'énergie : pendant 10 secondes, les projectiles repartent et les monstres sont repoussés." },
    ],
  },
  {
    version: '2.6.0',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'The Fun tab', fr: "L'onglet Fun" },
    changes: [
      { type: 'added', en: 'A new Fun tab: silly effects that are safe for your world, with one button to stop them all.', fr: 'Un nouvel onglet Fun : des effets absurdes et sans danger pour ton monde, avec un bouton pour tout arrêter.' },
      { type: 'added', en: 'Wheel of fortune: it spins and picks a surprise effect for 20 seconds.', fr: 'Roue de la chance : elle tourne et choisit un effet surprise pendant 20 secondes.' },
      { type: 'added', en: 'Roulette mode: a new surprise every 30 seconds.', fr: 'Mode roulette : une nouvelle surprise toutes les 30 secondes.' },
      { type: 'added', en: 'Disco party: a disco ball, lights, music and creatures jumping to the beat.', fr: 'Soirée disco : une boule à facettes, des lumières, de la musique et des créatures qui sautent en rythme.' },
      { type: 'added', en: 'Chicken gun: the R key fires chickens that vanish after 10 seconds.', fr: 'Pistolet à poulets : la touche R tire des poulets qui disparaissent après 10 secondes.' },
      { type: 'added', en: 'Giant head, up to five times its size.', fr: "Tête géante, jusqu'à cinq fois sa taille." },
      { type: 'added', en: 'Body swap: trade places with a creature.', fr: 'Échange de corps : échange ta place avec une créature.' },
    ],
  },
  {
    version: '2.5.0',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'Favorites, search and free camera', fr: 'Favoris, recherche et caméra libre' },
    changes: [
      { type: 'added', en: 'Favorites: press B on any button to pin it to the top of the menu.', fr: 'Favoris : appuie sur B sur n\'importe quel bouton pour l\'épingler en haut du menu.' },
      { type: 'added', en: 'Hotkeys: press K on a button and give it a key, even with the menu closed.', fr: 'Raccourcis : appuie sur K sur un bouton et donne-lui une touche, même menu fermé.' },
      { type: 'added', en: 'Menu search: press N and type a few letters, in English or French.', fr: 'Recherche : appuie sur N et tape quelques lettres, en anglais ou en français.' },
      { type: 'added', en: 'Free camera: leave your body and fly through anything, in singleplayer.', fr: 'Caméra libre : quitte ton corps et vole à travers tout, en solo.' },
      { type: 'added', en: 'Cinema mode: smooth movement, a hidden interface and camera paths to film your scenes.', fr: 'Mode cinéma : mouvements doux, interface cachée et trajets de caméra pour filmer tes scènes.' },
      { type: 'added', en: 'Three new disasters: tsunami, blizzard and sandstorm.', fr: 'Trois nouvelles catastrophes : tsunami, blizzard et tempête de sable.' },
      { type: 'added', en: 'Library previews: shared structures now get an automatic image on the website.', fr: 'Aperçus de la bibliothèque : les structures partagées ont maintenant une image automatique sur le site.' },
    ],
  },
  {
    version: '2.4.1',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'An animated example', fr: 'Un exemple animé' },
    changes: [
      { type: 'added', en: 'A new animated banner: Vess floats, blinks and bubbles. Pick vess-animated in the settings.', fr: 'Une nouvelle bannière animée : Vess flotte, cligne des yeux et fait des bulles. Choisis vess-animated dans les réglages.' },
    ],
  },
  {
    version: '2.4.0',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'Public library', fr: 'Bibliothèque publique' },
    changes: [
      { type: 'added', en: 'Public library: send your structures from the Library page. Once reviewed, every player can get them.', fr: 'Bibliothèque publique : envoie tes structures depuis la page Bibliothèque. Une fois vérifiées, tous les joueurs peuvent les récupérer.' },
      { type: 'added', en: 'Online library in the Structures menu: browse and download structures without leaving the game.', fr: 'Bibliothèque en ligne dans le menu Structures : parcours et télécharge des structures sans quitter le jeu.' },
      { type: 'added', en: 'Animated banners: GIF files now really move in the menu.', fr: 'Bannières animées : les fichiers GIF bougent maintenant vraiment dans le menu.' },
      { type: 'changed', en: 'The mushroom cloud is about 40% bigger and can be seen as far as your render distance allows.', fr: 'Le champignon est environ 40 % plus grand et se voit aussi loin que ta distance de rendu le permet.' },
    ],
  },
  {
    version: '2.3.0',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'Blueprints and zoom', fr: 'Plans et zoom' },
    changes: [
      { type: 'added', en: 'Blueprints: pin a ghost plan and build it yourself in survival, layer by layer, with a materials list.', fr: 'Plans : fixe un plan fantôme et construis-le toi-même en survie, couche par couche, avec la liste des matériaux.' },
      { type: 'added', en: 'Zoom: hold C to zoom in, with x2, x4 and x8 in the settings.', fr: 'Zoom : maintiens C pour zoomer, avec x2, x4 et x8 dans les réglages.' },
      { type: 'added', en: 'Every button now has a description under the menu, in English and French.', fr: 'Chaque bouton a maintenant une description sous le menu, en anglais et en français.' },
    ],
  },
  {
    version: '2.2.0',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'Structure Manager', fr: 'Gestionnaire de structures' },
    changes: [
      { type: 'added', en: 'Import: load Minecraft .nbt structure files, including files from older versions.', fr: 'Importer : charge les fichiers de structures .nbt de Minecraft, même ceux d\'anciennes versions.' },
      { type: 'added', en: 'Capture: pick two corners and save your build, chest contents included.', fr: 'Capturer : choisis deux coins et enregistre ta construction, contenu des coffres compris.' },
      { type: 'added', en: 'Preview: see a structure at the aimed block, with rotation, before placing it.', fr: 'Prévisualiser : vois une structure au bloc visé, avec sa rotation, avant de la placer.' },
      { type: 'added', en: 'Share: one action shows the file, ready to send to other players.', fr: 'Partager : une action affiche le fichier, prêt à envoyer à d\'autres joueurs.' },
      { type: 'added', en: 'Undo and redo for up to 20 changes, restoring chest contents too.', fr: 'Annuler et rétablir jusqu\'à 20 changements, contenu des coffres compris.' },
      { type: 'changed', en: 'Imported structures never place command blocks. Only import files from people you trust.', fr: "Les structures importées ne posent jamais de bloc de commande. N'importe que des fichiers de personnes de confiance." },
      { type: 'fixed', en: 'The ore radar could leave you stuck in rock inside a vein.', fr: 'Le radar à minerais pouvait te laisser coincé dans la roche au milieu d\'un filon.' },
    ],
  },
  {
    version: '2.1.0',
    date: { en: 'November 5, 2026', fr: '5 novembre 2026' },
    title: { en: 'English and Vess', fr: 'Anglais et Vess' },
    changes: [
      { type: 'added', en: 'The whole trainer is now available in English: menus, notifications and on-screen lists.', fr: 'Tout le trainer existe maintenant en anglais : menus, notifications et listes à l\'écran.' },
      { type: 'added', en: 'A Language setting: Auto follows your Minecraft language, or pick English or French.', fr: 'Un réglage Langue : Auto suit la langue de Minecraft, ou choisis anglais ou français.' },
      { type: 'changed', en: 'The default banner now shows Vess, the new mascot.', fr: 'La bannière par défaut montre maintenant Vess, la nouvelle mascotte.' },
    ],
  },
  {
    version: '2.0.0',
    date: { en: 'November 4, 2026', fr: '4 novembre 2026' },
    title: { en: 'Vessel Trainer', fr: 'Vessel Trainer' },
    changes: [
      { type: 'changed', en: 'The trainer is now called Vessel Trainer, and its version shows in the menu.', fr: 'Le trainer s\'appelle maintenant Vessel Trainer, et sa version s\'affiche dans le menu.' },
      { type: 'changed', en: 'The nuke was rebuilt from scratch: real crater, shockwave, flash and a giant mushroom cloud.', fr: 'La bombe a été refaite de zéro : vrai cratère, onde de choc, flash et champignon géant.' },
      { type: 'added', en: 'Custom banners: drop your own images in a folder and pick them in the settings.', fr: 'Bannières personnalisées : dépose tes images dans un dossier et choisis-les dans les réglages.' },
      { type: 'added', en: 'Disasters: tornado, earthquake, volcano and giant meteorite.', fr: 'Catastrophes : tornade, séisme, volcan et météorite géante.' },
      { type: 'added', en: 'Six new powers: flamethrower, Wither skull, freeze ray, grapple, telekinesis and chain lightning.', fr: 'Six nouveaux pouvoirs : lance-flammes, crâne de Wither, rayon de gel, grappin, télékinésie et foudre en chaîne.' },
      { type: 'added', en: 'Teleport to 11 structures and 8 biomes, or to a random place.', fr: 'Téléportation vers 11 structures et 8 biomes, ou vers un lieu au hasard.' },
      { type: 'added', en: '5 saved positions per world and 3 cheat profiles.', fr: '5 positions enregistrées par monde et 3 profils de cheats.' },
      { type: 'added', en: 'Infinite jumps, water walking, green thumb and auto repair.', fr: 'Sauts infinis, marche sur l\'eau, main verte et réparation automatique.' },
      { type: 'added', en: 'The trainer name sits on the hotbar, and the menu can move to the right.', fr: 'Le nom du trainer s\'accroche à la barre d\'objets, et le menu peut passer à droite.' },
    ],
  },
  {
    version: '1.0.0',
    date: { en: 'November 4, 2026', fr: '4 novembre 2026' },
    title: { en: 'First release', fr: 'Première version' },
    changes: [
      { type: 'added', en: 'The F4 menu, with Player, Teleport, Items, Creatures and World.', fr: 'Le menu F4, avec Joueur, Téléportation, Objets, Créatures et Monde.' },
      { type: 'added', en: 'Powers on the R key: fireball, laser, black hole, shockwave and more.', fr: 'Pouvoirs sur la touche R : boule de feu, laser, trou noir, onde de choc et plus.' },
      { type: 'added', en: 'Chaos: rains, time control, zombie apocalypse and giant creatures.', fr: 'Chaos : pluies, contrôle du temps, apocalypse zombie et créatures géantes.' },
      { type: 'added', en: 'Instant builds with undo, an ore radar, and themes.', fr: 'Constructions instantanées avec annulation, radar à minerais et thèmes.' },
      { type: 'fixed', en: 'Teleporting to the End and the Overworld failed while the menu said it worked.', fr: 'La téléportation vers l\'End et l\'Overworld échouait alors que le menu disait le contraire.' },
      { type: 'fixed', en: 'Invincibility could leave a dead player stuck with full health.', fr: 'L\'invincibilité pouvait laisser un joueur mort bloqué avec toute sa vie.' },
    ],
  },
];

const ROADMAP = {
  next: [
    { en: 'Older Minecraft versions', fr: 'Anciennes versions de Minecraft', note: { en: 'Versions for players who stay on an older game.', fr: 'Des versions pour ceux qui restent sur un ancien jeu.' } },
  ],
  planned: [
    { en: 'Minecraft 26.4 support', fr: 'Compatibilité Minecraft 26.4', note: { en: 'Once the version is released.', fr: 'Dès la sortie de cette version.' } },
    { en: 'Forge and NeoForge versions', fr: 'Versions Forge et NeoForge', note: { en: 'The trainer on the other mod loaders.', fr: 'Le trainer sur les autres chargeurs de mods.' } },
    { en: 'Charged powers', fr: 'Pouvoirs chargés', note: { en: 'Hold the R key to make any power stronger.', fr: "Maintiens la touche R pour rendre n'importe quel pouvoir plus fort." } },
    { en: 'Powers: attack', fr: 'Pouvoirs : attaque', note: { en: 'Pocket tornado, sword rain, wind blade, lava geyser, giant fist and arrow volley.', fr: "Tornade de poche, pluie d'épées, lame du vent, geyser de lave, poing géant et salve de flèches." } },
    { en: 'Powers: control', fr: 'Pouvoirs : contrôle', note: { en: 'Local time freeze, glass prison, creature magnet, mind control and repulsion.', fr: 'Gel du temps ciblé, prison de verre, aimant à créatures, contrôle mental et répulsion.' } },
    { en: 'Powers: movement', fr: 'Pouvoirs : déplacement', note: { en: 'Super leap, wall walking and walking through walls.', fr: 'Super bond, marche sur les murs et traversée des murs.' } },
    { en: 'Powers: defense', fr: 'Pouvoirs : défense', note: { en: 'Clones, area healing and smoke form.', fr: 'Clones, soin de zone et forme de fumée.' } },
    { en: 'Powers: building', fr: 'Pouvoirs : construction', note: { en: 'Instant wall, light bridge, drill and growth ray.', fr: 'Mur instantané, pont de lumière, foreuse et rayon de croissance.' } },
    { en: 'Powers: ultimates', fr: 'Pouvoirs : ultimes', note: { en: 'Targeted meteor shower, supernova and fire dragon.', fr: 'Pluie de météores ciblée, supernova et dragon de feu.' } },
  ],
  ideas: [
    { en: 'Admin mode for private servers', fr: 'Mode admin pour serveurs privés', note: { en: 'An admin panel for private servers: installed by the owner, for admins only. Run events with disasters for your players.', fr: 'Un panneau admin pour serveurs privés : installé par le propriétaire, réservé aux admins. Lance des événements avec des catastrophes pour tes joueurs.' } },
    { en: 'Vessel Launcher', fr: 'Vessel Launcher', note: { en: 'A launcher made for the trainer: one click and you play. You sign in with your own Microsoft account, so it only works if you own Minecraft.', fr: 'Un launcher fait pour le trainer : un clic et tu joues. Tu te connectes avec ton propre compte Microsoft, donc il faut posséder Minecraft.' } },
    { en: 'Build brush', fr: 'Pinceau de construction', note: { en: 'Paint, replace and sculpt blocks from a distance.', fr: 'Peins, remplace et sculpte des blocs à distance.' } },
    { en: '.schem import', fr: 'Import .schem', note: { en: 'Open WorldEdit files in the Structure Manager.', fr: 'Ouvre les fichiers WorldEdit dans le gestionnaire de structures.' } },
    { en: 'Banner library', fr: 'Bibliothèque de bannières', note: { en: 'Share your banners with other players.', fr: 'Partage tes bannières avec les autres joueurs.' } },
    { en: 'Creature creator', fr: 'Créateur de créatures', note: { en: 'Pick a size, health and gear before spawning.', fr: 'Choisis la taille, la vie et l\'équipement avant de faire apparaître.' } },
    { en: 'Theme creator', fr: 'Créateur de thèmes', note: { en: 'Choose your own menu colors.', fr: 'Choisis tes propres couleurs de menu.' } },
    { en: 'Item kits', fr: 'Kits d\'objets', note: { en: 'Save an inventory and get it back in one click.', fr: 'Enregistre un inventaire et récupère-le en un clic.' } },
    { en: 'Slow motion', fr: 'Ralenti', note: { en: 'Slow the world down to watch an explosion.', fr: 'Ralentis le monde pour regarder une explosion.' } },
    { en: 'Power wheel', fr: 'Roue des pouvoirs', note: { en: 'Switch powers with a radial menu.', fr: 'Change de pouvoir avec un menu circulaire.' } },
    { en: 'Shareable profiles', fr: 'Profils partageables', note: { en: 'Send your cheat setup to a friend.', fr: 'Envoyer sa configuration à un ami.' } },
    { en: 'Controller support', fr: 'Compatibilité manette', note: { en: 'Use the menu with a gamepad.', fr: 'Utiliser le menu avec une manette.' } },
  ],
};

/*
  Builds that do not exist yet: they show as Planned, without a download.
  Finished builds are not listed here: they appear by themselves from the site/releases folder.
*/
/* Shown under a build on the Versions page, by loader and game version. */
const BUILD_NOTES = {
  'forge-1.20.1': {
    en: 'Needs Forge 47 for Minecraft 1.20.1. No Fabric API needed. Not in this build: player size, creature size, time speed and time stop.',
    fr: 'Demande Forge 47 pour Minecraft 1.20.1, sans Fabric API. Absents de cette version : taille du joueur, taille des créatures, vitesse du temps et arrêt du temps.',
  },
};

const PLANNED_BUILDS = [
  ...['fabric', 'neoforge', 'forge'].map(loader => ({ loader, mc: '26.4', note: { en: 'Once Minecraft 26.4 is released.', fr: 'Dès la sortie de Minecraft 26.4.' } })),
  { loader: 'neoforge', mc: '26.3' },
  { loader: 'forge', mc: '26.3' },
  ...['26.2', '26.1.2', '1.21.11'].flatMap(mc => ['fabric', 'neoforge', 'forge'].map(loader => ({ loader, mc }))),
  { loader: 'fabric', mc: '1.20.1' },
  { loader: 'fabric', mc: '1.19.2' },
  { loader: 'forge', mc: '1.19.2' },
];
