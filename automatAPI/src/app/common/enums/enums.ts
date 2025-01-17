export enum Sizes {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
}

export enum techType {
  flask = 'flask',
  django = 'django',
  express = 'express',
}

export enum techUse {
  services = 'services',
  webApp = 'app_web',
}

export enum configFileTypes {
  dev = 'dev',
  prod = 'prod',
}

export enum dataBaseTypes {
  postgres = 'postgresql',
  mysql = 'mysql',
  sqlite = 'sqlite',
  oracle = 'oracle',
  mssql = 'mssql',
  mariadb = 'mariadb',
  redshift = 'redshift',
  snowflake = 'snowflake',
}

export enum viewEngines {
  pug = 'pug',
  ejs = 'ejs',
  hbs = 'hbs',
  hjs = 'hjs',
  jade = 'jade',
  twig = 'twig',
  vash = 'vash',
}

export enum cssEngines {
  sass = 'sass',
  styl = 'styl',
  scss = 'scss',
  less = 'less',
  css = 'css',
}

export enum httpMethods {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete',
}

export enum languageCodes {
  af = 'af',
  ar = 'ar',
  'ar-dz' = 'ar-dz',
  ast = 'ast',
  az = 'az',
  be = 'be',
  bg = 'bg',
  bn = 'bn',
  br = 'br',
  bs = 'bs',
  ca = 'ca',
  ckb = 'ckb',
  cs = 'cs',
  cy = 'cy',
  da = 'da',
  de = 'de',
  dsb = 'dsb',
  el = 'el',
  en = 'en',
  'en-au' = 'en-au',
  'en-gb' = 'en-gb',
  eo = 'eo',
  es = 'es',
  'es-ar' = 'es-ar',
  'es-co' = 'es-co',
  'es-mx' = 'es-mx',
  'es-ni' = 'es-ni',
  'es-ve' = 'es-ve',
  et = 'et',
  eu = 'eu',
  fa = 'fa',
  fi = 'fi',
  fr = 'fr',
  fy = 'fy',
  ga = 'ga',
  gd = 'gd',
  gl = 'gl',
  he = 'he',
  hi = 'hi',
  hr = 'hr',
  hsb = 'hsb',
  hu = 'hu',
  hy = 'hy',
  ia = 'ia',
  io = 'io',
  id = 'id',
  ig = 'ig',
  is = 'is',
  it = 'it',
  ja = 'ja',
  ka = 'ka',
  kab = 'kab',
  kk = 'kk',
  km = 'km',
  kn = 'kn',
  ko = 'ko',
  ky = 'ky',
  lb = 'lb',
  lt = 'lt',
  lv = 'lv',
  mk = 'mk',
  ml = 'ml',
  mn = 'mn',
  mr = 'mr',
  ms = 'ms',
  my = 'my',
  nb = 'nb',
  ne = 'ne',
  nl = 'nl',
  nn = 'nn',
  no = 'no',
  os = 'os',
  pa = 'pa',
  pl = 'pl',
  pt = 'pt',
  'pt-br' = 'pt-br',
  ro = 'ro',
  ru = 'ru',
  sk = 'sk',
  sl = 'sl',
  sq = 'sq',
  sr = 'sr',
  'sr-latn' = 'sr-latn',
  sv = 'sv',
  sw = 'sw',
  te = 'te',
  tg = 'tg',
  th = 'th',
  tk = 'tk',
  tr = 'tr',
  tt = 'tt',
  udm = 'udm',
  uk = 'uk',
  ur = 'ur',
  uz = 'uz',
  vi = 'vi',
  'zh-cn' = 'zh-cn',
  'zh-hans' = 'zh-hans',
  'zh-hant' = 'zh-hant',
  'zh-hk' = 'zh-hk',
  'zh-mo' = 'zh-mo',
  'zh-my' = 'zh-my',
  'zh-sg' = 'zh-sg',
  'zh-tw' = 'zh-tw',
}

export enum LanguageNames {
  af = 'Afrikaans',
  ar = 'Arabic',
  'ar-dz' = 'Arabic (Algeria)',
  ast = 'Asturian',
  az = 'Azerbaijani',
  be = 'Belarusian',
  bg = 'Bulgarian',
  bn = 'Bengali',
  br = 'Breton',
  bs = 'Bosnian',
  ca = 'Catalan',
  ckb = 'Sorani Kurdish',
  cs = 'Czech',
  cy = 'Welsh',
  da = 'Danish',
  de = 'German',
  dsb = 'Lower Sorbian',
  el = 'Greek',
  en = 'English',
  'en-au' = 'English (Australia)',
  'en-gb' = 'English (United Kingdom)',
  eo = 'Esperanto',
  es = 'Spanish',
  'es-ar' = 'Spanish (Argentina)',
  'es-co' = 'Spanish (Colombia)',
  'es-mx' = 'Spanish (Mexico)',
  'es-ni' = 'Spanish (Nicaragua)',
  'es-ve' = 'Spanish (Venezuela)',
  et = 'Estonian',
  eu = 'Basque',
  fa = 'Persian',
  fi = 'Finnish',
  fr = 'French',
  fy = 'Western Frisian',
  ga = 'Irish',
  gd = 'Scottish Gaelic',
  gl = 'Galician',
  he = 'Hebrew',
  hi = 'Hindi',
  hr = 'Croatian',
  hsb = 'Upper Sorbian',
  hu = 'Hungarian',
  hy = 'Armenian',
  ia = 'Interlingua',
  io = 'Ido',
  id = 'Indonesian',
  ig = 'Igbo',
  is = 'Icelandic',
  it = 'Italian',
  ja = 'Japanese',
  ka = 'Georgian',
  kab = 'Kabyle',
  kk = 'Kazakh',
  km = 'Khmer',
  kn = 'Kannada',
  ko = 'Korean',
  ky = 'Kyrgyz',
  lb = 'Luxembourgish',
  lt = 'Lithuanian',
  lv = 'Latvian',
  mk = 'Macedonian',
  ml = 'Malayalam',
  mn = 'Mongolian',
  mr = 'Marathi',
  ms = 'Malay',
  my = 'Burmese',
  nb = 'Norwegian Bokmål',
  ne = 'Nepali',
  nl = 'Dutch',
  nn = 'Norwegian Nynorsk',
  no = 'Norwegian',
  os = 'Ossetic',
  pa = 'Punjabi',
  pl = 'Polish',
  pt = 'Portuguese',
  'pt-br' = 'Portuguese (Brazil)',
  ro = 'Romanian',
  ru = 'Russian',
  sk = 'Slovak',
  sl = 'Slovenian',
  sq = 'Albanian',
  sr = 'Serbian',
  'sr-latn' = 'Serbian (Latin)',
  sv = 'Swedish',
  sw = 'Swahili',
  te = 'Telugu',
  tg = 'Tajik',
  th = 'Thai',
  tk = 'Turkmen',
  tr = 'Turkish',
  tt = 'Tatar',
  udm = 'Udmurt',
  uk = 'Ukrainian',
  ur = 'Urdu',
  uz = 'Uzbek',
  vi = 'Vietnamese',
  'zh-cn' = 'Chinese (Simplified)',
  'zh-hans' = 'Chinese (Simplified)',
  'zh-hant' = 'Chinese (Traditional)',
  'zh-hk' = 'Chinese (Hong Kong SAR)',
  'zh-mo' = 'Chinese (Macao SAR)',
  'zh-my' = 'Chinese (Malaysia)',
  'zh-sg' = 'Chinese (Singapore)',
  'zh-tw' = 'Chinese (Traditional)',
}

export enum LanguageNamesSpanish {
  af = 'afrikáans',
  ar = 'árabe',
  'ar-dz' = 'árabe argelino',
  ast = 'asturiano',
  az = 'azerí',
  be = 'bielorruso',
  bg = 'búlgaro',
  bn = 'bengalí',
  br = 'bretón',
  bs = 'bosnio',
  ca = 'catalán',
  ckb = 'kurdo central',
  cs = 'checo',
  cy = 'galés',
  da = 'danés',
  de = 'alemán',
  dsb = 'bajo sorbio',
  el = 'griego',
  en = 'inglés',
  'en-au' = 'inglés australiano',
  'en-gb' = 'inglés británico',
  eo = 'esperanto',
  es = 'español',
  'es-ar' = 'español argentino',
  'es-co' = 'español colombiano',
  'es-mx' = 'español mexicano',
  'es-ni' = 'español nicaragüense',
  'es-ve' = 'español venezolano',
  et = 'estonio',
  eu = 'vasco',
  fa = 'persa',
  fi = 'finés',
  fr = 'francés',
  fy = 'frisón occidental',
  ga = 'irlandés',
  gd = 'gaélico escocés',
  gl = 'gallego',
  he = 'hebreo',
  hi = 'hindi',
  hr = 'croata',
  hsb = 'alto sorbio',
  hu = 'húngaro',
  hy = 'armenio',
  ia = 'interlingua',
  io = 'ido',
  id = 'indonesio',
  ig = 'igbo',
  is = 'islandés',
  it = 'italiano',
  ja = 'japonés',
  ka = 'georgiano',
  kab = 'cabila',
  kk = 'kazajo',
  km = 'camboyano',
  kn = 'canarés',
  ko = 'coreano',
  ky = 'kirguís',
  lb = 'luxemburgués',
  lt = 'lituano',
  lv = 'letón',
  mk = 'macedonio',
  ml = 'malayalam',
  mn = 'mongol',
  mr = 'maratí',
  ms = 'malayo',
  my = 'birmano',
  nb = 'bokmål noruego',
  ne = 'nepalí',
  nl = 'neerlandés',
  nn = 'nynorsk noruego',
  no = 'noruego',
  os = 'osético',
  pa = 'panyabí',
  pl = 'polaco',
  pt = 'portugués',
  'pt-br' = 'portugués brasileño',
  ro = 'rumano',
  ru = 'ruso',
  sk = 'eslovaco',
  sl = 'esloveno',
  sq = 'albanés',
  sr = 'serbio',
  'sr-latn' = 'serbio latino',
  sv = 'sueco',
  sw = 'suajili',
  te = 'telugú',
  tg = 'tayiko',
  th = 'Tailandés',
  tk = 'Turcomano',
  tr = 'Turco',
  tt = 'Tártaro',
  udm = 'Udmurto',
  uk = 'Ucraniano',
  ur = 'Urdu',
  uz = 'Uzbeko',
  vi = 'Vietnamita',
  'zh-cn' = 'Chino simplificado',
  'zh-hans' = 'Chino simplificado',
  'zh-hant' = 'Chino tradicional',
  'zh-hk' = 'Chino hongkonés',
  'zh-mo' = 'Chino macaense',
  'zh-my' = 'Chino malasio',
  'zh-sg' = 'Chino singapurense',
  'zh-tw' = 'Chino tradicional',
}

export enum DjangoFieldType {
  Auto = 'Auto',
  Boolean = 'Boolean',
  Char = 'Char',
  Date = 'Date',
  DateTime = 'DateTime',
  Decimal = 'Decimal',
  Duration = 'Duration',
  Email = 'Email',
  File = 'File',
  Float = 'Float',
  ForeignKey = 'ForeignKey',
  Image = 'Image',
  Integer = 'Integer',
  GenericIPAddress = 'GenericIPAddress',
  ManyToMany = 'ManyToMany',
  NullBoolean = 'NullBoolean',
  PositiveInteger = 'PositiveInteger',
  PositiveSmallInteger = 'PositiveSmallInteger',
  Slug = 'Slug',
  SmallInteger = 'SmallInteger',
  Text = 'Text',
  Time = 'Time',
  URL = 'URL',
  UUID = 'UUID',
}

export enum TemplateField {
  'T_TEMPLATE_ID' = 'id',
  'T_TEMPLATE_USER' = 'user_id',
  'T_TEMPLATE_NAME' = 'app_name',
  'T_TEMPLATE_DESC' = 'description',
  'T_TEMPLATE_TECH' = 'technology',
  'T_TEMPLATE_TECH_TYPE' = 'tech_type',
  'T_TEMPLATE_DATE' = 'date_created',
  'T_TEMPLATE_LAST_UPDATE' = 'last_updated',
}

export enum UserField {
  'T_USER_ID' = 'id',
  'T_USER_USERNAME' = 'username',
  'T_USER_EMAIL' = 'email',
  'T_USER_DATE' = 'date',
  'T_USER_FIRSTNAME' = 'firstName',
  'T_USER_LASTNAME' = 'lastName',
  'T_USER_GOOGLE' = 'google_id',
  'T_USER_GITHUB' = 'github_id',
  'T_USER_ROLE' = 'role',
}
