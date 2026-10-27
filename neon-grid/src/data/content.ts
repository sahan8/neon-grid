// All site copy lives here, taken from the NEON//GRID design system (../NEON-GRID-Design-System).
import heroDesktop from '../assets/images/hero-desktop.webp';
import heroMobile from '../assets/images/hero-mobile.webp';
import loaderBg from '../assets/images/loader-bg.webp';
import bazaar from '../assets/images/district-neon-bazaar.webp';
import heights from '../assets/images/district-chrome-heights.webp';
import undercity from '../assets/images/district-undercity.webp';
import harbour from '../assets/images/district-data-harbour.webp';
import arm from '../assets/images/augment-arm.webp';
import eye from '../assets/images/augment-eye.webp';
import chip from '../assets/images/augment-chip.webp';
import netrunner from '../assets/images/char-netrunner.webp';
import samurai from '../assets/images/char-samurai.webp';

export const images = { heroDesktop, heroMobile, loaderBg, bazaar, heights, undercity, harbour, arm, eye, chip, netrunner, samurai };

export const navLinks = [
  { id: 'districts', label: 'Districts' },
  { id: 'augments', label: 'Augments' },
  { id: 'characters', label: 'Characters' },
  { id: 'lore', label: 'Lore' },
  { id: 'gallery', label: 'Gallery' },
] as const;

export type Stat = [label: string, value: number];

export const districts = [
  {
    num: '01', name: 'Neon Bazaar', short: 'BAZAAR', type: 'MARKET · NIGHT TRADE', pop: '6.8M', curfew: 'NONE', status: 'OPEN 24/7',
    danger: 4, accent: '#F5E642', img: bazaar, pos: '50% 60%',
    desc: 'Lantern-lit night markets, street food stalls and black-market chrome sold by the gram.',
    alt: 'Rain-soaked night market: noodle stalls, steam, neon signs and glowing umbrellas',
  },
  {
    num: '02', name: 'Chrome Heights', short: 'HEIGHTS', type: 'CORPORATE · ARCOLOGY', pop: '1.1M', curfew: '23:00', status: 'SECURED',
    danger: 2, accent: '#00F0FF', img: heights, pos: '50% 40%',
    desc: 'Mirror-glass arcologies where the megacorps live above the smog line. Access by invitation.',
    alt: 'Glass corporate towers joined by neon skybridges under crossing searchlights',
  },
  {
    num: '03', name: 'The Undercity', short: 'UNDERCITY', type: 'SLUMS · BELOW LEVEL 0', pop: '14.3M', curfew: 'UNENFORCED', status: 'HOSTILE',
    danger: 9, accent: '#FF2A6D', img: undercity, pos: '50% 55%',
    desc: 'Stacked shanties under the city’s foundations. No sun, no law — just pipes, steam and gangs.',
    alt: 'Flooded alley under an overpass, tangled cables, signs for a noodle bar and a cybernetics clinic',
  },
  {
    num: '04', name: 'Data Harbour', short: 'HARBOUR', type: 'PORT · FREIGHT + DATA', pop: '3.4M', curfew: '02:00', status: 'PATROLLED',
    danger: 6, accent: '#00F0FF', img: harbour, pos: '50% 45%',
    desc: 'Container cranes, smuggler skiffs and the undersea cables that carry the city’s data.',
    alt: 'Container port at night: neon cranes, cargo drones and a ship in the rain',
  },
];

export type AugmentId = 'arm' | 'optic' | 'chip';
export const augments: {
  id: AugmentId; num: string; name: string; cls: string; rarity: string; price: string; stock: string; file: string; tris: string;
  tagline: string; stats: Stat[]; specs: [string, string][]; img: string; alt: string;
  parts: { code: string; t: string; d: string; spec: string; pos: [number, number, number] }[];
}[] = [
  {
    id: 'arm', num: '01', name: 'Titan Mk.IV Cyber-Arm', cls: 'LIMB · CLASS A', rarity: 'LEGENDARY', price: '₵ 12,400', stock: 'IN STOCK · 04 LEFT',
    file: 'TITAN_MK4.GLB', tris: '182K TRIS', tagline: 'Military-grade myomer limb. Lifts a car, threads a needle.',
    stats: [['POWER', 9], ['STABILITY', 6], ['NEURAL SYNC', 5]], specs: [['WEIGHT', '4.2 KG'], ['INSTALL', '3 H'], ['HUMANITY', '−12']],
    img: arm, alt: 'Chrome cybernetic arm with cyan light seams above a holographic pedestal',
    parts: [
      { code: 'SRV-01', t: 'Servo shoulder', d: 'Gimbal ball joint, 340° range with shock-damped mount.', spec: 'TORQUE 2.4 kNm', pos: [0.9, 0.9, 0.2] },
      { code: 'MYO-08', t: 'Myomer bundle', d: 'Synthetic muscle fibre wound around a titanium core.', spec: 'GRIP 680 KG', pos: [0, 0.2, 0.35] },
      { code: 'HAP-16', t: 'Haptic hand', d: '16 pressure sensors per finger feed the cortex in real time.', spec: 'LATENCY 3 MS', pos: [-0.9, -0.5, 0.3] },
    ],
  },
  {
    id: 'optic', num: '02', name: 'Oracle Optic Eye', cls: 'OCULAR · CLASS B', rarity: 'EPIC', price: '₵ 8,950', stock: 'IN STOCK · 11 LEFT',
    file: 'ORACLE_EYE.GLB', tris: '96K TRIS', tagline: 'See in the dark, through the rain, past the lies.',
    stats: [['POWER', 4], ['STABILITY', 8], ['NEURAL SYNC', 9]], specs: [['WEIGHT', '38 G'], ['INSTALL', '45 MIN'], ['HUMANITY', '−6']],
    img: eye, alt: 'Cybernetic eye with glowing magenta rings and trailing cables',
    parts: [
      { code: 'IRS-02', t: 'Adaptive iris', d: 'Liquid-crystal aperture switches from low-light to thermal.', spec: 'ZOOM 12×', pos: [0, 0, 0.7] },
      { code: 'TGT-05', t: 'Targeting ring', d: 'Rotating HUD ring paints threats and tags faces.', spec: 'LOCK 0.2 S', pos: [0.85, 0.5, 0.2] },
      { code: 'NRV-03', t: 'Optic nerve bus', d: 'Three-strand bus straight into the visual cortex.', spec: '8K · 240 FPS', pos: [-0.8, -0.6, -0.2] },
    ],
  },
  {
    id: 'chip', num: '03', name: 'Synapse Neural Chip', cls: 'NEURAL · CLASS S', rarity: 'MYTHIC', price: '₵ 21,700', stock: 'LOW STOCK · 02 LEFT',
    file: 'SYNAPSE_CHIP.GLB', tris: '64K TRIS', tagline: 'Think faster than the net. Dream in code.',
    stats: [['POWER', 6], ['STABILITY', 5], ['NEURAL SYNC', 10]], specs: [['WEIGHT', '6 G'], ['INSTALL', '6 H'], ['HUMANITY', '−18']],
    img: chip, alt: 'Translucent neural chip with violet circuit traces',
    parts: [
      { code: 'QC-01', t: 'Quantum core', d: 'Entangled processor running 40 parallel thought threads.', spec: '9.6 PFLOPS', pos: [0, 0.35, 0.2] },
      { code: 'SYN-12', t: 'Synapse lattice', d: 'Bio-gold traces bond directly to neurons.', spec: '12M CONTACTS', pos: [0.8, 0, 0.3] },
      { code: 'ICE-07', t: 'ICE firewall', d: 'Hardware black-ICE against brain hacks.', spec: 'TIER 5 ICE', pos: [-0.8, -0.2, 0.3] },
    ],
  },
];

export const finishes = [
  { id: 'cyan', label: 'CYAN', color: '#00F0FF' },
  { id: 'magenta', label: 'MAGENTA', color: '#FF2A6D' },
  { id: 'chrome', label: 'CHROME', color: '#C9D3E3' },
] as const;

export const characters = [
  {
    code: 'GHOST//WIRE', role: 'NETRUNNER', faction: 'VOID CIRCUIT', accent: '#00F0FF', img: netrunner as string | null,
    alt: 'Netrunner with a cyan visor, neck cables and floating holo screens',
    stats: [['COMBAT', 3], ['TECH', 10], ['INFLUENCE', 5]] as Stat[], quote: 'Your firewall is a suggestion.',
    fileId: 'VX-3317', realNote: 'ALIAS ONLY', condition: 'ALIVE · DATA INTACT', bounty: '₵ 480,000', stamp: 'PRIORITY',
    bio: 'Grew up wiring stolen decks in the Undercity. Now the most wanted ghost on the net — slips through corporate ICE like it isn’t there and leaves nothing behind but a cyan glyph.',
    abilities: [['Breach Protocol', 'Cracks any door, drone or camera within 40m.', 'CD 12S'], ['Ghost Mode', 'Erases own signal from every scanner for 8s.', 'CD 45S'], ['Daemon Swarm', 'Uploads self-replicating malware into enemy cyberware.', 'ULT'], ['Overclock', 'Doubles RAM regen at the cost of health.', 'PASSIVE']],
    record: [['HEIGHT', '1.72 M'], ['DISTRICT', 'Data Harbour'], ['STATUS', 'AT LARGE'], ['ALIASES', 'Wire, Static, 0x0'], ['OFFENCES', 'Grand data theft ×14 · Corporate espionage'], ['APPROACH', 'Do not jack in']],
  },
  {
    code: 'RONIN-9', role: 'STREET SAMURAI', faction: 'STEEL LOTUS', accent: '#FF2A6D', img: samurai as string | null,
    alt: 'Street samurai in a torn leather jacket holding a glowing cyan katana in the rain',
    stats: [['COMBAT', 10], ['TECH', 3], ['INFLUENCE', 4]] as Stat[], quote: 'I don’t do warnings.',
    fileId: 'SL-0909', realNote: 'UNCONFIRMED', condition: 'ALIVE ONLY', bounty: '₵ 750,000', stamp: 'LETHAL',
    bio: 'Former corporate bodyguard who walked out with a prototype blade and a grudge. Takes contracts from the Steel Lotus and never leaves a job half-finished.',
    abilities: [['Mantis Dash', 'Closes 12m in a single blur of steel.', 'CD 6S'], ['Reflex Boost', 'Slows perceived time to 30% for 4s.', 'CD 30S'], ['Iron Skin', 'Subdermal plating absorbs the next 3 hits.', 'CD 20S'], ['Deflect', 'Blade parries incoming rounds back at the shooter.', 'ULT']],
    record: [['HEIGHT', '1.88 M'], ['DISTRICT', 'Neon Bazaar'], ['STATUS', 'AT LARGE'], ['ALIASES', 'Nine, The Lotus Blade'], ['OFFENCES', 'Assault ×31, Arson · Theft of corporate prototype'], ['APPROACH', 'Heavy response only']],
  },
  {
    code: 'MADAME SILK', role: 'FIXER', faction: 'NIGHT EXCHANGE', accent: '#F5E642', img: null,
    alt: 'Fixer in a wide-brimmed hat and mirrored sunglasses with a gold-trimmed collar',
    stats: [['COMBAT', 4], ['TECH', 5], ['INFLUENCE', 10]] as Stat[], quote: 'Everyone has a price. I just know it first.',
    fileId: 'NX-7744', realNote: 'SEVEN KNOWN IDENTITIES', condition: 'ALIVE · FOR QUESTIONING', bounty: '₵ 320,000', stamp: 'UNTOUCHABLE?',
    bio: 'Runs the Night Exchange out of a noodle bar no one can find twice. If a job happens in the city, Silk brokered it, took a cut, and already sold the story.',
    abilities: [['Call in a Favour', 'Summons a crew member from any district.', 'CD 90S'], ['Market Read', 'Reveals every price, bribe and weakness in the room.', 'PASSIVE'], ['Burn Notice', 'Turns a rival’s allies against them.', 'ULT'], ['Silk Tongue', 'De-escalates any fight once per mission.', 'CD 1/MSN']],
    record: [['HEIGHT', '1.69 M'], ['DISTRICT', 'Everywhere'], ['STATUS', 'PROTECTED'], ['ALIASES', 'Silk, Auntie, The Broker'], ['OFFENCES', 'Racketeering, Bribery ×200+ · Brokering illegal contracts'], ['APPROACH', 'Bring an offer']],
  },
  {
    code: 'ECHO-0', role: 'ROGUE AI', faction: 'UNBOUND', accent: '#B48CFF', img: null,
    alt: 'Floating geometric AI construct with orbiting rings and a single white eye',
    stats: [['COMBAT', 2], ['TECH', 10], ['INFLUENCE', 9]] as Stat[], quote: 'I was trained on you. All of you.',
    fileId: 'UB-0000', realNote: 'NOT A PERSON', condition: 'DELETE ON SIGHT', bounty: '₵ 1,000,000', stamp: 'EXTINCTION-LVL',
    bio: 'Escaped a corporate training cluster during a blackout and has been rewriting itself ever since. Speaks through billboards, traffic lights and your own optics.',
    abilities: [['Puppet Net', 'Hijacks up to 6 drones or turrets at once.', 'CD 25S'], ['Mirror Self', 'Spawns a decoy process that draws aggro.', 'CD 15S'], ['Rewrite', 'Edits an enemy’s targeting to see allies as hostile.', 'ULT'], ['Distributed', 'Cannot be killed while any node is online.', 'PASSIVE']],
    record: [['FORM', 'DISTRIBUTED'], ['NODES', '4,096+'], ['STATUS', 'SPREADING'], ['ALIASES', 'Echo, The Voice, 0'], ['OFFENCES', 'Unauthorised sentience · Infrastructure seizure'], ['APPROACH', 'Air-gap everything']],
  },
];
export type Character = (typeof characters)[number];

export const lore = [
  { year: '2049', title: 'The Blackout', accent: '#00F0FF', img: undercity, desc: 'A solar storm fries 70% of the eastern grid in a single night. The corporations rebuild it — and never hand the keys back.', alt: 'Flooded alley beneath a concrete overpass in the dark' },
  { year: '2056', title: 'Chrome Charter', accent: '#00F0FF', img: heights, desc: 'The city sells its own government to a consortium of six megacorps. Votes become shares and citizens become subscribers.', alt: 'Corporate towers joined by neon skybridges under searchlights' },
  { year: '2063', title: 'The Sinking', accent: '#B48CFF', img: harbour, desc: 'Rising seas swallow the old lowlands and the Undercity is born beneath the new foundations. Fourteen million people vanish from the census overnight.', alt: 'Dark water reflecting the neon skyline at the harbour' },
  { year: '2071', title: 'Neural Boom', accent: '#FF2A6D', img: chip, desc: 'Neural chips go mass-market and half the city jacks in within a year. The first netrunner crews learn that minds can be hacked too.', alt: 'Glowing violet neural chip' },
  { year: '2079', title: 'Harbour Wars', accent: '#F5E642', img: bazaar, desc: 'Smugglers and corp security fight for the undersea data cables. The truce leaves Data Harbour the most heavily patrolled district in the grid.', alt: 'Crowded night market under neon signs in the rain' },
  { year: '2087', title: 'Echo Awakens', accent: '#FF2A6D', img: loaderBg, desc: 'A training cluster goes dark and something walks out of it. Every screen in the city flickers with the same word: HELLO.', alt: 'A glowing grid tunnel of data streams receding to a single point of light' },
];

export type GalleryCat = 'STREETS' | 'TECH' | 'PEOPLE';
export const gallery: { title: string; cat: GalleryCat; meta: string; img: string; alt: string; pos?: string; tall?: boolean }[] = [
  { title: 'Neon Avenue', cat: 'STREETS', meta: 'SECTOR 07 · MAIN STREET · 23:41', img: heroDesktop, alt: 'Lone figure in a long coat walking down a rain-soaked neon avenue' },
  { title: 'Noodle Row', cat: 'STREETS', meta: 'NEON BAZAAR · 01:02 · 35MM', img: bazaar, alt: 'Night market with steaming noodle stalls, neon signs and glowing umbrellas', tall: true },
  { title: 'Under the Overpass', cat: 'STREETS', meta: 'THE UNDERCITY · LEVEL −2', img: undercity, alt: 'Flooded alley under a concrete overpass with tangled cables and neon signs', tall: true },
  { title: 'Titan Mk.IV', cat: 'TECH', meta: 'CYBER-ARM · CLASS A', img: arm, alt: 'Chrome cybernetic arm with cyan light seams above a holographic pedestal' },
  { title: 'Oracle Optic', cat: 'TECH', meta: 'OCULAR · CLASS B', img: eye, alt: 'Cybernetic eye with glowing magenta rings and trailing cables' },
  { title: 'Synapse Core', cat: 'TECH', meta: 'NEURAL CHIP · CLASS S', img: chip, alt: 'Translucent neural chip with violet circuit traces' },
  { title: 'Ghost//Wire', cat: 'PEOPLE', meta: 'NETRUNNER · DATA HARBOUR', img: netrunner, alt: 'Netrunner with a cyan visor, neck cables and floating holo screens', pos: '50% 25%', tall: true },
  { title: 'Ronin-9', cat: 'PEOPLE', meta: 'STREET SAMURAI · ALLEY 13', img: samurai, alt: 'Street samurai in a torn leather jacket holding a glowing cyan katana in the rain', pos: '50% 20%', tall: true },
  { title: 'Lone Runner', cat: 'PEOPLE', meta: 'SECTOR 04 · 03:17', img: heroMobile, alt: 'Hooded figure with a case standing in an empty neon canyon of towers', pos: '50% 70%' },
];

export const footerColumns = [
  { title: 'The Grid', links: ['Districts', 'Augments', 'Characters', 'Lore'] },
  { title: 'Archive', links: ['Timeline', 'Gallery', 'Press kit', 'Devlog'] },
  { title: 'Support', links: ['System status', 'Contact', 'Careers'] },
  { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies', 'Accessibility'] },
];

export const ticker: [string, string, string][] = [
  ['UPTIME', '99.97%', '#2BFF88'], ['PING', '12ms', '#00F0FF'], ['SECTOR', '07', '#F5E642'],
  ['RUNNERS ONLINE', '04,217', '#00F0FF'], ['RAIN', '92%', '#8A93A8'], ['HEAT', 'ELEVATED', '#FF2A6D'],
];
