"""Paths, API keys and rules.yaml, loaded once per run."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

import yaml
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
BRAND_DIR = ROOT / "brand"
REPORTS_DIR = ROOT / "reports"
FIXTURES_DIR = ROOT / "tests" / "fixtures"
DEFAULT_DB = ROOT / "audits.db"
RULES_PATH = ROOT / "rules.yaml"


@dataclass(frozen=True)
class Keys:
    serpapi: str | None
    psi: str | None
    anthropic: str | None


def load_keys() -> Keys:
    load_dotenv(ROOT / ".env")
    # Empty strings in .env mean "not set".
    get = lambda name: os.environ.get(name) or None  # noqa: E731
    return Keys(serpapi=get("SERPAPI_KEY"), psi=get("PSI_API_KEY"), anthropic=get("ANTHROPIC_API_KEY"))


def load_rules(path: Path = RULES_PATH) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)
