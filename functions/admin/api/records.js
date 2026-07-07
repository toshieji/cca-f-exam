// GET /admin/api/records → [{ email, practice, mockHistory, comments, updatedAt }, ...]
// functions/admin/_middleware.js が管理者Basic認証をこの配下すべてに適用する。
export async function onRequestGet(context) {
  const { env } = context;
  if (!env.CCAF_KV) {
    return new Response(JSON.stringify({ error: "KV binding CCAF_KV is not configured" }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
  const records = [];
  let cursor;
  do {
    const page = await env.CCAF_KV.list({ prefix: "user:", cursor });
    for (const key of page.keys) {
      const raw = await env.CCAF_KV.get(key.name);
      if (!raw) continue;
      try {
        records.push(JSON.parse(raw));
      } catch (e) {
        // 壊れたレコードはスキップ
      }
    }
    cursor = page.cursor;
    if (page.list_complete) cursor = undefined;
  } while (cursor);

  return new Response(JSON.stringify({ records }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
