# CCA-F Exam Console（受講生向け配信リポジトリ）

CCA-F (Claude Certified Architect – Foundations) 対策のオリジナル問題コンソール（練習モード / 本番同等モード / 履歴・コメント機能、日英対応）。

- `index.html` — 試験コンソール本体（単一ファイル・生成物）。**編集禁止**（正本は開発リポジトリ側。ここへは生成結果だけが同期される。ただし学習者/コメント/クラウド同期まわりのUIロジックはこのリポジトリのみに存在する）
- `cca-f-console-offline.html` — **旧版（完全オフライン・保管用）**。このHTML1つだけでインターネットなしで動作する（外部通信ゼロ）。メール同期・管理画面は含まず、記録はブラウザ内(localStorage)のみ。ダブルクリックでブラウザで開けば単体で使える
- `functions/_middleware.js` — Cloudflare Pages 用 Basic 認証ミドルウェア（サイト全体・受講生向け）
- `functions/api/record.js` — 学習者（メールアドレス）ごとの記録をCloudflare KVに保存/取得するAPI
- `functions/admin/_middleware.js` — `/admin/*` 用の追加Basic認証（管理者専用・二重認証）
- `functions/admin/api/records.js` — 管理画面用：全学習者の記録をまとめて返すAPI
- `admin/index.html` — 管理画面（学習者ごとの正答率・誤答が多い問題・コメント一覧を表示）

## 配信セットアップ（Cloudflare Pages・無料）

1. Cloudflare ダッシュボード → **Workers & Pages → Create → Pages → Connect to Git** → このリポジトリ `cca-f-exam` を選択
2. ビルド設定はすべて空のまま（Framework preset: None / Build command: なし / Output dir: `/`）→ Deploy
3. プロジェクトの **Settings → Variables and Secrets** で以下を追加（Production）:
   - `BASIC_USER` = 受講生に配るID（半角英数）
   - `BASIC_PASS` = パスワード（半角英数記号）
   - `ADMIN_USER` = 管理者用ID（`BASIC_USER` とは別のものを推奨）
   - `ADMIN_PASS` = 管理者用パスワード
4. **クラウド同期用のKV作成**（学習者ごとの記録をメールアドレスで永続化するために必要）:
   - Cloudflare ダッシュボード → **Workers & Pages → KV** → Create a namespace（例: `ccaf-records`）
   - このPagesプロジェクトの **Settings → Functions → KV namespace bindings** → Add binding
     - Variable name: `CCAF_KV`
     - KV namespace: 上で作成したnamespaceを選択
5. **Deployments → Retry deployment**（環境変数・KVバインドを反映）→ 発行された `https://<project>.pages.dev` にアクセスすると Basic 認証が要求される

以後は `main` に push するだけで自動デプロイされます。ID/PW の変更も環境変数の更新＋再デプロイのみ。

`CCAF_KV` を設定しない場合、`/api/record` はエラーを返しますが、コンソール自体はローカル（localStorage）のみの動作に自動的にフォールバックし、クラッシュはしません（学習者はヘッダーに「⚠️ オフライン」と表示されます）。

## 受講生の使い方

1. 配布された URL / ID / パスワードでアクセス
2. 画面右上 **👤 メール** で自分のメールアドレスを登録（成績・履歴・コメントがそのメールアドレスに紐づいてクラウドに同期され、別の端末・ブラウザでも同じメールアドレスで引き継げます）
3. 「練習」タブ＝1問ずつ解説付き、「本番モード」タブ＝60問・120分の模試
4. 問題への指摘・質問は各問題の「💬 コメント」に保存 → **履歴タブ → JSONエクスポート** でファイルを書き出し、講師（江尻）へ送付（クラウド同期にも自動保存されるため必須ではない）
5. 詳しい操作方法は画面の **「❓ 使い方」タブ** を参照（学習者ごとの記録の仕組み・コメントの保存/書き出し方法・クラウド同期の注意点などを説明）

## 管理画面（講師用）

- URL: `https://<project>.pages.dev/admin/`
- サイト全体のBasic認証（受講生と共通のID/PW）に加えて、`ADMIN_USER` / `ADMIN_PASS` の入力を追加で求められます（二重認証）
- 学習者（メールアドレス）ごとの総合正答率、誤答が多い問題トップ30、本番モード受験履歴、寄せられたコメントを一覧できます

## 注意

- 学習履歴はブラウザ（localStorage）に加えて、メールアドレスを登録した場合はCloudflare KV（クラウド）にも保存されます。メールアドレスを登録しない場合はこの端末のみの記録です
- **メールアドレスにはパスワードによる保護がありません。** サイト全体の共通ID/PWを知っている人は、他人のメールアドレスを入力すればその人の記録を閲覧・上書きできます。学習用の簡易的な仕組みとしてご利用ください（README作成時点でパスワード付き認証は未実装。将来的な検討事項）
- 本リポジトリは公開されているため、ソースを見れば正解データは閲覧できます。**学習用ツール**であり、成績評価・選抜には使用しないでください
- 収載されているのはすべてオリジナル問題です（Anthropic 公式試験問題の複製は含まれません）
