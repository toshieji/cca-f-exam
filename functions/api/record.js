// Cloudflare Pages Function — 学習者(メールアドレス)ごとの記録をKVに保存/取得する
// 必要な設定: Pages プロジェクトの Settings → Functions → KV namespace bindings で
//   変数名 CCAF_KV にKV namespaceをバインドすること（README参照）
//
// GET  /api/record?email=foo@example.com  → { practice, mockHistory, comments, updatedAt } | null
// POST /api/record  { email, practice, mockHistory, comments } → { ok: true, updatedAt }
//
// 認証は functions/_middleware.js のサイト全体Basic認証にのみ依存する（メール単体では保護しない。
// README「クラウド同期について」に記載の既知のリスク）。

function normalizeEmail(raw) {
  return String(raw || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.CCAF_KV) {
    return jsonResponse({ error: "KV binding CCAF_KV is not configured" }, 500);
  }
  const url = new URL(request.url);
  const email = normalizeEmail(url.searchParams.get("email"));
  if (!isValidEmail(email)) {
    return jsonResponse({ error: "valid email required" }, 400);
  }
  const raw = await env.CCAF_KV.get("user:" + email);
  if (!raw) return jsonResponse(null);
  return new Response(raw, { headers: { "content-type": "application/json; charset=utf-8" } });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.CCAF_KV) {
    return jsonResponse({ error: "KV binding CCAF_KV is not configured" }, 500);
  }
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "invalid JSON body" }, 400);
  }
  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) {
    return jsonResponse({ error: "valid email required" }, 400);
  }
  const record = {
    email,
    practice: body.practice && typeof body.practice === "object" ? body.practice : {},
    mockHistory: Array.isArray(body.mockHistory) ? body.mockHistory : [],
    comments: Array.isArray(body.comments) ? body.comments : [],
    updatedAt: new Date().toISOString(),
  };
  await env.CCAF_KV.put("user:" + email, JSON.stringify(record));
  return jsonResponse({ ok: true, updatedAt: record.updatedAt });
}
