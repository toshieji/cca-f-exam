// Cloudflare Pages Functions — サイト全体に Basic 認証を掛けるミドルウェア
// 認証情報は Cloudflare Pages の環境変数 BASIC_USER / BASIC_PASS に設定する（リポジトリには置かない）
export async function onRequest(context) {
  const { request, env, next } = context;
  const user = env.BASIC_USER;
  const pass = env.BASIC_PASS;
  if (!user || !pass) {
    return new Response("Auth is not configured (set BASIC_USER / BASIC_PASS)", { status: 500 });
  }
  const expected = "Basic " + btoa(user + ":" + pass);
  const got = request.headers.get("Authorization") || "";
  if (got === expected) return next();
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="CCA-F Exam Console", charset="UTF-8"' },
  });
}
