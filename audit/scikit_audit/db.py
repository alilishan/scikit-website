"""The audit log: one SQLite table, one row per audit."""

from __future__ import annotations

import json
import sqlite3
from datetime import UTC, datetime, timedelta
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS audits (
  id              INTEGER PRIMARY KEY,
  domain          TEXT NOT NULL,
  url             TEXT NOT NULL,
  created_at      TEXT NOT NULL,
  status          TEXT NOT NULL,
  terms_json      TEXT,
  metrics_json    TEXT,
  raw_json        TEXT,
  findings_json   TEXT,
  draft_json      TEXT,
  serpapi_used    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS audits_domain_created ON audits(domain, created_at);
"""

JSON_FIELDS = ("terms", "metrics", "raw", "findings", "draft")


def now() -> datetime:
    return datetime.now(UTC)


class AuditDB:
    def __init__(self, path: Path | str):
        self.conn = sqlite3.connect(str(path))
        self.conn.row_factory = sqlite3.Row
        self.conn.executescript(SCHEMA)

    def _row(self, row: sqlite3.Row | None) -> dict | None:
        if row is None:
            return None
        out = dict(row)
        for f in JSON_FIELDS:
            val = out.pop(f + "_json")
            out[f] = json.loads(val) if val else None
        return out

    def create(self, domain: str, url: str) -> int:
        cur = self.conn.execute(
            "INSERT INTO audits (domain, url, created_at, status) VALUES (?, ?, ?, 'running')",
            (domain, url, now().isoformat()),
        )
        self.conn.commit()
        return cur.lastrowid

    def update(self, audit_id: int, **fields) -> None:
        cols, vals = [], []
        for k, v in fields.items():
            if k in JSON_FIELDS:
                cols.append(f"{k}_json = ?")
                vals.append(json.dumps(v))
            else:
                cols.append(f"{k} = ?")
                vals.append(v)
        self.conn.execute(f"UPDATE audits SET {', '.join(cols)} WHERE id = ?", (*vals, audit_id))
        self.conn.commit()

    def add_serpapi_used(self, audit_id: int, n: int) -> None:
        self.conn.execute("UPDATE audits SET serpapi_used = serpapi_used + ? WHERE id = ?", (n, audit_id))
        self.conn.commit()

    def get(self, audit_id: int) -> dict | None:
        return self._row(self.conn.execute("SELECT * FROM audits WHERE id = ?", (audit_id,)).fetchone())

    def latest(self, domain: str, status: str | None = None, within_days: int | None = None) -> dict | None:
        sql, args = "SELECT * FROM audits WHERE domain = ?", [domain]
        if status:
            sql += " AND status = ?"
            args.append(status)
        if within_days is not None:
            sql += " AND created_at >= ?"
            args.append((now() - timedelta(days=within_days)).isoformat())
        sql += " ORDER BY created_at DESC LIMIT 1"
        return self._row(self.conn.execute(sql, args).fetchone())

    def serpapi_used_this_month(self) -> int:
        start = now().replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()
        row = self.conn.execute("SELECT COALESCE(SUM(serpapi_used), 0) FROM audits WHERE created_at >= ?", (start,)).fetchone()
        return int(row[0])

    def recent(self, limit: int = 20) -> list[dict]:
        rows = self.conn.execute(
            "SELECT id, domain, created_at, status, serpapi_used FROM audits ORDER BY created_at DESC LIMIT ?", (limit,)
        ).fetchall()
        return [dict(r) for r in rows]
