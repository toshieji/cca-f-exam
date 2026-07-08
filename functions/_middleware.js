// Cloudflare Pages Functions — サイト全体に Basic 認証を掛けるミドルウェア
// 認証情報は Cloudflare Pages の環境変数に設定する（リポジトリには置かない）:
//   受講生用   BASIC_USER / BASIC_PASS   … サイト全体
//   管理者用   ADMIN_USER / ADMIN_PASS   … /admin/* だけ
//
// 認証はすべてこのルートミドルウェアで行う。ルートの _middleware だけが静的ファイル
// (admin/index.html を含む) の前で必ず実行されることが保証されているため、/admin/* の
// 認証もここで済ませる（ネストした functions/admin/_middleware.js に任せると、静的な
// 管理画面HTMLが認証されずに配信される恐れがある）。
// HTTP Basic 認証は1リクエストにつき1組の資格情報しか送れないので、パスに応じて
// 要求する資格情報を切り替える（二重掛けはしない）。
export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const isAdmin = url.pathname === "/admin" || url.pathname.startsWith("/admin/");

  const user = isAdmin ? env.ADMIN_USER : env.BASIC_USER;
  const pass = isAdmin ? env.ADMIN_PASS : env.BASIC_PASS;
  const realm = isAdmin ? "CCA-F Admin" : "CCA-F Exam Console";
  const varNames = isAdmin ? "ADMIN_USER / ADMIN_PASS" : "BASIC_USER / BASIC_PASS";

  if (!user || !pass) {
    return new Response("Auth is not configured (set " + varNames + ")", { status: 500 });
  }
  const expected = "Basic " + btoa(user + ":" + pass);
  const got = request.headers.get("Authorization") || "";
  if (got === expected) return next();
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="' + realm + '", charset="UTF-8"' },
  });
}
