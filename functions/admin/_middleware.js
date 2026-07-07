// /admin/* 配下に追加のBasic認証をかけるミドルウェア。
// サイト全体の Basic認証（functions/_middleware.js, BASIC_USER/BASIC_PASS）に加えて、
// 管理者専用の別認証情報（ADMIN_USER/ADMIN_PASS）を要求する（二重認証）。
// Cloudflare Pages の Settings → Variables and Secrets で ADMIN_USER / ADMIN_PASS を設定すること。
export async function onRequest(context) {
  const { request, env, next } = context;
  const user = env.ADMIN_USER;
  const pass = env.ADMIN_PASS;
  if (!user || !pass) {
    return new Response("Admin auth is not configured (set ADMIN_USER / ADMIN_PASS)", { status: 500 });
  }
  const expected = "Basic " + btoa(user + ":" + pass);
  const got = request.headers.get("Authorization") || "";
  if (got === expected) return next();
  return new Response("Admin authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="CCA-F Admin", charset="UTF-8"' },
  });
}
