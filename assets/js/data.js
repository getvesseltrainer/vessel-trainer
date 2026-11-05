/*
  Edit this file to update the site.
  CHANGELOG: add a new block at the TOP of the list for each release.
  ROADMAP: move items between the three lists.
  Each text has an English (en) and a French (fr) version.
*/
/* Donation pages. Paste your own address in url; a link stays hidden on the page until it has one. */
const SUPPORT_LINKS = [
  { name: 'Ko-fi', url: 'https://ko-fi.com/vesseltrainer', text: { en: 'Donate by card on Ko-fi.', fr: 'Fais un don par carte sur Ko-fi.' } },
  { name: 'PayPal', url: '', text: { en: 'A one-off donation by card or PayPal.', fr: 'Un don ponctuel par carte ou PayPal.' } },
  { name: 'GitHub Sponsors', url: '', text: { en: 'Support the project from your GitHub account.', fr: 'Soutiens le projet depuis ton compte GitHub.' } },
];

/* The address where players send structures. Empty until the library is online. */
const SUBMIT_URL = '';

/* Add a structure: put its .nbt in the library folder, its image in assets/img/library, then add a block here. */
const LIBRARY = [
  { id: 'vess-statue', author: 'Vessel Trainer', name: { en: 'Vess statue', fr: 'Statue de Vess' }, text: { en: 'The mascot in glass and concrete, cork included.', fr: 'La mascotte en verre et en béton, bouchon compris.' } },
  { id: 'shelter', author: 'Vessel Trainer', name: { en: 'Furnished shelter', fr: 'Abri équipé' }, text: { en: 'A wooden shelter with a crafting table, furnace and chest.', fr: 'Un abri en bois avec table de craft, four et coffre.' } },
  { id: 'tower', author: 'Vessel Trainer', name: { en: 'Watchtower', fr: 'Tour de guet' }, text: { en: 'A 30-block stone tower with a ladder and a lookout.', fr: 'Une tour en pierre de 30 blocs, avec échelle et plateforme.' } },
  { id: 'pyramid', author: 'Vessel Trainer', name: { en: 'Sandstone pyramid', fr: 'Pyramide de grès' }, text: { en: 'A hollow pyramid with an entrance.', fr: 'Une pyramide creuse avec une entrée.' } },
  { id: 'arena', author: 'Vessel Trainer', name: { en: 'Arena', fr: 'Arène' }, text: { en: 'A round walled arena with a 20-block radius.', fr: 'Une arène ronde et fermée de 20 blocs de rayon.' } },
];

const CHANGELOG = [
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
    { en: 'Minecraft 26.4 support', fr: 'Compatibilité Minecraft 26.4', note: { en: 'Once the version is released.', fr: 'Dès la sortie de cette version.' } },
  ],
  planned: [
    { en: 'Public library', fr: 'Bibliothèque publique', note: { en: 'Share your structures with every player, and browse them from inside the game.', fr: 'Partager tes structures avec tous les joueurs, et les parcourir depuis le jeu.' } },
    { en: 'Animated banners', fr: 'Bannières animées', note: { en: 'GIF banners that really move.', fr: 'Des bannières GIF qui bougent vraiment.' } },
    { en: 'A bigger mushroom cloud', fr: 'Un champignon encore plus grand', note: { en: 'Visible from much further away.', fr: 'Visible de beaucoup plus loin.' } },
  ],
  ideas: [
    { en: 'New disasters', fr: 'Nouvelles catastrophes', note: { en: 'Tsunami, blizzard, sandstorm.', fr: 'Tsunami, blizzard, tempête de sable.' } },
    { en: 'Shareable profiles', fr: 'Profils partageables', note: { en: 'Send your cheat setup to a friend.', fr: 'Envoyer sa configuration à un ami.' } },
    { en: 'Controller support', fr: 'Compatibilité manette', note: { en: 'Use the menu with a gamepad.', fr: 'Utiliser le menu avec une manette.' } },
  ],
};
