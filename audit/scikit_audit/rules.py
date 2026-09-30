"""Turns metrics into findings using rules.yaml.

`when` is a tiny expression language: dotted lookups (speed.mobile.lcp_s, thresholds.cls.poor),
numbers/strings/True/False/None, comparisons, and/or/not. No function calls, no arbitrary Python.
If an expression touches a metric that's missing (its check failed or was skipped), the finding
simply doesn't fire.
"""

from __future__ import annotations

import ast
import operator
import re

SEVERITY_ORDER = {"high": 0, "medium": 1, "low": 2}

COMPARE = {
    ast.Lt: operator.lt,
    ast.LtE: operator.le,
    ast.Gt: operator.gt,
    ast.GtE: operator.ge,
    ast.Eq: operator.eq,
    ast.NotEq: operator.ne,
    ast.Is: operator.is_,
    ast.IsNot: operator.is_not,
}


class Missing(Exception):
    """A value the expression needs isn't there."""


class RuleError(Exception):
    """rules.yaml contains an expression this evaluator doesn't allow."""


def lookup(ctx: dict, path: str):
    cur = ctx
    for part in path.split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            raise Missing(path)
    return cur


def _dotted(node: ast.AST) -> str:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        return _dotted(node.value) + "." + node.attr
    raise RuleError(f"unsupported expression: {ast.dump(node)}")


def evaluate(expr: str, ctx: dict) -> bool:
    try:
        tree = ast.parse(expr, mode="eval")
    except SyntaxError as e:
        raise RuleError(f"bad expression {expr!r}: {e}") from e
    return bool(_eval(tree.body, ctx))


def _eval(node: ast.AST, ctx: dict):
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, (ast.Name, ast.Attribute)):
        return lookup(ctx, _dotted(node))
    if isinstance(node, ast.BoolOp):
        if isinstance(node.op, ast.And):
            return all(_eval(v, ctx) for v in node.values)
        return any(_eval(v, ctx) for v in node.values)
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.Not):
        return not _eval(node.operand, ctx)
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
        return -_eval(node.operand, ctx)
    if isinstance(node, ast.Compare):
        left = _eval(node.left, ctx)
        for op, right_node in zip(node.ops, node.comparators):
            right = _eval(right_node, ctx)
            fn = COMPARE.get(type(op))
            if fn is None:
                raise RuleError(f"unsupported comparison {type(op).__name__}")
            if fn not in (operator.is_, operator.is_not, operator.eq, operator.ne) and (left is None or right is None):
                raise Missing("None in comparison")
            if not fn(left, right):
                return False
            left = right
        return True
    raise RuleError(f"unsupported expression: {type(node).__name__}")


def fmt_value(v) -> str:
    if isinstance(v, float):
        return f"{v:.2f}".rstrip("0").rstrip(".") if abs(v) < 1 else f"{v:.1f}".rstrip("0").rstrip(".")
    return str(v)


def render_text(text: str, ctx: dict) -> str:
    """'{speed.mobile.lcp_s}s' -> '5.2s'."""
    return re.sub(r"\{([a-zA-Z_][\w.]*)\}", lambda m: fmt_value(lookup(ctx, m.group(1))), text)


def build_context(metrics: dict, rules: dict) -> dict:
    """metrics is {check_name: {status, metrics}}; only checks that ran are visible to rules."""
    ctx = {name: r["metrics"] for name, r in metrics.items() if r.get("status") == "ok"}
    ctx["thresholds"] = rules.get("thresholds", {})
    return ctx


def findings(metrics: dict, rules: dict) -> list[dict]:
    ctx = build_context(metrics, rules)
    out = []
    for rule in rules.get("findings", []):
        try:
            if not evaluate(rule["when"], ctx):
                continue
            text = render_text(rule["text"], ctx)
        except Missing:
            continue
        out.append({"id": rule["id"], "section": rule["section"], "severity": rule["severity"], "text": text})
    out.sort(key=lambda f: SEVERITY_ORDER.get(f["severity"], 9))
    return out
