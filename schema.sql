CREATE TABLE IF NOT EXISTS recipes (
  id          SERIAL PRIMARY KEY,
  title       TEXT,
  servings    TEXT,
  timetotal   TEXT,
  timeactive  TEXT,
  sourcename  TEXT,
  sourceurl   TEXT,
  notes       TEXT,
  steps       TEXT,
  ingredients TEXT,
  tags        TEXT,
  slug        TEXT UNIQUE
);
