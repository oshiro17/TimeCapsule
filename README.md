# TimeCapsule

## 概要
指定したメールアドレスにタイムカプセル形式でメッセージを送信できるアプリケーションです!
登録したメッセージが自動的にメールで送信されます!

---

## 技術スタック
- **バックエンド**: Node.js, Express  
- **データベース**: SQLite  
- **スケジュール管理**: node-cron  
- **メール送信**: nodemailer  
- **フロントエンド**: HTML, CSS  

---

## デプロイ済みページ
ローカルサーバーが動作している場合、以下のURLからアクセスできます：  
[http://60.129.113.162:8080/](http://60.129.113.162:8080/)  
※現在、ローカル環境でのホスティングのため、重過ぎて停止している可能性があります（涙）

---

## 動作方法

###その1. 環境変数の設定
送信元のメールアドレスを設定しないといけません
ルートディレクトリに`.env`ファイルを作成し、以下の内容を記載します：

```
EMAIL_USER=メールアドレス
EMAIL_PASS=メールパスワード
```

または、以下のコマンドで自動作成できます：

```
echo "EMAIL_USER=メールアドレス
EMAIL_PASS=メールパスワード" > .env
```

### その2. 依存パッケージのインストール
プロジェクトのルートディレクトリで以下を実行してください：

```
npm install
```

### その3. サーバーの起動
以下のコマンドでアプリケーションを起動します：

```
node server.js
```

起動後、以下のメッセージが表示されれば成功です：

```
サーバーが http://0.0.0.0:8080 で起動しました
send_at カラムは既に存在します
```

### その4. アプリケーションへのアクセス
ブラウザで以下のURLにアクセスしてください：  
[http://localhost:8080](http://localhost:8080)

---

## グローバルIPアドレスからのアクセス方法

### 1. ファイアウォール設定
- Macの「システム設定」 > 「セキュリティとプライバシー」 > 「ファイアウォール」を開きます。  
- 「ファイアウォールをオンにする」が有効になっている場合は、「ファイアウォールオプション」から`node`を「インバウンド接続を許可する」リストに追加してください。

### 2. ルーターのポートフォワーディング設定
ルーターの管理画面で以下の設定を行います：

- **内部IPアドレス**: ローカルIPアドレス（例: `192.168.1.100`）  
- **内部ポート**: `8080`  
- **外部ポート**: `8080`  
- **プロトコル**: TCP  

### 3. 接続確認
- [https://canyouseeme.org/](https://canyouseeme.org/) でポートの開放状況を確認してください。  
- 「What is my IP」と検索して表示されたグローバルIPアドレスを確認します。  
- ブラウザで以下の形式でアクセスしてください：

```
http://<グローバルIP>:8080
```

---

## 注意点
- **NATループバック（ヘアピンNAT）の問題**  
  同じ端末（Node.jsサーバーをホストしている端末）からグローバルIPでアクセスする場合、NATループバックがルーターで有効になっていないと接続できない場合があります。この場合は外部デバイスで動作確認を行ってください。

---
