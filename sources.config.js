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
 * Keywords for Mexican politics filtering.
 * Accent-insensitive — "secretaría" is matched by "secretaria".
 * Edit this list to broaden or narrow what shows up from filtered sources.
 */
export const MEXICO_POLITICS_KEYWORDS = [
  // Presidenta y ejecutivo
  'sheinbaum', 'presidenta', 'presidencia', 'gobierno federal', 'poder ejecutivo',
  'secretaria', 'secretario',
  // Congreso
  'senado', 'senador', 'senadora',
  'diputado', 'diputada', 'diputados',
  'camara de diputados', 'congreso', 'legislativo', 'legislatura',
  // Partidos y elecciones
  'morena', 'partido accion nacional', 'partido revolucionario institucional',
  'movimiento ciudadano', 'partido del trabajo', 'partido verde',
  'partido', 'candidato', 'candidata', 'eleccion', 'electoral',
  // Deportes permitidos
  'mundial', 'copa mundial', 'world cup', 'seleccion mexicana', 'tri',
  // Instituciones
  'suprema corte', 'scjn', 'poder judicial', 'ministro', 'ministra',
  'fgr', 'fiscalia', 'fiscal general', 'procurador',
  'ine', 'gobernador', 'gobernadora', 'gobierno de',
  // Temas
  'politica', 'politico',
  'reforma constitucional', 'reforma electoral', 'reforma judicial', 'reforma',
  'presupuesto federal', 'presupuesto', 'iniciativa de ley',
  'constitucion', 'constitucional',
  // Figuras
  'noroña', 'monreal', 'adán augusto', 'adan augusto', 'mario delgado',
  'xochitl', 'galvez', 'claudia sheinbaum',
];

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
    id: 'nmas',
    name: 'N+',
    // If this 404s, check nmas.com.mx for a current RSS link
    url: 'https://www.nmas.com.mx/feed/',
    category: 'mexico',
    domain: 'nmas.com.mx',
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
  },
  {
    id: 'nyt-world',
    name: 'NYT World',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    category: 'international',
    domain: 'nytimes.com',
  },
  {
    id: 'bbc',
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'international',
    domain: 'bbc.com',
  },
  {
    id: 'ft',
    name: 'Financial Times',
    // Note: FT retired most public RSS in 2023. This URL covers selected public content.
    url: 'https://www.ft.com/rss/home',
    category: 'international',
    domain: 'ft.com',
  },
  {
    id: 'politico',
    name: 'Politico',
    url: 'https://rss.politico.com/politics-news.xml',
    category: 'international',
    domain: 'politico.com',
  },
  {
    id: 'wsj',
    name: 'WSJ World',
    url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
    category: 'international',
    domain: 'wsj.com',
  },
  {
    id: 'wapo',
    name: 'Washington Post',
    url: 'https://feeds.washingtonpost.com/rss/politics',
    category: 'international',
    domain: 'washingtonpost.com',
  },
];

/**
 * Keywords for the temporary World Cup 2026 section.
 * Matches articles from ANY source (México + Internacional).
 */
export const WORLDCUP_KEYWORDS = [
  'mundial', 'copa mundial', 'world cup',
  'mundial 2026', 'world cup 2026',
  'seleccion mexicana', 'el tri',
  'concacaf', 'estadio azteca',
  'fifa', 'eliminatoria',
  'guadalajara 2026', 'monterrey 2026',
];

/**
 * Bluesky handles to follow.
 * Add the full handle, e.g. 'username.bsky.social'
 */
export const BLUESKY_HANDLES = [
  // 'journalismlab.bsky.social',
  // 'benthompson.bsky.social',
];
