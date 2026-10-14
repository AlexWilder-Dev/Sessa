/*
 * Everything Sessa says about itself lives in this file:
 * venue details, hours, kitchen times, menus, drinks and the bottle list.
 * When a menu changes, edit it here and nowhere else.
 */

/* ------------------------------------------------------------------ */
/* Venue                                                               */
/* ------------------------------------------------------------------ */

export const VENUE = {
  name: 'Sessa',
  line: 'All day bar and café in Herne Hill',
  street: '222 Railton Road',
  city: 'London',
  postcode: 'SE24 0JT',
  whereabouts: 'Opposite Herne Hill station, a short walk from Brockwell Park.',
  opened: 'December 2025',
  phone: '020 4568 2668',
  phoneHref: 'tel:+442045682668',
  email: 'hello@sessa.london',
  instagram: 'instagram.com/sessa.london',
  instagramHref: 'https://www.instagram.com/sessa.london/',
  bookHref:
    'https://tables.toasttab.com/restaurants/7b6932a0-c5ef-4a0e-9052-4ec255526aec/reserve?partySize=2',
  directionsHref:
    'https://www.google.com/maps/search/?api=1&query=Sessa+222+Railton+Road+London+SE24+0JT',
  nickname: 'the little yellow bar',
};

export const PEOPLE = [
  {
    name: 'Molly Kyte',
    role: 'Chef',
    does: 'cooks',
  },
  {
    name: 'Edd Clibbens',
    role: 'General manager, wine and cocktails',
    does: 'runs the drinks',
    before: 'Forza Wine',
  },
  {
    name: 'Liv Kyte',
    role: 'Runs the business',
    does: 'runs the business',
  },
];

export const SUPPLIERS = [
  { what: 'Coffee', who: 'Old Spike' },
  { what: 'Tea', who: 'Good & Proper' },
  { what: 'Matcha', who: 'Haru' },
  { what: 'Pastries', who: 'Toklas Bakery' },
];

export const QUOTES = {
  molly: {
    text: 'We really consider ourselves to be a bar that has food, not a restaurant.',
    who: 'Molly Kyte',
    source: 'Broadsheet',
  },
  nudge: {
    text: 'immediately feels like it’s been there forever',
    source: 'The Nudge',
  },
};

/* ------------------------------------------------------------------ */
/* Hours. Day numbers: 0 = Sunday … 6 = Saturday. Times are minutes    */
/* after midnight, London time.                                        */
/* ------------------------------------------------------------------ */

export type Span = { from: number; to: number };
const t = (h: number, m = 0) => h * 60 + m;

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HOURS: Record<number, Span | null> = {
  0: { from: t(9), to: t(15) },
  1: null,
  2: { from: t(9), to: t(22, 30) },
  3: { from: t(9), to: t(22, 30) },
  4: { from: t(9), to: t(22, 30) },
  5: { from: t(9), to: t(23) },
  6: { from: t(9), to: t(23) },
};

/* How the hours are written for people (Tue–Thu grouped, as on the door). */
export const HOURS_TEXT = [
  { days: 'Tuesday – Thursday', dayNums: [2, 3, 4], hours: '9am – 10:30pm' },
  { days: 'Friday – Saturday', dayNums: [5, 6], hours: '9am – 11pm' },
  { days: 'Sunday', dayNums: [0], hours: '9am – 3pm' },
  { days: 'Monday', dayNums: [1], hours: 'Closed' },
];

export type MenuId = 'daytime' | 'evening';

export const KITCHEN: Record<MenuId, Record<number, Span | null>> = {
  daytime: {
    0: { from: t(9), to: t(14) },
    1: null,
    2: { from: t(9), to: t(15) },
    3: { from: t(9), to: t(15) },
    4: { from: t(9), to: t(15) },
    5: { from: t(9), to: t(15) },
    6: { from: t(9), to: t(15) },
  },
  evening: {
    0: null,
    1: null,
    2: { from: t(18), to: t(21, 30) },
    3: { from: t(18), to: t(21, 30) },
    4: { from: t(18), to: t(21, 30) },
    5: { from: t(18), to: t(21, 30) },
    6: { from: t(18), to: t(21, 30) },
  },
};

export const KITCHEN_TEXT: Record<MenuId, string> = {
  daytime: 'Tue – Sat 9am – 3pm · Sunday 9am – 2pm',
  evening: 'Tue – Sat 6pm – 9:30pm',
};

export const BETWEEN_MENUS = 'In between, the bar is open.';

/* ------------------------------------------------------------------ */
/* Food                                                                */
/* ------------------------------------------------------------------ */

export type Dish = {
  name: string;
  detail?: string;
  price: string;
  /* Only served within part of the menu's hours. */
  from?: number;
  /* Only served on these days (0 = Sunday). */
  days?: number[];
  note?: string;
  /* Shown on the home page chalkboard. */
  board?: boolean;
};

export const DAYTIME_MENU: Dish[][] = [
  [
    { name: 'Yoghurt, granola & seasonal fruit', price: '£8', board: true },
    { name: 'Boiled eggs & soldiers', price: '£8', board: true },
    {
      name: 'Smoked trout',
      detail: 'cream cheese, boiled egg, cucumber salad, rye toast',
      price: '£14',
    },
    {
      name: 'Chermoula fried eggs',
      detail: 'yoghurt, friggitelli peppers, butter beans & toast',
      price: '£14',
      board: true,
    },
    { name: 'Merguez sausage ragù & fried egg on toast', price: '£14' },
    {
      name: 'Ploughman’s plate',
      detail: 'Brie, Comté, Marmande tomatoes, saucisson, cornichons, baguette & butter',
      price: '£14',
    },
    {
      name: 'Smoked mackerel',
      detail: 'roasted beetroot, potato horseradish salad, pickled cucumbers & dill',
      price: '£16',
    },
    {
      name: 'Chicken, sobrasada & Manchego sandwich',
      price: '£11',
      from: t(11, 30),
      note: 'from 11:30am',
      board: true,
    },
    {
      name: 'Spanish tortilla',
      price: '£10',
      days: [6, 0],
      note: 'weekends only',
      board: true,
    },
  ],
  [{ name: 'Sweet treats on the counter', price: '£3 – £4.50' }],
];

export const EVENING_MENU: Dish[][] = [
  [
    { name: 'Focaccia', price: 'Free with your meal' },
    { name: 'Gilda', price: '£3 each', board: true },
    { name: 'Pyefleet oyster', detail: 'pickled jalapeño mignonette', price: '£3 each', board: true },
    { name: 'Cheese & figs', price: '£12' },
    { name: 'Westcombe saucisson', price: '£10' },
  ],
  [
    { name: 'Peach & tomato panzanella', price: '£12' },
    { name: 'Fritto misto & saffron aioli', price: '£16', board: true },
    { name: 'Aubergine caponata & panelle', price: '£22' },
    { name: 'Pork chop & roasted plums', price: '£28', board: true },
    { name: 'Fried potatoes & aioli', price: '£8' },
    { name: 'Oak leaf salad', price: '£10' },
  ],
  [
    { name: 'Plum & blackberry pie', price: '£10' },
    { name: 'Chocolate mousse', price: '£8' },
  ],
];

export const ALLERGY_LINE = 'Allergies? Ask the team before you order.';

/* ------------------------------------------------------------------ */
/* Drinks                                                              */
/* ------------------------------------------------------------------ */

export type Drink = {
  name: string;
  price: string;
  detail?: string;
  /* Only served on these days, within this window. */
  days?: number[];
  window?: Span;
  note?: string;
};

export const BY_THE_GLASS: Drink[] = [
  { name: 'Fresh white', price: '£6.50' },
  { name: 'Mineral white', price: '£9' },
  { name: 'Extra special white', price: '£13' },
  { name: 'World’s best sparkling…', price: '£15' },
  { name: 'Orange', price: '£10' },
  { name: 'Rosé', price: '£9' },
  { name: 'Fresh red', price: '£6.50' },
  { name: 'Rich red', price: '£9' },
  { name: 'Chilled red', price: '£11' },
];
export const GLASS_SIZE = '125ml';

export const COCKTAILS: Drink[] = [
  { name: 'House Martini', price: '£7' },
  { name: 'M&M', price: '£8' },
  { name: 'Negroni', price: '£9' },
  { name: 'Campari/Aperol Spritz', price: '£9' },
  { name: 'Vermouth & Tonic', price: '£10' },
  { name: 'Margarita', price: '£10' },
  { name: 'Fizzy Lifting Drink', price: '£11' },
  { name: 'Classic Martinis', price: '£12' },
  { name: 'Pineapple Hemingway', price: '£12' },
  { name: 'Edd’s Marvellous Medicine', price: '£13' },
  {
    name: 'Garibaldi',
    price: '£9',
    days: [6, 0],
    window: { from: t(11), to: t(15) },
    note: 'Sat/Sun 11am – 3pm',
  },
];

export const BEER: Drink[] = [
  { name: 'Ansbacher Lager', detail: '5.0%', price: '£6.50' },
  { name: 'Citropolis Session IPA', detail: '4.5%', price: '£6.75' },
  { name: 'Red Fin Cider', detail: '500ml bottle', price: '£6.50' },
];
export const BEER_NOTE = 'Pint or half';

export const ALCOHOL_FREE: Drink[] = [
  { name: 'N0groni', price: '£7' },
  { name: 'Gimlet cordials', detail: 'Cherry · Spiced lemon · Lime', price: '£5' },
  { name: 'Rothaus AF Pilsner', price: '£5' },
  { name: 'Fritz Kola / Diet', price: '£4.50' },
  { name: 'Orange juice', price: '£4.50' },
];

export const SPIRITS: Drink[] = [
  { name: 'Amaro Montenegro', price: '£4' },
  { name: 'Fernet Branca', price: '£4' },
  { name: 'Mezcal', price: '£5' },
  { name: 'Chartreuse', price: '£5' },
  { name: 'Calvados', price: '£5' },
  { name: 'Whisky/Bourbon/Rye', price: '£6 – 10' },
  { name: 'Pudding wine', detail: '75ml', price: '£9' },
];

export const HOT_DRINKS = {
  note: 'See the blackboard',
  makers: ['Old Spike coffee', 'Good & Proper tea', 'Haru matcha'],
};

/* The two prices people talk about. */
export const HEADLINE_PRICES = {
  glass: { price: '£6.50', what: 'a glass of fresh white or fresh red' },
  martini: { price: '£7', what: 'the house martini' },
};

/* ------------------------------------------------------------------ */
/* Bottles (from the drinks list, in list order)                       */
/* ------------------------------------------------------------------ */

export type StyleId =
  | 'fizz'
  | 'fresh-white'
  | 'rich-white'
  | 'orange'
  | 'pink'
  | 'light-red'
  | 'big-red'
  | 'cellar';

export const WINE_STYLES: { id: StyleId; title: string; short: string; note?: string }[] = [
  { id: 'fizz', title: 'Pet nats & traditional method fizz', short: 'Fizz' },
  { id: 'fresh-white', title: 'Fresher, crisper, brighter whites', short: 'Fresher whites' },
  { id: 'rich-white', title: 'Richer, fuller, textural whites', short: 'Richer whites' },
  { id: 'orange', title: 'Orange', short: 'Orange' },
  { id: 'pink', title: 'Pink', short: 'Pink' },
  { id: 'light-red', title: 'Lighter, brighter, fresher reds', short: 'Lighter reds' },
  { id: 'big-red', title: 'Bigger, bolder, fuller reds', short: 'Bigger reds' },
  {
    id: 'cellar',
    title: 'From the “cellar”',
    short: 'From the cellar',
    note:
      'Single bottles, rarer wines or those that are just a bit more expensive. All priced at smaller margins to make them as accessible as possible. In some cases, the cheapest you’ll find these wines in London…',
  },
];

export const FIZZ_NOTE = 'For Champagne… go to the cellar.';

export const COUNTRIES: Record<string, string> = {
  AT: 'Austria',
  AUS: 'Australia',
  ENG: 'England',
  FR: 'France',
  GR: 'Greece',
  IT: 'Italy',
  PT: 'Portugal',
  SA: 'South Africa',
  SP: 'Spain',
  SVK: 'Slovakia',
  SVN: 'Slovenia',
  USA: 'USA',
};

export type BottleNote = 'Chilled' | 'Available chilled' | '1L bottle' | 'Box wine';

export type Bottle = {
  style: StyleId;
  group?: string;
  vintage: string;
  name: string;
  producer?: string;
  grape: string;
  region?: string;
  country?: string;
  price: number;
  note?: BottleNote;
};

export const BOTTLES: Bottle[] = [
  {style: "fizz", group: "Pet nats & the like", vintage: "2023", name: "Rosé Pet Nat", producer: "Gabernik", grape: "Pinot Noir", region: "Stajerska", country: "SVN", price: 48},
  {style: "fizz", group: "Pet nats & the like", vintage: "2024", name: "Petit Nature", producer: "Martin Texier", grape: "Muscat", region: "Rhone", country: "FR", price: 58},
  {style: "fizz", group: "Traditional method fizz", vintage: "NV", name: "Spumante Extra Brut", producer: "Monban", grape: "Glera", region: "Veneto", country: "IT", price: 49},
  {style: "fizz", group: "Traditional method fizz", vintage: "2020", name: "Antxiola Brut Nature", producer: "Zudugarai", grape: "Hondarrabi Zuri", region: "Basque Country", country: "SP", price: 68},
  {style: "fizz", group: "Traditional method fizz", vintage: "NV", name: "Culver Classic Cuvée", producer: "Langham", grape: "Meunier, P.Noir, Chardonnay", region: "Dorset", country: "ENG", price: 70},
  {style: "fresh-white", vintage: "2025", name: "UIVO Branco", producer: "Folias de Baco", grape: "Arinto, Gouveio etc.", region: "Douro", country: "PT", price: 36},
  {style: "fresh-white", vintage: "2024", name: "Michi’s Farm White", producer: "Michael Gindl", grape: "Grüner Veltliner", region: "Weinviertel", country: "AT", price: 39},
  {style: "fresh-white", vintage: "2025", name: "Txakoli de Getaria", producer: "Ameztoi", grape: "Hondarrabi Zuri", region: "Basque Country", country: "SP", price: 41},
  {style: "fresh-white", vintage: "2024", name: "Apremont Vin de Savoie", producer: "Domaines des 13 Lunes", grape: "Jacquère", region: "Savoie", country: "FR", price: 44},
  {style: "fresh-white", vintage: "2024", name: "Schonberg Riesling", producer: "Nibiru", grape: "Riesling", region: "Kamptal", country: "AT", price: 48},
  {style: "fresh-white", vintage: "2024", name: "Pinot Gris “Le Coq”", producer: "Léon Boesch", grape: "Pinot Gris", region: "Alsace", country: "FR", price: 52},
  {style: "fresh-white", vintage: "2024", name: "Whaka Piripiri Mai", producer: "Clos des Plantes", grape: "Chenin Blanc", region: "Loire", country: "FR", price: 64},
  {style: "fresh-white", vintage: "2024", name: "Chablis", producer: "Domaine Garnier & Fils", grape: "Chardonnay", region: "Chablis", country: "FR", price: 66},
  {style: "fresh-white", vintage: "2024", name: "Pouilly-Fumé “Léon”", producer: "Dom. Jonathan Didier Pabiot", grape: "Sauvignon", region: "Loire", country: "FR", price: 68},
  {style: "fresh-white", vintage: "2023", name: "La Plage Abandonnée", producer: "Domaine Payen", grape: "Chenin Blanc", region: "Loire", country: "FR", price: 73},
  {style: "fresh-white", vintage: "2023", name: "The Slint", producer: "Ochota Barrels", grape: "Chardonnay", region: "Adelaide Hills", country: "AUS", price: 80},
  {style: "fresh-white", vintage: "2022", name: "Quatre Mains", producer: "La Grange Tiphaine", grape: "Sauvignon Blanc", region: "Loire", country: "FR", price: 82},
  {style: "rich-white", vintage: "NV", name: "Blanc", producer: "Louis Julian", grape: "Grenache Blanc, Sauvignon, Roussanne etc", region: "Occitanie", country: "FR", price: 49, note: "1L bottle"},
  {style: "rich-white", vintage: "2024", name: "Côtes de Gascogne Blanc", producer: "Domaine Entras", grape: "Ugni Blanc, Colombard", region: "Gascony", country: "FR", price: 38},
  {style: "rich-white", vintage: "2025", name: "L'Estela", producer: "Domaine Montesquiou", grape: "Gros Mensang, Petit Courbu, Petit Mensang", region: "Jurançon", country: "FR", price: 42},
  {style: "rich-white", vintage: "2024", name: "Samo", producer: "Etienne Fort", grape: "Chardonnay", region: "Limoux", country: "FR", price: 48},
  {style: "rich-white", vintage: "2022", name: "Scritch", producer: "Domaine Arlaud", grape: "Chardonnay", region: "Burgundy", country: "FR", price: 52},
  {style: "rich-white", vintage: "2024", name: "VdF Chenin Blanc", producer: "Agnès et René Mosse", grape: "Chenin Blanc", region: "Loire", country: "FR", price: 55},
  {style: "rich-white", vintage: "2024", name: "L’Humanite Avant Le Déluge", producer: "Vincent Ruiz", grape: "Grenache Blanc", region: "Ardéche", country: "FR", price: 57},
  {style: "rich-white", vintage: "2023", name: "Vinhas Velhas Branco", producer: "António Madeira", grape: "Field Blend", region: "Dão", country: "PT", price: 65},
  {style: "rich-white", vintage: "2024", name: "Côtes Catalanes “Coste”", producer: "Domaine Danjou-Banessy", grape: "Macabeu", region: "Roussillon", country: "FR", price: 70},
  {style: "rich-white", vintage: "2023", name: "Juan Bello", producer: "Puro Rofe", grape: "Malvasia Volcanica, Diego, Listán Blanco", region: "Lanzarote", country: "SP", price: 74},
  {style: "rich-white", vintage: "2023", name: "Poësis", producer: "Clos des Plantes", grape: "Chenin Blanc", region: "Loire", country: "FR", price: 76},
  {style: "rich-white", vintage: "2023", name: "Pouilly Fuissé “Eldorado”", producer: "Clos Sauvage", grape: "Chardonnay", region: "Burgundy", country: "FR", price: 79},
  {style: "rich-white", vintage: "2022", name: "Bourgogne Aligoté", producer: "Athénaïs de Béru", grape: "Aligoté", region: "Burgundy", country: "FR", price: 79},
  {style: "rich-white", vintage: "2023", name: "Rebosso", producer: "Selvadolce", grape: "Vermentino", region: "Liguria", country: "IT", price: 82},
  {style: "rich-white", vintage: "2023", name: "Etraz", producer: "Domaine du Gringet", grape: "Gringet", region: "Savoie", country: "FR", price: 88},
  {style: "orange", vintage: "2023", name: "Macabeu Brisat", producer: "Tanca Els Ulls", grape: "Macabeu", region: "Catalunya", country: "SP", price: 41},
  {style: "orange", vintage: "2025", name: "Michi’s Farm Orange", grape: "Grüner Veltliner etc.", region: "Weinviertel", country: "AT", price: 47},
  {style: "orange", vintage: "2024", name: "Déferlante Orangée", producer: "Les Vignes d’Olivier", grape: "Cinsault, Clairette", region: "Languedoc", country: "FR", price: 55},
  {style: "orange", vintage: "2022", name: "Gewürztraminer Maceration", producer: "Pierre Frick", grape: "Pinot Gris", region: "Alsace", country: "FR", price: 80},
  {style: "pink", vintage: "2024", name: "Löss & Lehm", producer: "Nibiru", grape: "Zweigelt, Blauer Portugieser", region: "Kamptal", country: "AT", price: 40},
  {style: "pink", vintage: "2025", name: "Txakoli Rosado", producer: "Ameztoi", grape: "Hondarrabi Zuri/Beltza", region: "Basque Country", country: "SP", price: 43},
  {style: "pink", vintage: "2025", name: "Rose de Xinomavro", producer: "Thymiopoulos", grape: "Xinomavro", region: "Naoussa", country: "GR", price: 49},
  {style: "pink", vintage: "2025", name: "Rosé", producer: "Alessandro Viola", grape: "Nero D’Avola, Nerello Mascalese", region: "Sicily", country: "IT", price: 53},
  {style: "pink", vintage: "2024", name: "Sancerre Rosé ‘La Noue’", producer: "Claude Riffault", grape: "Pinot Noir", region: "Loire", country: "FR", price: 73},
  {style: "light-red", vintage: "2024", name: "Sfuso", producer: "Cascina Lanzarotti", grape: "Nebbiolo", region: "Langhe", country: "IT", price: 39},
  {style: "light-red", vintage: "2024", name: "Pinot Noir “Les Parcs”", producer: "Guy Allion", grape: "Pinot Noir", region: "Loire", country: "FR", price: 40},
  {style: "light-red", vintage: "2025", name: "Vin de Petanque", producer: "Domaine Mas de Libian", grape: "Grenache, Mourvèdre, Syrah", region: "Ardéche", country: "FR", price: 43},
  {style: "light-red", vintage: "2024", name: "Beaujolais-Villages 'Bibine’", producer: "Domain Bulliat", grape: "Gamay", region: "Beaujolais", country: "FR", price: 44, note: "Chilled"},
  {style: "light-red", vintage: "2025", name: "Puszta Libre!", producer: "Claus Presinger", grape: "Zweigelt, St. Laurent", region: "Burgenland", country: "AT", price: 48, note: "Chilled"},
  {style: "light-red", vintage: "2022", name: "Prima Materia", producer: "Vincent Ruiz", grape: "Grenache", region: "Ardéche", country: "FR", price: 57},
  {style: "light-red", vintage: "2024", name: "Zore", producer: "Naboso", grape: "Andre, Blaufränkisch, Alibernet", region: "Bratislava", country: "SVK", price: 59},
  {style: "light-red", vintage: "2023", name: "Clos Messemé", producer: "Emmanuel Haget", grape: "Cab. Franc", region: "Loire", country: "FR", price: 61, note: "Available chilled"},
  {style: "light-red", vintage: "2023", name: "Foradori", producer: "Agricola Foradori", grape: "Teroldego", region: "Trentino-Alto Adige", country: "IT", price: 62},
  {style: "light-red", vintage: "2025", name: "Olla Rouge", producer: "Matassa", grape: "Grenache Noir, Grenache Gris, Macabeu", region: "Roussillon", country: "FR", price: 65, note: "Chilled"},
  {style: "light-red", vintage: "2021", name: "Bourgogne Rouge", producer: "Domaine Matrot", grape: "Pinot Noir", region: "Burgundy", country: "FR", price: 71},
  {style: "light-red", vintage: "2022", name: "Trousseau", producer: "Domaine De La Pinte", grape: "Trousseau", region: "Jura", country: "FR", price: 72},
  {style: "light-red", vintage: "2024", name: "A Forest", producer: "Ochota Barrels", grape: "Pinot Noir", region: "Adelaide Hills", country: "AUS", price: 73},
  {style: "big-red", vintage: "2022", name: "Rosso", producer: "Valdibella", grape: "Nero d’Avola", region: "Sicily", country: "IT", price: 36, note: "Box wine"},
  {style: "big-red", vintage: "2015", name: "Foutraque", producer: "La Petite Baigneuse", grape: "Carignan, Lledoner Pelut", region: "Languedoc", country: "FR", price: 38},
  {style: "big-red", vintage: "2019", name: "974 Ventvri", producer: "Château Pesquié", grape: "Syrah, Grenache", region: "Southern Rhone", country: "FR", price: 40},
  {style: "big-red", vintage: "2022", name: "Venezia", producer: "De Stefani", grape: "Cabernet Sauvignon, Merlot", region: "Veneto", country: "IT", price: 45},
  {style: "big-red", vintage: "2023", name: "Ultreia ‘Saint Jacques’", producer: "Raúl Pérez", grape: "Mencia", region: "Castilla y León", country: "SP", price: 49},
  {style: "big-red", vintage: "2023", name: "Valpolicella Superiore", producer: "Ripa della Volta", grape: "Corvina, Corvinone, Rondinella.", region: "Veneto", country: "IT", price: 52},
  {style: "big-red", vintage: "2025", name: "Rioja “Bienlarme Lágrimas Bellas”", producer: "Carlos Sánchez", grape: "Tempranillo, Garnacha", region: "Rioja", country: "SP", price: 65},
  {style: "big-red", vintage: "2023", name: "Sanoma County Zinfandel", producer: "Seghesio", grape: "Zinfandel", region: "Sanoma County", country: "USA", price: 67},
  {style: "big-red", vintage: "2022", name: "Versante Nord Rosso", producer: "Eduardo Torres Acosta", grape: "Nerello Mascalese", region: "Sicily", country: "IT", price: 68},
  {style: "big-red", vintage: "2020", name: "Syrah On Sandstone", producer: "Gabriëlskloof", grape: "Syrah", region: "Bot River", country: "SA", price: 72},
  {style: "big-red", vintage: "2017", name: "Barolo Brunate", producer: "Boggione Claudio", grape: "Nebbiolo", region: "Piemonte", country: "IT", price: 90},
  {style: "cellar", group: "Champagne", vintage: "2021", name: "Nos Pas Dans La Pierre", producer: "Marie Copinet", grape: "Pinot Noir", region: "Côte de Sézanne", price: 92},
  {style: "cellar", group: "Champagne", vintage: "NV", name: "S.A \"Brut Sans Année\"", producer: "Flavien Nowack", grape: "P.Meunier, Chardonnay", region: "Vallée de la Marne", price: 99},
  {style: "cellar", group: "Champagne", vintage: "2023", name: "'Mont Chainqueux' Les Mesneux 1er Cru", producer: "Elise Bougy", grape: "P.Noir/Meunier", price: 124},
  {style: "cellar", group: "Champagne", vintage: "2019", name: "Eloquence", producer: "Champagne Marie-Courtin", grape: "Chardonnay", region: "Côte des Bars", price: 135},
  {style: "cellar", group: "Orange", vintage: "2021", name: "Sivi", producer: "Radikon", grape: "Pinot Grigio", region: "Friuli-Venezia Giulia", price: 82},
  {style: "cellar", group: "White", vintage: "2023", name: "Arbois “Pépin Blanc”", producer: "Kevin Bouillet", grape: "Chardonnay", region: "Jura", price: 70},
  {style: "cellar", group: "White", vintage: "2023", name: "Les Cocus", producer: "Thomas Batardiere", grape: "Chenin Blanc", region: "Rablay-sur-Layon", price: 82},
  {style: "cellar", group: "White", vintage: "2017", name: "Arbois “Les Nouvelles”", producer: "Philippe Chatillon", grape: "Savagnin", region: "Jura", price: 85},
  {style: "cellar", group: "White", vintage: "2024", name: "La Lune", producer: "Ferme de la Sansonnière", grape: "Chenin Blanc", region: "Loire", price: 89},
  {style: "cellar", group: "White", vintage: "2023", name: "Chablis “Bel-Air et Clardy”", producer: "De Moor", grape: "Chardonnay", region: "Chablis", price: 93},
  {style: "cellar", group: "White", vintage: "2023", name: "La Truffière", producer: "Domaine Danjou-Banessy", grape: "Carignan Gris", region: "Côtes Catalanes", price: 105},
  {style: "cellar", group: "White", vintage: "2022", name: "Le Feu", producer: "Domaine du Gringet", grape: "Gringet", region: "Savoie", price: 123},
  {style: "cellar", group: "White", vintage: "2021", name: "Les Survivants", producer: "Domaine Ganevat", grape: "Chardonnay", region: "Jura", price: 135},
  {style: "cellar", group: "White", vintage: "2022", name: "Chablis 1er Cru “Vaillons”", producer: "Vincent Dauvissat", grape: "Chardonnay", region: "Chablis", price: 180},
  {style: "cellar", group: "Red", vintage: "2022", name: "Dolcetto d’Alba", producer: "Rinaldi Giuseppe", grape: "Dolcetto", region: "Barolo", price: 89},
  {style: "cellar", group: "Red", vintage: "2023", name: "Crozes-Hermitage Rouge", producer: "Dard et Ribo", grape: "Syrah", region: "Northern Rhône", price: 94},
  {style: "cellar", group: "Red", vintage: "2024", name: "Mâcon “Les Roches”", producer: "Arnaud Lopez", grape: "Gamay", region: "Mâcon", price: 95},
  {style: "cellar", group: "Red", vintage: "2021", name: "Emilien", producer: "Château le Puy", grape: "Merlot blend", region: "Right Bank Bordeaux", price: 95},
  {style: "cellar", group: "Red", vintage: "2022", name: "Granato", producer: "Foradori", grape: "Teroldego", region: "Trentino", price: 118},
  {style: "cellar", group: "Red", vintage: "2022", name: "Cornas “Casimir”", producer: "Domaine Balthazar", grape: "Syrah", region: "Southern Rhone", price: 119},
  {style: "cellar", group: "Red", vintage: "2024", name: "Dessus de Montchenevoy", producer: "Domaine Chanterêves", grape: "Pinot", region: "Savigny-lès-Beaune", price: 130},
  {style: "cellar", group: "Red", vintage: "2017", name: "Barolo Monprivato", producer: "Mascarello Giuseppe e Figlio", grape: "Nebbiolo", region: "Barolo", price: 240},
];

/* ------------------------------------------------------------------ */
/* Events and jobs (from sessa.london/events and /jobs)                 */
/* ------------------------------------------------------------------ */

export const EVENTS = {
  lead: 'We can provide an external bar service for any occasion, from 30 – 300 guests.',
  body: 'Let us take care of the organisation of drinks, staffing, glassware and smooth running of service.',
  ask: 'Send us your event details for a tailor made quote.',
  cta: 'Get in touch',
};

export const JOBS = [
  {
    title: 'Chef de Partie',
    pay: '£39 – £40K incl. service',
    intro:
      'We are looking for a full time CDP to join our kitchen team at Sessa. The CDP will work closely with our Sous Chef, helping run the day-to-day service and operation of the kitchen. The team and kitchen is small so this role would suit someone who feels confident working alone and working across all sections. During the day we serve a simple breakfast/lunch menu and in the evening a menu of seasonal small plates. We have around 30 covers indoors and 14 – 30 outdoors, depending on the season.',
    requirements: [
      '42 – 45 hours per week',
      'Ideal for a CDP looking for some experience in running a small kitchen.',
      'Desire to put your own stamp on the food offering at Sessa.',
      'Running services when more senior chefs are off.',
      'Helping with orders and being aware of GP targets.',
      'Contributing to menu development to maintain an exciting and ever changing seasonal menu.',
      'Great communication and organisation skills.',
      'Maintaining a high standard of hygiene and cleanliness in our small open kitchen.',
      'Common sense.',
    ],
    apply: 'Please email hello@sessa.london to apply.',
  },
];

export const JOBS_OFFER = [
  'Joining a small, family run and fully independent new venture.',
  'Cost price wine (and other stuff) from our suppliers.',
  'Staff discounts.',
  'Staff trainings and tastings.',
  'Staff food.',
];
