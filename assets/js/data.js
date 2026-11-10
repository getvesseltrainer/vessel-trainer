/*
  Edit this file to update the site.
  CHANGELOG: add a new block at the TOP of the list for each release.
  ROADMAP: move items between the three lists.
  Each text has an English (en) and a French (fr) version.
*/
/* Project pages on the mod platforms. A button stays marked as coming soon until it has an address. */
const STORE_LINKS = { curseforge: 'https://www.curseforge.com/minecraft/mc-mods/vessel-trainer', modrinth: '' };

/* Donation pages. Paste your own address in url; a link stays hidden on the page until it has one. */
const SUPPORT_LINKS = [
  { name: 'Ko-fi', url: 'https://ko-fi.com/vesseltrainer', text: { en: 'Donate by card on Ko-fi.', fr: 'Fais un don par carte sur Ko-fi.' } },
  { name: 'PayPal', url: '', text: { en: 'A one-off donation by card or PayPal.', fr: 'Un don ponctuel par carte ou PayPal.' } },
  { name: 'GitHub Sponsors', url: '', text: { en: 'Support the project from your GitHub account.', fr: 'Soutiens le projet depuis ton compte GitHub.' } },
];

/*
  Discord partners, shown on the Partners page. Add one block per server.
  icon is a file in site/new/partners; icon, address and color are optional.
  address is a Minecraft server: its live status shows on the card. color tints the card, as #rrggbb.
*/
const PARTNERS = [
  {
    name: 'Xyro Craft',
    invite: 'https://discord.gg/fhunbBMmm8',
    icon: 'xyro-craft.webp',
    color: '#e0313a',
    address: 'gamenode3.cbr-cloud.com:25599',
    text: { en: 'A Minecraft Java server on version 26.3.', fr: 'Un serveur Minecraft Java en version 26.3.' },
  },
];

/*
  Accounts on the website. Paste the Project URL and the anon public key from Supabase, Project Settings, API.
  Both are meant to be public: what each person can do is decided by the rules in site/supabase/schema.sql.
  Never paste the service_role key here.
*/
const SUPABASE = { url: 'https://ifzrxjeypozpkhaoymoi.supabase.co', anonKey: 'sb_publishable_ZxDIf5OwVil4jrJfrhivQA_my8dzx_7' };

/* The form where players send banners. Empty it to hide the Share button. */
const BANNER_SUBMIT_URL = 'https://github.com/getvesseltrainer/vessel-trainer/issues/new?template=banner.yml';

/* The form where players send structures. Empty it to hide the Share button. */
const SUBMIT_URL = 'https://github.com/getvesseltrainer/vessel-trainer/issues/new?template=structure.yml';

const CHANGELOG = [
  {
    version: '2.13.1',
    date: { en: 'November 10, 2026', fr: '10 novembre 2026' },
    title: { en: 'More in 3D, and the mushroom cloud', fr: 'Encore plus de 3D, et le champignon' },
    changes: [
      { type: 'added', en: 'The nuke falls as a real bomb: olive body, yellow bands, the radiation sign and a box tail, nose first and faster and faster during the countdown.', fr: 'La nuke tombe comme une vraie bombe : corps vert olive, bandes jaunes, logo radioactif et queue à caisson, nez en avant et de plus en plus vite pendant le compte à rebours.' },
      { type: 'added', en: 'A 3D mushroom cloud for each yield: small and round for Tactical, a rolling ring under a dome for Strategic, huge and in two tiers for Tsar. It rises as a fireball, cools to smoke, with rings of condensation and a ring of dust on the ground.', fr: "Un champignon en 3D pour chaque puissance : petit et rond en Tactique, un anneau qui roule sous un dôme en Stratégique, immense et sur deux étages en Tsar. Il monte en boule de feu, refroidit en fumée, avec des anneaux de condensation et un anneau de poussière au sol." },
      { type: 'added', en: 'Energy shield: a sphere of blue hexagons around you. Flamethrower: a cone of fire out of the hand.', fr: "Bouclier d'énergie : une sphère d'hexagones bleus autour de toi. Lance-flammes : un cône de feu qui sort de la main." },
      { type: 'added', en: 'Frost ray: spikes of ice burst out of the ground. Sword rain: big glowing swords that stay stuck in the ground. Lava geyser: a column of flowing lava.', fr: 'Rayon de gel : des pics de glace jaillissent du sol. Pluie d’épées : de grandes épées lumineuses qui restent plantées dans le sol. Geyser de lave : une colonne de lave qui coule.' },
      { type: 'added', en: 'Drill, grapple, magnet, magic rod: a spinning drill bit, a steel hook on a rope, a horseshoe magnet over the head, a purple rod with a star.', fr: "Foreuse, grappin, aimant, canne magique : une mèche qui tourne, un crochet d'acier au bout d'une corde, un aimant en fer à cheval au-dessus de la tête, une canne violette avec une étoile." },
      { type: 'added', en: 'Glass prison, mind control, chain lightning, instant wall, light bridge, growth ray, super leap: crystal bars, a hypnotic spiral, zigzag arcs, glowing runes, railings of light, a ring of leaves and a burst of air.', fr: 'Prison de verre, contrôle mental, foudre en chaîne, mur instantané, pont de lumière, rayon de croissance, super bond : des barreaux de cristal, une spirale hypnotique, des arcs en zigzag, des runes lumineuses, des rambardes de lumière, un cercle de feuilles et un souffle d’air.' },
      { type: 'added', en: 'Fun tab: top hats, crowns and party hats, a sheet ghost, a mirror ball, a casino wheel for the surprise wheel, and a foam plastic sword.', fr: 'Onglet Fun : hauts-de-forme, couronnes et chapeaux de fête, un fantôme en drap, une boule à facettes, une roue de casino pour la roue surprise, et une épée en mousse.' },
      { type: 'fixed', en: 'The textures of the 3D models are no longer stretched or squashed: every face is painted at its own size.', fr: 'Les textures des modèles 3D ne sont plus étirées ni écrasées : chaque face est peinte à sa vraie taille.' },
      { type: 'fixed', en: 'The fire dragon looked backwards; its head now leads the way.', fr: 'Le dragon de feu regardait en arrière ; sa tête ouvre maintenant la marche.' },
    ],
  },
  {
    version: '2.13.0',
    date: { en: 'November 10, 2026', fr: '10 novembre 2026' },
    title: { en: 'Powers in 3D', fr: 'Des pouvoirs en 3D' },
    changes: [
      { type: 'added', en: 'Black hole: a black sphere ringed with light, and a glowing disk of gas spinning around it. It swells, then shrinks just before it blows.', fr: "Trou noir : une sphère noire cerclée de lumière, et un disque de gaz brûlant qui tourne autour. Il grossit, puis se resserre juste avant d'exploser." },
      { type: 'added', en: 'Giant fist: a real clenched hand in a purple sleeve comes down from the sky, squashes on impact and goes back up.', fr: "Poing géant : une vraie main serrée dans une manche violette tombe du ciel, s'écrase à l'impact et remonte." },
      { type: 'added', en: 'Fire dragon: a horned head, a long scaled body that follows it like a snake, and two flapping wings.', fr: 'Dragon de feu : une tête à cornes, un long corps à écailles qui la suit comme un serpent, et deux ailes qui battent.' },
      { type: 'added', en: 'Meteor and meteor shower: rocks of lava that tumble as they fall.', fr: 'Météore et pluie de météores : des roches en fusion qui tournoient en tombant.' },
      { type: 'added', en: 'Pocket tornado: a funnel of wind that spins as it moves forward.', fr: "Tornade de poche : un entonnoir de vent qui tourne en avançant." },
      { type: 'added', en: 'Laser and orbital beam: real beams of light, red for the laser, white and blue for the orbital beam.', fr: 'Laser et rayon orbital : de vrais faisceaux lumineux, rouge pour le laser, blanc et bleu pour le rayon orbital.' },
      { type: 'added', en: 'Wind blade: a pale crescent flies forward and cuts through everything.', fr: 'Lame du vent : un croissant pâle file droit devant et tranche tout.' },
      { type: 'added', en: 'Time freeze: a golden clock above the area, its hands spinning back then stopping dead, and a ring of ticks on the ground.', fr: "Gel du temps : une horloge dorée au-dessus de la zone, ses aiguilles qui tournent à l'envers puis s'arrêtent net, et un cercle gradué au sol." },
      { type: 'added', en: 'Supernova: a white star that swells and throbs faster and faster until it blows.', fr: "Supernova : une étoile blanche qui gonfle et palpite de plus en plus vite jusqu'à l'explosion." },
      { type: 'added', en: 'Shockwave: a ring of air spreads over the ground. Area healing: a circle of green and gold runes.', fr: "Onde de choc : un anneau d'air s'étend sur le sol. Soin de zone : un cercle de runes vertes et dorées." },
      { type: 'added', en: 'Portable trampoline: a black mat in a padded blue frame that sinks under each jump. Portals: glowing ovals with a turning swirl, purple and orange.', fr: 'Trampoline portable : une toile noire dans un cadre bleu rembourré, qui s’enfonce à chaque saut. Portails : des ovales lumineux avec un tourbillon qui tourne, violet et orange.' },
    ],
  },
  {
    version: '1.1 Paper 26.3',
    date: { en: 'November 10, 2026', fr: '10 novembre 2026' },
    title: { en: 'Admin tools on Paper', fr: 'Outils admin sur Paper' },
    changes: [
      { type: 'added', en: 'Admin tab > Me works on Paper: speed, night vision, heal, feed, your own game mode, teleport to the aimed block and item kits.', fr: "Onglet Admin > Moi marche sur Paper : vitesse, vision nocturne, soin, nourriture, ton propre mode de jeu, téléportation au bloc visé et kits d'objets." },
      { type: 'changed', en: 'The Paper plugin now has its own version number, separate from the trainer. This is 1.1.', fr: 'Le plugin Paper a maintenant son propre numéro de version, séparé du trainer. Celle-ci est la 1.1.' },
    ],
  },
  {
    version: '2.12.3',
    date: { en: 'November 9, 2026', fr: '9 novembre 2026' },
    title: { en: 'Herobrine (beta)', fr: 'Herobrine (bêta)' },
    changes: [
      { type: 'added', en: 'Creatures > Special summon > Herobrine (BETA): summon him at the aimed block. He stares at you with his glowing white eyes and vanishes when you come close.', fr: "Créatures > Apparitions spéciales > Herobrine (BETA) : fais-le apparaître au bloc visé. Il te fixe de ses yeux blancs lumineux et disparaît quand tu t'approches." },
      { type: 'added', en: 'The summoning altar from the legend: gold, netherrack and redstone torches. Light it and Herobrine answers. It can be undone.', fr: "L'autel d'invocation de la légende : or, netherrack et torches de redstone. Allume-le et Herobrine répond. Il s'annule comme une construction." },
      { type: 'added', en: 'Herobrine haunts you: he appears far off, near your builds, and vanishes when you stare at him. His presence goes from Discreet to Nightmare, where he can stand right behind you.', fr: "Herobrine te traque : il apparaît au loin, près de tes constructions, et disparaît quand tu le fixes. Sa présence va de Discret à Cauchemar, où il peut se tenir juste derrière toi." },
      { type: 'added', en: 'Two choices, both off by default: world changes (2 by 2 tunnels, bare trees, pyramids in the water, torches gone, each one can be undone) and attacks.', fr: 'Deux options, désactivées par défaut : les modifications du monde (tunnels 2 × 2, arbres sans feuilles, pyramides dans l\'eau, torches éteintes, chacune peut être annulée) et les attaques.' },
      { type: 'added', en: 'A new Modes tab in the main menu, starting with Become Herobrine: glowing white eyes, sight in the dark, animals that flee, teleporting behind a creature, lightning and torches put out.', fr: "Un nouvel onglet Modes dans le menu principal, avec d'abord Devenir Herobrine : yeux blancs lumineux, vision dans le noir, animaux qui fuient, téléportation derrière une créature, foudre et torches éteintes." },
      { type: 'added', en: 'Settings > Credits.', fr: 'Réglages > Crédits.' },
      { type: 'added', en: 'The Vessel HUD: purple hearts and food, a new crosshair and XP bar. It is on by default and can be turned off in Options > Resource Packs.', fr: "Le Vessel HUD : cœurs et nourriture violets, nouveau viseur et nouvelle barre d'XP. Il est activé par défaut et se désactive dans Options > Packs de ressources." },
      { type: 'added', en: 'Admin tab > Me: speed, night vision, heal, feed, your own game mode, teleport to the aimed block and item kits. The server checks that you are an admin.', fr: "Onglet Admin > Moi : vitesse, vision nocturne, soin, nourriture, ton propre mode de jeu, téléportation au bloc visé et kits d'objets. Le serveur vérifie que tu es admin." },
      { type: 'changed', en: "On a server, the server's admins can now use X-ray, aimbot, the minimap and the free camera.", fr: "Sur un serveur, les admins du serveur peuvent maintenant utiliser le X-ray, l'aimbot, la minimap et la caméra libre." },
      { type: 'changed', en: 'On a server, the rest of the menu stays visible but greyed out, and says it is not available on a server yet.', fr: "Sur un serveur, le reste du menu reste visible mais grisé, et indique qu'il n'est pas encore disponible sur un serveur." },
      { type: 'fixed', en: 'The orbital beam now destroys what stands in it. Creatures could survive because every other strike was ignored.', fr: "Le rayon orbital détruit maintenant ce qui se trouve dedans. Les créatures pouvaient survivre car un coup sur deux était ignoré." },
    ],
  },
  {
    version: '2.12.1',
    date: { en: 'November 9, 2026', fr: '9 novembre 2026' },
    title: { en: '24 new powers', fr: '24 nouveaux pouvoirs' },
    changes: [
      { type: 'added', en: 'Attack powers: pocket tornado, sword rain, wind blade, lava geyser, giant fist and arrow volley.', fr: "Pouvoirs d'attaque : tornade de poche, pluie d'épées, lame du vent, geyser de lave, poing géant et salve de flèches." },
      { type: 'added', en: 'Control powers: targeted time freeze, glass prison, creature magnet, mind control and repulsion.', fr: 'Pouvoirs de contrôle : gel du temps ciblé, prison de verre, aimant à créatures, contrôle mental et répulsion.' },
      { type: 'added', en: 'Movement powers: super leap, wall walking and walking through walls.', fr: 'Pouvoirs de déplacement : super bond, marche sur les murs et traversée des murs.' },
      { type: 'added', en: 'Defense powers: clones that draw the monsters, area healing and smoke form.', fr: 'Pouvoirs de défense : des clones qui attirent les monstres, soin de zone et forme de fumée.' },
      { type: 'added', en: 'Building powers: instant wall (it can be undone), light bridge, drill and growth ray.', fr: 'Pouvoirs de construction : mur instantané (il peut être annulé), pont de lumière, foreuse et rayon de croissance.' },
      { type: 'added', en: 'Ultimate powers: targeted meteor shower, supernova and fire dragon.', fr: 'Pouvoirs ultimes : pluie de météores ciblée, supernova et dragon de feu.' },
      { type: 'fixed', en: 'Powers that target a creature no longer pick one that is already dying.', fr: "Les pouvoirs qui visent une créature ne choisissent plus une créature déjà en train de mourir." },
    ],
  },
  {
    version: '2.12.0',
    date: { en: 'November 9, 2026', fr: '9 novembre 2026' },
    title: { en: 'VESSELCRAFT', fr: 'VESSELCRAFT' },
    changes: [
      { type: 'added', en: 'A new title screen: the VESSELCRAFT logo with TRAINER EDITION under it, and Vess floating beside it.', fr: "Un nouvel écran d'accueil : le logo VESSELCRAFT avec TRAINER EDITION dessous, et Vess qui flotte à côté." },
      { type: 'added', en: 'Vess has its own yellow lines on the title screen, in English or French. The holiday ones stay.', fr: "Vess a ses propres phrases jaunes sur l'écran d'accueil, en français ou en anglais. Celles des fêtes restent." },
      { type: 'added', en: 'A Vess button with the small icons under Minecraft Realms: what is new in your version, and links to the site, the Discord and CurseForge.', fr: "Un bouton Vess avec les petites icônes sous Minecraft Realms : les nouveautés de ta version, et les liens vers le site, le Discord et CurseForge." },
      { type: 'added', en: 'The title screen shows your version and tells you when a newer one is out.', fr: "L'écran d'accueil affiche ta version et te prévient quand une plus récente est sortie." },
      { type: 'changed', en: "Settings: turn the Vessel title screen or the update check off to get the game's own back.", fr: "Réglages : coupe l'écran d'accueil Vessel ou la vérification des mises à jour pour retrouver ceux du jeu." },
    ],
  },
  {
    version: '2.11.3',
    date: { en: 'November 8, 2026', fr: '8 novembre 2026' },
    title: { en: 'A centered title', fr: 'Un titre centré' },
    changes: [
      { type: 'fixed', en: 'The title of the example banners is now centered on the whole banner, on the still one and the GIF.', fr: "Le titre des bannières d'exemple est maintenant centré sur toute la bannière, sur l'image comme sur le GIF." },
      { type: 'changed', en: 'Example banners from 2.11.2 are updated by themselves too, unless you changed them.', fr: "Les bannières d'exemple de la 2.11.2 se mettent aussi à jour toutes seules, sauf si tu les as modifiées." },
    ],
  },
  {
    version: '2.11.2',
    date: { en: 'November 8, 2026', fr: '8 novembre 2026' },
    title: { en: 'A straighter banner', fr: 'Une bannière bien droite' },
    changes: [
      { type: 'fixed', en: 'The menu banner: the title is smaller and centered, and no longer crowds the version number.', fr: 'La bannière du menu : le titre est plus petit et centré, et ne serre plus le numéro de version.' },
      { type: 'changed', en: 'The example banners in your banners folder are updated by themselves, unless you changed them.', fr: "Les bannières d'exemple de ton dossier se mettent à jour toutes seules, sauf si tu les as modifiées." },
    ],
  },
  {
    version: '1.0 Paper 26.3',
    date: { en: 'November 7, 2026', fr: '7 novembre 2026' },
    title: { en: 'Paper servers', fr: 'Serveurs Paper' },
    changes: [
      { type: 'added', en: "The Admin tab now works on Paper 26.3 servers too, with the Vessel Trainer plugin in the server's plugins folder.", fr: "L'onglet Admin marche maintenant aussi sur les serveurs Paper 26.3, avec le plugin Vessel Trainer dans le dossier plugins du serveur." },
      { type: 'added', en: 'On Paper, every op is an admin. The vesseltrainer.admin and vesseltrainer.owner permissions can narrow that down.', fr: 'Sur Paper, chaque op est admin. Les permissions vesseltrainer.admin et vesseltrainer.owner permettent de restreindre.' },
      { type: 'changed', en: 'Events are not on Paper yet, so the tab hides them there.', fr: "Les événements ne sont pas encore sur Paper, donc l'onglet les y cache." },
    ],
  },
  {
    version: '2.11.1',
    date: { en: 'November 7, 2026', fr: '7 novembre 2026' },
    title: { en: 'Your menu, your ore', fr: 'Ton menu, ton minerai' },
    changes: [
      { type: 'added', en: 'X-ray: pick one ore to show, like diamond or ancient debris, or keep them all.', fr: 'X-ray : choisis un seul minerai à montrer, comme le diamant ou les débris antiques, ou garde-les tous.' },
      { type: 'added', en: 'Move the menu: with the menu open, press Alt once and drag it anywhere with the mouse. The spot is saved, and Settings can put it back.', fr: "Déplace le menu : menu ouvert, appuie une fois sur Alt et glisse-le où tu veux avec la souris. L'endroit est enregistré, et les Réglages peuvent le remettre en place." },
      { type: 'fixed', en: 'Admin tab: removing monsters or dropped items no longer misses some of them.', fr: "Onglet Admin : retirer les monstres ou les objets au sol n'en oublie plus." },
    ],
  },
  {
    version: '2.11.0',
    date: { en: 'November 7, 2026', fr: '7 novembre 2026' },
    title: { en: 'See more', fr: 'Voir plus loin' },
    changes: [
      { type: 'added', en: 'X-ray, under Player: see ores through the ground, or treasures like chests and spawners too.', fr: 'X-ray, dans Joueur : vois les minerais à travers le sol, ou aussi les trésors comme les coffres et les générateurs.' },
      { type: 'added', en: 'Aimbot, under Player: aims by itself at monsters, animals or any creature in front of you. Players are never targeted.', fr: 'Aimbot, dans Joueur : vise tout seul les monstres, les animaux ou toute créature devant toi. Les joueurs ne sont jamais visés.' },
      { type: 'added', en: 'Minimap: a map of the area, north up, in three sizes. Turn it on in the settings.', fr: 'Mini-carte : une carte des alentours, le nord en haut, en trois tailles. Active-la dans les réglages.' },
      { type: 'changed', en: 'Like the rest of the trainer, all three only work in singleplayer and switch off on a server.', fr: 'Comme le reste du trainer, les trois ne marchent qu’en solo et se coupent sur un serveur.' },
    ],
  },
  {
    version: '2.10.0',
    date: { en: 'November 7, 2026', fr: '7 novembre 2026' },
    title: { en: 'The creative update', fr: 'La mise à jour créative' },
    changes: [
      { type: 'added', en: 'Build brush: paint, replace, raise, dig and smooth blocks from a distance. A whole stroke undoes in one go.', fr: "Pinceau de construction : peins, remplace, élève, creuse et lisse les blocs à distance. Un trait entier s'annule d'un seul coup." },
      { type: 'added', en: '.schem import: open WorldEdit files in the Structure Manager, with their chests and from older game versions too.', fr: 'Import .schem : ouvre les fichiers WorldEdit dans le Gestionnaire de structures, avec leurs coffres, même depuis de vieilles versions du jeu.' },
      { type: 'added', en: 'Banner library: browse and share banners on the website, and download them straight from the game.', fr: 'Bibliothèque de bannières : parcours et partage des bannières sur le site, et télécharge-les directement depuis le jeu.' },
      { type: 'added', en: 'Creature creator: pick a creature, its size, health and gear before it appears.', fr: "Créateur de créatures : choisis une créature, sa taille, sa vie et son équipement avant qu'elle apparaisse." },
      { type: 'added', en: 'Power wheel: hold G, point at a power and let go.', fr: 'Roue des pouvoirs : maintiens G, pointe un pouvoir et relâche.' },
      { type: 'added', en: 'Controller support: use the menu with a gamepad.', fr: 'Prise en charge des manettes : utilise le menu avec une manette.' },
    ],
  },
  {
    version: '2.9.0',
    date: { en: 'November 6, 2026', fr: '6 novembre 2026' },
    title: { en: 'Make it yours', fr: 'À ta façon' },
    changes: [
      { type: 'added', en: 'Item kits: save your inventory in 3 slots and get it back in one click, in any world.', fr: "Kits d'objets : enregistre ton inventaire dans 3 emplacements et retrouve-le en un clic, dans n'importe quel monde." },
      { type: 'added', en: 'Slow motion: slow the world to a quarter of its speed with one button, to watch an explosion.', fr: 'Ralenti : ralentis le monde à un quart de sa vitesse en un bouton, pour admirer une explosion.' },
      { type: 'added', en: 'Theme creator: pick the hue, brightness and fade of your menu.', fr: 'Créateur de thème : choisis la teinte, la luminosité et le dégradé de ton menu.' },
      { type: 'added', en: 'Shareable profiles: copy a profile as a code and send it to a friend. A code can only hold cheat settings, and it cannot start world effects.', fr: "Profils partageables : copie un profil sous forme de code et envoie-le à un ami. Un code ne contient que des réglages de cheats et ne peut pas lancer d'effets sur le monde." },
    ],
  },
  {
    version: '2.8.0',
    date: { en: 'November 6, 2026', fr: '6 novembre 2026' },
    title: { en: 'The Admin tab', fr: "L'onglet Admin" },
    changes: [
      { type: 'added', en: 'Admin tab: a full admin panel for private servers. The owner installs the trainer on the server, and only its admins get the tab.', fr: "Onglet Admin : un vrai panneau d'administration pour les serveurs privés. Le propriétaire installe le trainer sur le serveur, et seuls ses admins ont l'onglet." },
      { type: 'added', en: 'Players: teleport, heal, feed, freeze, mute, game mode, inventory and Ender chest view, kick, ban and op rights.', fr: "Joueurs : téléportation, soin, nourriture, gel, muet, mode de jeu, vue de l'inventaire et du coffre de l'Ender, expulsion, bannissement et droits d'op." },
      { type: 'added', en: 'Server tools: announcements, chat mute, whitelist, unban, time, weather, difficulty, server rules, world cleanup, saving and live performance.', fr: 'Outils serveur : annonces, coupure du chat, liste blanche, débannissement, heure, météo, difficulté, règles, nettoyage du monde, sauvegarde et performances en direct.' },
      { type: 'added', en: 'Events: admins can start the disasters and the bomb on their server for their players.', fr: 'Événements : les admins peuvent lancer les catastrophes et la bombe sur leur serveur pour leurs joueurs.' },
      { type: 'added', en: 'Every admin action is checked by the server and written to logs/vessel-admin.log.', fr: 'Chaque action admin est vérifiée par le serveur et écrite dans logs/vessel-admin.log.' },
      { type: 'changed', en: 'The rest of the trainer stays singleplayer only, even for admins.', fr: 'Le reste du trainer reste réservé au solo, même pour les admins.' },
    ],
  },
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

/* Roadmap categories: each item has a cat, which colours its tag and lets visitors filter. */
const ROADMAP_CATEGORIES = {
  powers: { en: "Powers", fr: "Pouvoirs" },
  world: { en: "World & chaos", fr: "Monde et chaos" },
  build: { en: "Building", fr: "Construction" },
  fun: { en: "Fun & modes", fr: "Fun et modes" },
  tools: { en: "Tools", fr: "Outils" },
  servers: { en: "Servers", fr: "Serveurs" },
  versions: { en: "Versions", fr: "Versions" },
};

/* Where communities ask to become partners. Empty it to hide its button. */
const PARTNER_URL = 'https://github.com/getvesseltrainer/vessel-trainer/issues/new?template=partner.yml';

/* Where players send their own ideas. Empty one to hide its button. */
const IDEA_URL = 'https://github.com/getvesseltrainer/vessel-trainer/issues/new?template=idea.yml';
const DISCORD_URL = 'https://discord.gg/ansJXWAek6';

const ROADMAP = {
  next: [
    { cat: 'versions', en: "Older Minecraft versions", fr: "Anciennes versions de Minecraft", note: { en: "Versions for players who stay on an older game.", fr: "Des versions pour ceux qui restent sur un ancien jeu." } },
    { cat: 'powers', en: "Charged powers", fr: "Pouvoirs chargés", note: { en: "Hold the R key to make any power stronger.", fr: "Maintiens la touche R pour rendre n'importe quel pouvoir plus fort." } },
  ],
  planned: [
    { cat: 'fun', en: "More Become modes", fr: "D'autres modes Devenir", note: { en: "New ways to play as someone else in the Modes tab, like becoming the Warden, the Ender Dragon or a creeper.", fr: "De nouvelles façons de jouer dans la peau de quelqu'un d'autre, dans l'onglet Modes : devenir le Warden, l'Ender Dragon ou un creeper." } },
    { cat: 'world', en: "Tornado strengths, EF0 to EF5", fr: "Forces de tornade, EF0 à EF5", note: { en: "Pick the tornado on the Enhanced Fujita scale: from EF0, which snaps branches, to EF5, which wipes out everything in its path.", fr: "Choisis ta tornade sur l'échelle de Fujita améliorée : de l'EF0, qui casse des branches, à l'EF5, qui rase tout sur son passage." } },
    { cat: 'versions', en: "Minecraft 26.4 support", fr: "Compatibilité Minecraft 26.4", note: { en: "Once the version is released.", fr: "Dès la sortie de cette version." } },
    { cat: 'versions', en: "Forge and NeoForge versions", fr: "Versions Forge et NeoForge", note: { en: "The trainer on the other mod loaders.", fr: "Le trainer sur les autres chargeurs de mods." } },
  ],
  ideas: [
    { cat: 'tools', en: "Vessel Launcher", fr: "Vessel Launcher", note: { en: "A launcher made for the trainer: one click and you play. You sign in with your own Microsoft account, so it only works if you own Minecraft.", fr: "Un launcher fait pour le trainer : un clic et tu joues. Tu te connectes avec ton propre compte Microsoft, donc il faut posséder Minecraft." } },
    { cat: 'fun', en: "Vess, your pet", fr: "Vess, ton familier", note: { en: "Vess follows you in the world, sniffs out ores nearby and cheers when you pull off something big.", fr: "Vess te suit dans le monde, flaire les minerais autour de toi et te félicite quand tu réussis un gros coup." } },
    { cat: 'powers', en: "Combined powers", fr: "Pouvoirs combinés", note: { en: "Mix two powers into a new one: a fire tornado, a frozen meteor, a lightning black hole.", fr: "Mélange deux pouvoirs pour en créer un nouveau : tornade de feu, météorite gelée, trou noir électrique." } },
    { cat: 'world', en: "Blood moon", fr: "Lune de sang", note: { en: "A red night where monsters are stronger and more numerous, with better loot for those who last until dawn.", fr: "Une nuit rouge où les monstres sont plus forts et plus nombreux, avec un meilleur butin pour ceux qui tiennent jusqu'à l'aube." } },
    { cat: 'world', en: "Extreme weather", fr: "Météo extrême", note: { en: "Hail that hurts, acid rain that eats the leaves, and northern lights over the night sky.", fr: "De la grêle qui fait mal, une pluie acide qui ronge les feuilles et des aurores boréales dans le ciel de nuit." } },
    { cat: 'world', en: "Rewind time", fr: "Retour dans le temps", note: { en: "Turn the last 30 seconds back around you: blocks, creatures and your own position.", fr: "Remonte les 30 dernières secondes autour de toi : les blocs, les créatures et ta propre position." } },
    { cat: 'build', en: "Terrain sculptor", fr: "Sculpteur de terrain", note: { en: "A brush to raise hills, dig valleys, smooth and flatten the ground, with undo.", fr: "Un pinceau pour monter des collines, creuser des vallées, lisser et aplanir le sol, avec annulation." } },
    { cat: 'build', en: "Copy and paste an area", fr: "Copier-coller d'une zone", note: { en: "Pick two corners, copy, turn it and paste it anywhere. Every paste can be undone.", fr: "Choisis deux coins, copie, tourne et colle où tu veux. Chaque collage s'annule." } },
    { cat: 'build', en: "Village generator", fr: "Générateur de village", note: { en: "A whole town in one press: roads, houses, a square and a well, matched to the biome.", fr: "Une ville entière en un appui : routes, maisons, place et puits, adaptés au biome." } },
    { cat: 'fun', en: "Boss creator", fr: "Créateur de boss", note: { en: "Turn any creature into a boss with a health bar, phases and its own attacks.", fr: "Transforme n'importe quelle créature en boss, avec une barre de vie, des phases et ses propres attaques." } },
    { cat: 'fun', en: "New mini-games", fr: "Nouveaux mini-jeux", note: { en: "An elytra race through rings, a parkour course built for you, and a treasure hunt.", fr: "Une course d'élytres à travers des anneaux, un parcours de parkour construit pour toi et une chasse au trésor." } },
    { cat: 'fun', en: "Daily challenge", fr: "Défi du jour", note: { en: "A new challenge every day, with a random set of rules. Same challenge for everyone.", fr: "Un nouveau défi chaque jour, avec des règles tirées au hasard. Le même défi pour tout le monde." } },
    { cat: 'fun', en: "Vessel achievements", fr: "Succès Vessel", note: { en: "Trainer achievements to unlock while you play, from your first bomb to surviving a blood moon.", fr: "Des succès du trainer à débloquer en jouant, de ta première bombe à une lune de sang survécue." } },
    { cat: 'tools', en: "Photo mode", fr: "Mode photo", note: { en: "Freeze the game, hide the interface, add filters and depth of field, and take timed shots.", fr: "Fige le jeu, cache l'interface, ajoute des filtres et du flou de profondeur, et prends des photos avec retardateur." } },
    { cat: 'tools', en: "World map", fr: "Carte du monde", note: { en: "A full-screen map of everything you explored. Click a spot to go there, with your waypoints on it.", fr: "Une carte plein écran de tout ce que tu as exploré. Clique sur un endroit pour y aller, avec tes points de passage dessus." } },
    { cat: 'tools', en: "Session stats", fr: "Statistiques de session", note: { en: "Blocks broken, creatures beaten, distance travelled and the powers you used the most.", fr: "Blocs cassés, créatures battues, distance parcourue et les pouvoirs que tu utilises le plus." } },
    { cat: 'tools', en: "Macros", fr: "Macros", note: { en: "Chain several actions on one key: fly, night vision and teleport, in one press.", fr: "Enchaîne plusieurs actions sur une seule touche : vol, vision nocturne et téléportation, en un appui." } },
    { cat: 'tools', en: "More languages", fr: "Plus de langues", note: { en: "The trainer and the site in Spanish, German and Portuguese.", fr: "Le trainer et le site en espagnol, en allemand et en portugais." } },
    { cat: 'servers', en: "Trainer with friends on LAN", fr: "Trainer entre amis en LAN", note: { en: "The host of a LAN world can let chosen friends use the trainer too.", fr: "L'hôte d'un monde en LAN peut laisser des amis choisis utiliser le trainer aussi." } },
    { cat: 'servers', en: "Admin roles", fr: "Rôles admin", note: { en: "Moderator, admin and owner, each with the rights you choose in the Admin tab.", fr: "Modérateur, admin et propriétaire, chacun avec les droits que tu choisis dans l'onglet Admin." } },
    { cat: 'servers', en: "Events on Paper", fr: "Événements sur Paper", note: { en: "The disasters and the bomb from the Admin tab, on Paper servers too.", fr: "Les catastrophes et la bombe de l'onglet Admin, aussi sur les serveurs Paper." } },
    { cat: 'powers', en: "Grappling hook", fr: "Grappin", note: { en: "Shoot a hook at a block and swing or pull yourself to it, like a hero across rooftops.", fr: "Lance un grappin sur un bloc et balance-toi ou tire-toi jusqu'à lui, comme un héros sur les toits." } },
    { cat: 'powers', en: "Wingsuit", fr: "Wingsuit", note: { en: "Jump from high up and glide far without elytra. Dive to speed up, pull up to slow down.", fr: "Saute de haut et plane loin sans élytres. Pique pour accélérer, redresse pour ralentir." } },
    { cat: 'powers', en: "Power tree", fr: "Arbre de pouvoirs", note: { en: "Use a power often and it levels up: a wider shockwave, a longer laser, a bigger black hole.", fr: "Plus tu utilises un pouvoir, plus il monte en niveau : onde de choc plus large, laser plus long, trou noir plus grand." } },
    { cat: 'world', en: "Pocket dimension", fr: "Dimension de poche", note: { en: "Your own empty world, one press away, to build or test in peace. Press again to come back where you were.", fr: "Ton propre monde vide, à un appui, pour construire ou tester tranquille. Rappuie pour revenir où tu étais." } },
    { cat: 'world', en: "Alien invasion", fr: "Invasion extraterrestre", note: { en: "Flying saucers fill the sky and beam creatures up. Shoot them down before they take the whole village.", fr: "Des soucoupes volantes envahissent le ciel et aspirent les créatures. Abats-les avant qu'elles n'emportent tout le village." } },
    { cat: 'world', en: "Rising seas", fr: "La mer monte", note: { en: "The water level climbs block by block. Build high, or swim. Everything goes back when it ends.", fr: "Le niveau de l'eau monte bloc par bloc. Construis haut, ou nage. Tout revient comme avant à la fin." } },
    { cat: 'world', en: "Kaiju attack", fr: "Attaque de kaiju", note: { en: "A creature the size of a building walks through your world and crushes what it steps on.", fr: "Une créature grande comme un immeuble traverse ton monde et écrase ce qu'elle piétine." } },
    { cat: 'world', en: "Seasons", fr: "Saisons", note: { en: "Spring, summer, autumn and winter in turn: leaves change colour, snow falls, crops grow faster or slower.", fr: "Printemps, été, automne et hiver à tour de rôle : les feuilles changent de couleur, la neige tombe, les cultures poussent plus ou moins vite." } },
    { cat: 'world', en: "Crumbling world", fr: "Monde qui s’effondre", note: { en: "For a while, every block falls like sand. Bridges drop, caves cave in. It can be undone.", fr: "Pendant un moment, chaque bloc tombe comme du sable. Les ponts s'écroulent, les grottes s'effondrent. Ça s'annule." } },
    { cat: 'world', en: "Sky editor", fr: "Éditeur de ciel", note: { en: "Pick the colour of the sky, the size of the sun, two moons or a sky full of stars in broad daylight.", fr: "Choisis la couleur du ciel, la taille du soleil, deux lunes ou un ciel plein d’étoiles en plein jour." } },
    { cat: 'build', en: "Biome painter", fr: "Pinceau de biome", note: { en: "Paint a biome onto the ground: grass, water and leaf colours change, and so does the weather there.", fr: "Peins un biome sur le sol : la couleur de l'herbe, de l'eau et des feuilles change, et la météo aussi." } },
    { cat: 'build', en: "Dungeon generator", fr: "Générateur de donjon", note: { en: "Rooms, corridors, traps, monsters and a chest at the end, built under your feet in one press.", fr: "Des salles, des couloirs, des pièges, des monstres et un coffre au bout, construits sous tes pieds en un appui." } },
    { cat: 'build', en: "Traps", fr: "Pièges", note: { en: "Place ready-made traps: a hidden pit, arrows from the walls, quicksand, a cage that drops on monsters.", fr: "Pose des pièges tout prêts : fosse cachée, flèches qui sortent des murs, sables mouvants, cage qui tombe sur les monstres." } },
    { cat: 'build', en: "Instant farm", fr: "Ferme instantanée", note: { en: "A working farm in one press: fields with water, crops already planted, and a fence around it.", fr: "Une ferme qui marche en un appui : des champs avec de l'eau, des cultures déjà plantées et une clôture autour." } },
    { cat: 'fun', en: "Flying mount", fr: "Monture volante", note: { en: "Ride a creature through the sky and steer it with your view: a phantom, a ghast or a dragon.", fr: "Chevauche une créature dans le ciel et dirige-la avec ton regard : un phantom, un ghast ou un dragon." } },
    { cat: 'fun', en: "Tower defense", fr: "Tower defense", note: { en: "Waves of monsters walk a path to your base. Place towers that shoot, freeze or burn them.", fr: "Des vagues de monstres suivent un chemin jusqu’à ta base. Pose des tours qui les tirent, les gèlent ou les brûlent." } },
    { cat: 'fun', en: "Nemesis", fr: "Némésis", note: { en: "A creature that remembers you. Each time you beat it, it comes back stronger, with a new name and new tricks.", fr: "Une créature qui se souvient de toi. Chaque fois que tu la bats, elle revient plus forte, avec un nouveau nom et de nouveaux tours." } },
    { cat: 'fun', en: "Villager editor", fr: "Éditeur de villageois", note: { en: "Give a villager a name, a job, your own trades and a line to say when you come near.", fr: "Donne à un villageois un nom, un métier, tes propres échanges et une phrase à dire quand tu t'approches." } },
    { cat: 'tools', en: "Item creator", fr: "Créateur d'objets", note: { en: "Make your own item: its name and colour, a text under it, any enchantment at any level, and its stats.", fr: "Crée ton propre objet : son nom et sa couleur, un texte en dessous, n'importe quel enchantement à n'importe quel niveau, et ses statistiques." } },
    { cat: 'tools', en: "Speedrun mode", fr: "Mode speedrun", note: { en: "A timer on screen with splits for the Nether, the fortress, the End and the dragon. The trainer stays off until the end.", fr: "Un chrono à l'écran avec des temps intermédiaires pour le Nether, la forteresse, l'End et le dragon. Le trainer reste coupé jusqu'à la fin." } },
    { cat: 'tools', en: "Creature radar", fr: "Radar de créatures", note: { en: "Find the nearest axolotl, panda, mooshroom or any creature you pick, and go to it in one press.", fr: "Trouve l'axolotl, le panda, la meuh-champignon ou la créature de ton choix la plus proche, et vas-y en un appui." } },
    { cat: 'tools', en: "World checkpoints", fr: "Points de sauvegarde", note: { en: "Save the whole area around you before a risky test, and put it all back in one press.", fr: "Sauvegarde toute la zone autour de toi avant un test risqué, et remets tout comme avant en un appui." } },
    { cat: 'tools', en: "Guided tour", fr: "Visite guidée", note: { en: "For new players: the trainer shows its main tabs one by one, right in the game.", fr: "Pour les nouveaux : le trainer montre ses onglets principaux un par un, directement en jeu." } },
    { cat: 'servers', en: "Event scheduler", fr: "Événements programmés", note: { en: "Admins plan a tornado at 9 pm or a meteor every hour, and the server runs it on time.", fr: "Les admins programment une tornade à 21 h ou une météorite toutes les heures, et le serveur la lance à l’heure." } },
    { cat: 'servers', en: "Admin panel on the web", fr: "Panneau admin sur le web", note: { en: "Manage your server from vesseltrainer.org: players, bans and events, without opening the game.", fr: "Gère ton serveur depuis vesseltrainer.org : joueurs, bannissements et événements, sans ouvrir le jeu." } },
  ],
};

/*
  Builds that do not exist yet: they show as Planned, without a download.
  Finished builds are not listed here: they appear by themselves from the site/releases folder.
*/
/* Shown under a build on the Versions page, by loader and game version. */
const BUILD_NOTES = {
  'paper-26.3': {
    en: 'A server plugin, not the trainer: it turns on the Admin tab on a Paper 26.3 server. Put it in the server\'s plugins folder; admins use the Fabric 26.3 trainer. Events are not in it yet.',
    fr: "Un plugin pour le serveur, pas le trainer : il active l'onglet Admin sur un serveur Paper 26.3. Mets-le dans le dossier plugins du serveur ; les admins utilisent le trainer Fabric 26.3. Les événements n'y sont pas encore.",
  },
  'forge-1.20.1': {
    en: 'Needs Forge 47 for Minecraft 1.20.1. No Fabric API needed. Not in this build: player size, creature size, time speed, time stop and the Admin tab.',
    fr: 'Demande Forge 47 pour Minecraft 1.20.1, sans Fabric API. Absents de cette version : taille du joueur, taille des créatures, vitesse du temps, arrêt du temps et onglet Admin.',
  },
};

/* What each build needs, shown on its card on the Versions page, by loader and game version. */
const BUILD_NEEDS = {
  'fabric-26.3': ['Fabric Loader 0.20.1+', 'Fabric API', 'Java 25'],
  'paper-26.3': ['Paper 26.3', 'Java 25'],
  'forge-1.20.1': ['Forge 47', 'Java 17'],
};
const FABRIC_INSTALLER_URL = 'https://fabricmc.net/use/installer/';
const FABRIC_API_URL = 'https://modrinth.com/mod/fabric-api';

const PLANNED_BUILDS = [
  ...['fabric', 'neoforge', 'forge'].map(loader => ({ loader, mc: '26.4', note: { en: 'Once Minecraft 26.4 is released.', fr: 'Dès la sortie de Minecraft 26.4.' } })),
  { loader: 'neoforge', mc: '26.3' },
  { loader: 'forge', mc: '26.3' },
  ...['26.2', '26.1.2', '1.21.11'].flatMap(mc => ['fabric', 'neoforge', 'forge'].map(loader => ({ loader, mc }))),
  { loader: 'fabric', mc: '1.20.1' },
  { loader: 'fabric', mc: '1.19.2' },
  { loader: 'forge', mc: '1.19.2' },
];
