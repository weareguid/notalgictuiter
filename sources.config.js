/**
 * Nostalgic Tuiter — Sources Configuration
 *
 * Add or remove sources here without touching any other file.
 * Each source needs: id, name, url, category, domain
 * Optional: filterKeywords — only articles matching at least one keyword are shown.
 *
 * Categories: 'mexico' | 'international'
 * The 'bluesky' category is reserved for Bluesky handles below.
 */

/**
 * Structured keyword taxonomy for Mexican politics filtering.
 * Accent-insensitive — "Sheinbaum" matches "sheinbaum", "Sémar" matches "semar".
 * Edit any group to broaden or narrow what shows up from filtered sources.
 */
export const KEYWORDS = {
  personas: [
    'Sheinbaum', 'AMLO', 'López Obrador', 'Claudia Sheinbaum',
    'Ebrard', 'Noroña', 'Adán Augusto', 'Xóchitl Gálvez',
    'Mario Delgado', 'Ramírez de la O', 'Alito Moreno',
    'Santiago Creel', 'Lilly Téllez', 'Ricardo Anaya',
    'Dante Delgado', 'Cuauhtémoc Blanco', 'Layda Sansores',
  ],

  partidos: [
    'Morena', 'PAN', 'PRI', 'PRD', 'MC', 'Movimiento Ciudadano',
    'PVEM', 'PT', 'partido verde', 'oposición', 'oficialismo',
    'Frente Amplio', 'Bloque Opositor',
  ],

  instituciones: [
    'SCJN', 'INE', 'TEPJF', 'Senado', 'Cámara de Diputados',
    'Congreso', 'Suprema Corte', 'Banxico', 'SAT', 'IMSS',
    'ISSSTE', 'Pemex', 'CFE', 'Segob', 'SRE', 'SHCP',
    'Sedena', 'Semar', 'FGR', 'CJF', 'Poder Judicial',
  ],

  temas: [
    'reforma judicial', 'Plan C', 'plataforma',
    'nearshoring', 'T-MEC', 'USMCA',
    'seguridad', 'militarización', 'Guardia Nacional',
    'cartel', 'crimen organizado', 'desapariciones',
    'feminicidio', 'violencia de género',
    'presupuesto', 'deuda', 'economía', 'inflación',
    'agua', 'sequía', 'crisis hídrica',
    'elecciones', '2027', 'revocación',
    'NAIM', 'AIFA', 'Tren Maya', 'Corredor Interoceánico',
    'litio', 'minería', 'energía',
    'migrantes', 'migración', 'frontera',
  ],

  estados: [
    'Guerrero', 'Chiapas', 'Oaxaca', 'Tamaulipas',
    'Sinaloa', 'Jalisco', 'CDMX', 'Veracruz',
    'Michoacán', 'Guanajuato',
  ],

  mercados_mx: [
    'Banxico', 'política monetaria', 'tasa de interés', 'tasas de interés',
    'inflación', 'tipo de cambio', 'peso mexicano',
    'BMV', 'Bolsa Mexicana', 'IPC',
    'SHCP', 'Ramírez de la O', 'deuda pública', 'déficit fiscal',
    'Pemex', 'CFE', 'petróleo', 'precio del petróleo',
    'PIB', 'crecimiento económico', 'recesión',
    'remesas', 'inversión extranjera', 'nearshoring',
  ],
};

// Flat array derived from KEYWORDS — used by filterKeywords on each source
export const MEXICO_POLITICS_KEYWORDS = Object.values(KEYWORDS).flat();

/**
 * Structured keyword taxonomy for international news filtering.
 */
export const KEYWORDS_WORLD = {
  // --- AMERICAS ---
  usa: [
    'Trump', 'Biden', 'Harris', 'MAGA', 'Republicans', 'Democrats',
    'Congress', 'Senate', 'Supreme Court', 'White House',
    'tariffs', 'sanctions', 'executive order',
    'Rubio', 'Vance', 'RFK', 'Musk', 'DOGE',
  ],

  latinoamerica: [
    'Milei', 'Petro', 'Lula', 'Boric', 'Bukele',
    'Maduro', 'Venezuela', 'Cuba', 'Nicaragua',
    'Ortega', 'Díaz-Canel',
    'Mercosur', 'CELAC', 'OEA', 'OAS',
    'golpe', 'coup', 'crisis política',
  ],

  // --- EUROPA ---
  europa: [
    'Macron', 'Scholz', 'Meloni', 'Sánchez', 'Starmer',
    'Von der Leyen', 'Michel', 'NATO', 'OTAN',
    'Unión Europea', 'European Union', 'eurozona',
    'elecciones europeas', 'ultraderecha', 'far right',
    'Le Pen', 'AfD', 'Orban',
  ],

  // --- RUSIA / UCRANIA ---
  rusia_ucrania: [
    'Putin', 'Zelensky', 'Zelenski', 'Rusia', 'Ucrania',
    'Russia', 'Ukraine', 'Kremlin', 'guerra', 'war',
    'OTAN', 'NATO', 'armisticio', 'ceasefire',
    'Bielorrusia', 'Lukashenko',
  ],

  // --- MEDIO ORIENTE ---
  medio_oriente: [
    'Gaza', 'Israel', 'Netanyahu', 'Hamas', 'Hezbollah',
    'West Bank', 'Cisjordania', 'IDF', 'UNRWA',
    'Irán', 'Iran', 'Khamenei', 'Arabia Saudita',
    'Yemen', 'Houthis', 'Siria', 'Syria',
    'dos estados', 'two-state', 'alto al fuego', 'ceasefire',
  ],

  // --- ASIA ---
  asia: [
    'China', 'Xi Jinping', 'Taiwán', 'Taiwan',
    'Corea del Norte', 'Kim Jong-un', 'North Korea',
    'Japón', 'India', 'Modi', 'Pakistán',
    'Mar del Sur de China', 'South China Sea',
    'BRICS', 'ASEAN',
  ],

  // --- AFRICA ---
  africa: [
    'Sahel', 'Mali', 'Níger', 'Burkina Faso',
    'Sudan', 'Sudán', 'Etiopía', 'Somalia',
    'golpe militar', 'junta', 'Wagner',
    'Sudáfrica', 'ANC', 'Ramaphosa',
  ],

  // --- ORGANISMOS / TEMAS GLOBALES ---
  global: [
    'ONU', 'UN', 'FMI', 'IMF', 'Banco Mundial', 'World Bank',
    'OMC', 'WTO', 'G7', 'G20',
    'cambio climático', 'climate change', 'COP',
    'inteligencia artificial', 'AI regulation',
    'aranceles', 'tariffs', 'guerra comercial', 'trade war',
    'derechos humanos', 'human rights',
    'desinformación', 'misinformation',
  ],

  // --- MERCADOS / ECONOMÍA GLOBAL ---
  mercados: [
    // Bancos centrales y política monetaria
    'Federal Reserve', 'Fed', 'Powell', 'Warsh',
    'ECB', 'European Central Bank', 'Bank of England',
    'interest rates', 'rate cut', 'rate hike',
    'monetary policy', 'política monetaria',
    'inflation', 'inflación', 'CPI', 'PCE',
    // Mercados
    'S&P 500', 'Dow Jones', 'Nasdaq', 'stock market',
    'Wall Street', 'NYSE', 'bond market', 'Treasury',
    'yield', 'recession', 'GDP',
    // Empresas / figuras
    'Buffett', 'Berkshire', 'BlackRock', 'JPMorgan', 'Goldman Sachs',
    // Crypto / activos alternativos
    'Bitcoin', 'crypto', 'gold', 'oil prices', 'petróleo',
    // Temas macro
    'trade deficit', 'debt ceiling', 'fiscal policy',
    'aranceles', 'tariffs', 'sanctions',
  ],
};

// Flat array derived from KEYWORDS_WORLD — used by filterKeywords on international sources
export const WORLD_KEYWORDS = Object.values(KEYWORDS_WORLD).flat();

export const SOURCES = [
  // ─── MÉXICO ──────────────────────────────────────────────────────────────
  {
    id: 'milenio',
    name: 'Milenio',
    // Milenio has no public RSS — uses Google News XML sitemap instead
    type: 'gnews-sitemap',
    url: 'https://www.milenio.com/sitemap/sitemap-google-news-index.xml',
    category: 'mexico',
    domain: 'milenio.com',
    filterKeywords: MEXICO_POLITICS_KEYWORDS,
  },
  {
    id: 'radioformula',
    name: 'Radio Fórmula',
    // WordPress-style feed; if 404, try /rss or /rss.xml
    url: 'https://www.radioformula.com.mx/feed/',
    category: 'mexico',
    domain: 'radioformula.com.mx',
  },
  {
    id: 'lopezdoriga',
    name: 'López Dóriga',
    url: 'https://lopezdoriga.com/feed/',
    category: 'mexico',
    domain: 'lopezdoriga.com',
  },

  // ─── MÉXICO — POLÍTICA (filtered by keyword) ────────────────────────────
  {
    id: 'eluniversal',
    name: 'El Universal',
    // Arc Publishing feed; section feed: /arc/outboundfeeds/rss/category/nacion/?outputType=xml
    url: 'https://www.eluniversal.com.mx/arc/outboundfeeds/rss/?outputType=xml',
    category: 'mexico',
    domain: 'eluniversal.com.mx',
    filterKeywords: MEXICO_POLITICS_KEYWORDS,
  },
  {
    id: 'elfinanciero',
    name: 'El Financiero',
    // Arc Publishing feed; try /arc/outboundfeeds/rss/category/economia/?outputType=xml for economy
    url: 'https://www.elfinanciero.com.mx/arc/outboundfeeds/rss/?outputType=xml',
    category: 'mexico',
    domain: 'elfinanciero.com.mx',
    filterKeywords: MEXICO_POLITICS_KEYWORDS,
  },
  {
    id: 'expansion',
    name: 'Expansión',
    url: 'https://expansion.mx/rss',
    category: 'mexico',
    domain: 'expansion.mx',
    filterKeywords: MEXICO_POLITICS_KEYWORDS,
  },
  {
    id: 'infobae',
    name: 'Infobae México',
    // Arc Publishing main feed — /category/america/mexico/ only returns evergreen articles
    url: 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml',
    category: 'mexico',
    domain: 'infobae.com',
    filterKeywords: MEXICO_POLITICS_KEYWORDS,
  },
  {
    id: 'aristegui',
    name: 'Aristegui',
    // Sopitas blocks server-side RSS (403); replaced with Aristegui México section
    url: 'https://editorial.aristeguinoticias.com/category/mexico/feed/',
    category: 'mexico',
    domain: 'aristeguinoticias.com',
    filterKeywords: MEXICO_POLITICS_KEYWORDS,
  },

  // ─── INTERNACIONAL ───────────────────────────────────────────────────────
  {
    id: 'nyt-politics',
    name: 'NYT Politics',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    category: 'international',
    domain: 'nytimes.com',
    filterKeywords: WORLD_KEYWORDS,
  },
  {
    id: 'nyt-world',
    name: 'NYT World',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    category: 'international',
    domain: 'nytimes.com',
    filterKeywords: WORLD_KEYWORDS,
  },
  {
    id: 'bbc',
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'international',
    domain: 'bbc.com',
    filterKeywords: WORLD_KEYWORDS,
  },
  {
    id: 'ft',
    name: 'Financial Times',
    // Note: FT retired most public RSS in 2023. This URL covers selected public content.
    url: 'https://www.ft.com/rss/home',
    category: 'international',
    domain: 'ft.com',
    filterKeywords: WORLD_KEYWORDS,
  },
  {
    id: 'politico',
    name: 'Politico',
    url: 'https://rss.politico.com/politics-news.xml',
    category: 'international',
    domain: 'politico.com',
    filterKeywords: WORLD_KEYWORDS,
  },
  {
    id: 'wsj',
    name: 'WSJ World',
    url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
    category: 'international',
    domain: 'wsj.com',
    filterKeywords: WORLD_KEYWORDS,
  },
  {
    id: 'wapo',
    name: 'Washington Post',
    url: 'https://feeds.washingtonpost.com/rss/politics',
    category: 'international',
    domain: 'washingtonpost.com',
    filterKeywords: WORLD_KEYWORDS,
  },
];

/**
 * Structured keyword taxonomy for the World Cup 2026 section.
 * ⚠️ TEMPORARY — remove after July 19, 2026.
 * Matches articles from ANY source (México + Internacional).
 */
export const KEYWORDS_WC2026 = {

  // --- GENERAL TOURNAMENT ---
  torneo: [
    'Mundial 2026', 'World Cup 2026', 'FIFA 2026', 'Copa del Mundo',
    'fase de grupos', 'octavos', 'cuartos', 'semifinal', 'final',
    'round of 32', 'knockout', 'VAR', 'FIFA',
    'Azteca', 'Estadio Azteca', 'Akron', 'Estadio BBVA',
    'MetLife', 'SoFi Stadium', 'AT&T Stadium',
  ],

  // --- EL TRI (prioridad máxima) ---
  mexico: [
    'El Tri', 'Selección Mexicana', 'FMF',
    'Javier Aguirre',
    // Porteros
    'Ochoa', 'Guillermo Ochoa', 'Raúl Rangel',
    // Defensas
    'Edson Álvarez', 'Johan Vásquez', 'César Montes',
    'Julián Araujo', 'Jorge Sánchez',
    // Mediocampistas
    'Luis Chávez', 'Orbelin Pineda', 'Efraín Álvarez',
    'Obed Vargas', 'Álvaro Fidalgo',
    // Delanteros
    'Raúl Jiménez', 'Santiago Giménez', 'César Huerta',
    'Roberto Alvarado', 'Julián Quiñones',
    // Grupo A
    'Sudáfrica', 'South Africa', 'Corea del Sur', 'South Korea',
    'Chequia', 'Czech Republic', 'República Checa',
  ],

  // --- FAVORITOS / SELECCIONES CLAVE ---
  selecciones: [
    // Américas
    'Argentina', 'Brasil', 'Brazil', 'Uruguay', 'Colombia',
    'Estados Unidos', 'USMNT', 'Canadá',
    // Europa
    'España', 'Spain', 'Francia', 'France', 'Inglaterra', 'England',
    'Alemania', 'Germany', 'Portugal', 'Países Bajos', 'Netherlands',
    'Bélgica', 'Belgium', 'Croatia', 'Croacia',
    // Resto
    'Marruecos', 'Morocco', 'Japón', 'Japan',
    'Senegal', 'Australia',
  ],

  // --- ESTRELLAS MUNDIALES ---
  jugadores: [
    'Mbappé', 'Vinicius', 'Bellingham', 'Lamine Yamal',
    'Pedri', 'Rodri', 'Haaland', 'De Bruyne',
    'Salah', 'Lewandowski', 'Son Heung-min',
    'Messi', 'Di María', 'Álvarez Julian',  // Argentina
    'Raphinha', 'Rodrygo',                   // Brasil
    'Ronaldo', 'Bruno Fernandes',            // Portugal
  ],

  // --- SEDES EN MÉXICO ---
  sedes_mexico: [
    'Ciudad de México', 'Guadalajara', 'Monterrey',
    'Azteca', 'Estadio Akron', 'Estadio BBVA',
  ],
};

// Flat array derived from KEYWORDS_WC2026 — used by the World Cup tab filter
export const WORLDCUP_KEYWORDS = Object.values(KEYWORDS_WC2026).flat();

/**
 * Bluesky handles to follow.
 * Add the full handle, e.g. 'username.bsky.social'
 */
export const BLUESKY_HANDLES = [
  // 'journalismlab.bsky.social',
  // 'benthompson.bsky.social',
];
