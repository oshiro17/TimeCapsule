const express = require('express');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');

const app = express();
const db = new sqlite3.Database('./db.sqlite');
require('dotenv').config();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    send_at DATETIME
  )`);

  db.run(`ALTER TABLE inquiries ADD COLUMN send_at DATETIME`, (err) => {
    if (err && err.message.includes("duplicate column name")) {
      console.log("send_at カラムは既に存在します");
    } else if (err) {
      console.error("send_at カラムの追加中にエラーが発生しました:", err.message);
    } else {
      console.log("send_at カラムを追加しました");
    }
  });
});

app.post('/submit', (req, res) => {
  const { email, message } = req.body;

  const sendAt = new Date();
  sendAt.setMinutes(sendAt.getMinutes() + 2);

  db.run(
    `INSERT INTO inquiries (email, message, send_at) VALUES (?, ?, ?)`,
    [email, message, sendAt.toISOString()],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('エラーが発生しました');
      }
      res.send('お問い合わせ内容を受け付けました！2分後にメールを送信します。');
    }
  );
});

cron.schedule('* * * * *', () => { // 毎分実行
  const now = new Date().toISOString();

  db.all(`SELECT * FROM inquiries WHERE send_at <= ?`, [now], (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    rows.forEach((row) => {
      sendEmail(row.email, row.message);

      db.run(`DELETE FROM inquiries WHERE id = ?`, [row.id]);
    });
  });
});

function sendEmail(to, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'タイムカプセルが届きました',
    text: `"${message}"`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.error(err);
    }
    console.log('メール送信:', info.response);
  });
}

app.listen(8080, '0.0.0.0', () => {
  console.log('サーバーが http://0.0.0.0:8080 で起動しました');
});
