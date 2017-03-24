CREATE TABLE "customers"
(
    id INTEGER PRIMARY KEY,
    code TEXT,
    name TEXT,
    note TEXT,
    price REAL,
    category TEXT,
    created_at INTEGER,
    updated_at INTEGER,
    finished_at INTEGER
, finished TINYINT(1) NULL);
CREATE TABLE events
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    start_time DATETIME,
    end_time DATETIME,
    price DOUBLE,
    created_at DATETIME,
    updated_at DATETIME
);
CREATE UNIQUE INDEX events_id_uindex ON events (id);
CREATE TABLE "relations"
(
    event_id INTEGER,
    customer_id INTEGER,
    created_at TEXT,
    updated_at TEXT,
    id INTEGER PRIMARY KEY AUTOINCREMENT
);
CREATE UNIQUE INDEX relations_id_uindex ON "relations" (id);

-- Down
DROP TABLE "customers"
DROP TABLE "events";
DROP TABLE "relations";
