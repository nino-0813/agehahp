<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# おばんざいアゲハ食堂

瀬戸内海に囲まれた自然との調和を感じる場所。因島の食堂のウェブサイトです。

## 機能

- レスポンシブデザイン（スマホ・タブレット・PC対応）
- カレンダー機能（Googleスプレッドシート連携）
- イベント詳細モーダル
- サイクリングドリンクメニュー
- メニュー画像表示

## ローカル開発

**前提条件:** Node.js

1. 依存関係のインストール:
   ```bash
   npm install
   ```

2. 環境変数の設定（オプション）:
   - `.env.local` ファイルを作成
   - `GEMINI_API_KEY` を設定（MenuAssistant機能を使用する場合のみ必要）
   - 例: `GEMINI_API_KEY=your_api_key_here`

3. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

4. ブラウザで `http://localhost:3001` を開く

## Vercelでのデプロイ

### 環境変数設定（オプション）

Vercelのダッシュボードで以下の環境変数を設定できます（MenuAssistant機能を使用する場合のみ）:

- `GEMINI_API_KEY`: Gemini API キー

### デプロイ手順

1. Vercelにログイン
2. 「New Project」をクリック
3. GitHubリポジトリ `nino-0813/agehahp` を選択
4. 設定は自動検出されます（Viteプロジェクト）
5. 環境変数を設定（必要に応じて）
6. 「Deploy」をクリック

## カレンダー機能

Googleスプレッドシートと連携してカレンダーイベントを表示します。

- スプレッドシートの列: `日付`, `タイプ`, `タイトル`, `説明`, `画像URL`
- Google Apps ScriptのWebアプリを「誰でもアクセス可能」に設定する必要があります

## ビルド

```bash
npm run build
```

ビルド成果物は `dist` フォルダに出力されます。
