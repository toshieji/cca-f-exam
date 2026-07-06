# CCA-F Exam Console（受講生向け配信リポジトリ）

CCA-F (Claude Certified Architect – Foundations) 対策のオリジナル問題コンソール（練習モード / 本番同等モード / 履歴・コメント機能、日英対応）。

- `index.html` — 試験コンソール本体（単一ファイル・生成物）。**編集禁止**（正本は開発リポジトリ側。ここへは生成結果だけが同期される）
- `functions/_middleware.js` — Cloudflare Pages 用 Basic 認証ミドルウェア

## 配信セットアップ（Cloudflare Pages・無料）

1. Cloudflare ダッシュボード → **Workers & Pages → Create → Pages → Connect to Git** → このリポジトリ `cca-f-exam` を選択
2. ビルド設定はすべて空のまま（Framework preset: None / Build command: なし / Output dir: `/`）→ Deploy
3. プロジェクトの **Settings → Variables and Secrets** で以下を追加（Production）:
   - `BASIC_USER` = 受講生に配るID（半角英数）
   - `BASIC_PASS` = パスワード（半角英数記号）
4. **Deployments → Retry deployment**（環境変数を反映）→ 発行された `https://<project>.pages.dev` にアクセスすると Basic 認証が要求される

以後は `main` に push するだけで自動デプロイされます。ID/PW の変更も環境変数の更新＋再デプロイのみ。

## 受講生の使い方

1. 配布された URL / ID / パスワードでアクセス
2. 画面右上 **👤 学習者** で自分の名前を登録（成績・履歴・コメントが自分の名前で端末に保存されます）
3. 「練習」タブ＝1問ずつ解説付き、「本番モード」タブ＝60問・120分の模試
4. 問題への指摘・質問は各問題の「💬 コメント」に保存 → **履歴タブ → JSONエクスポート** でファイルを書き出し、講師（江尻）へ送付
5. 詳しい操作方法は画面の **「❓ 使い方」タブ** を参照（学習者ごとの記録の仕組み・コメントの保存/書き出し方法などを説明）

## 注意

- 学習履歴はブラウザ（localStorage）保存です。端末やブラウザを変えると履歴は引き継がれません
- 本リポジトリは公開されているため、ソースを見れば正解データは閲覧できます。**学習用ツール**であり、成績評価・選抜には使用しないでください
- 収載されているのはすべてオリジナル問題です（Anthropic 公式試験問題の複製は含まれません）
