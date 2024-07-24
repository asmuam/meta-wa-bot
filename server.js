/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { handleStatBoy, handleStatGen } from "./statsHandlers.js";
import { handleGeminiResponse } from "./aiHandlers.js";
import { signatureRequired } from "./security.js";
import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();

// Mengatur middleware untuk menangani permintaan JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to parse the raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
// Mendapatkan variabel lingkungan yang diperlukan
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

// Pesan sambutan yang akan dikirim saat pengguna mengakses bot
const homeMessage = `Selamat Datang di BPS Boyolali Bot\n\nKetik 1 untuk bertanya statistik Boyolali\nKetik 2 untuk bertanya statistik secara umum\nKetik 3 untuk bertanya AI\nKetik 4 untuk bertanya dengan CS\n\n📷 Instagram : https://www.instagram.com/bpskabboyolali/\n🎥 YouTube : https://www.youtube.com/@BPSKabupatenBoyolali`;

// Objek untuk melacak status sesi pengguna
const sessionStatus = {};

// Daftar opsi yang valid yang dapat dipilih pengguna
const validOptions = ["1", "2", "3", "4"];
let serverOnlineTime = 0;


/**
 * Mengirim pesan WhatsApp menggunakan Graph API Facebook.
 * Pesan dapat dikirim sebagai balasan untuk pesan tertentu dengan menyediakan ID pesan konteks.
 *
 * @async
 * @function
 * @name sendWhatsAppMessage
 *
 * @param {string} phone_number_id - ID nomor telepon bisnis yang digunakan untuk mengirim pesan.
 * @param {string} recipient - Nomor telepon penerima pesan.
 * @param {string} text - Teks pesan yang akan dikirim.
 * @param {string} [context_message_id=null] - (Opsional) ID pesan konteks untuk mengirim balasan.
 *
 * @example
 * sendWhatsAppMessage('123456789', 'recipient123', 'Hello, world!');
 * sendWhatsAppMessage('123456789', 'recipient123', 'This is a reply', 'message_id_456');
 *
 * @returns {Promise<void>}
 */
async function sendWhatsAppMessage(phone_number_id, recipient, text, context_message_id = null) {
  const url = `https://graph.facebook.com/v20.0/${phone_number_id}/messages`;
  const headers = {
    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    "Content-Type": "application/json",
  };
  const data = {
    messaging_product: "whatsapp",
    to: recipient,
    text: { body: text },
  };
  if (context_message_id) {
    data.context = { message_id: context_message_id };
  }

  try {
    const response = await axios.post(url, data, { headers });
    console.log("Message sent successfully:");
  } catch (error) {
    console.error("Error sending message:");
    console.error(`Recipient: ${recipient}`);
    console.error(`Message: ${text}`);
    console.error("Error details:", error.response.data);
  }
}



/**
 * Menangani kedaluwarsa sesi untuk penerima tertentu.
 * Menghapus status sesi dari objek sessionStatus dan mengirim pesan pemberitahuan sesi kedaluwarsa melalui WhatsApp.
 *
 * @async
 * @function
 * @name handleSessionExpiration
 * 
 * @param {string} business_phone_number_id - ID nomor telepon bisnis yang digunakan untuk mengirim pesan.
 * @param {string} recipient - Penerima yang sesi-nya telah berakhir.
 *
 * @example
 * handleSessionExpiration('123456789', 'recipient123');
 *
 * @returns {Promise<void>}
 */
async function handleSessionExpiration(business_phone_number_id, recipient) {
  delete sessionStatus[recipient];
  const sessionExpiredMessage = "Sesi Anda telah berakhir. Silahkan kirim pesan lagi untuk memulai sesi baru.";
  console.log("SESSION EXPIRED :", business_phone_number_id, " ", recipient);
  await sendWhatsAppMessage(business_phone_number_id, recipient, sessionExpiredMessage);
}



/**
 * Memeriksa kedaluwarsa sesi untuk setiap penerima dalam objek sessionStatus.
 * Jika sesi telah tidak aktif selama lebih dari 3 menit (180000 ms), sesi akan dianggap kedaluwarsa dan
 * fungsi handleSessionExpiration akan dipanggil untuk menangani kedaluwarsa sesi tersebut.
 *
 * @function
 * @name checkSessionExpiration
 *
 * @example
 * checkSessionExpiration();
 *
 * @returns {void}
 */
function checkSessionExpiration() {
  const currentTime = Date.now();
  for (const recipient in sessionStatus) {
    if ((currentTime - sessionStatus[recipient].lastActive) > 100000) {
      handleSessionExpiration(sessionStatus[recipient].businessPhoneNumberId, recipient);
    }
  }
}


/**
 * Memanggil fungsi checkSessionExpiration setiap 60 detik (60000 ms) untuk memeriksa dan menangani
 * kedaluwarsa sesi secara berkala.
 *
 * @example
 * setInterval(checkSessionExpiration, 60000);
 *
 * @returns {void}
 */
setInterval(checkSessionExpiration, 60000);

/**
 * Endpoint webhook untuk menangani pesan masuk dari WhatsApp.
 * Mengelola sesi pengguna, merespon pesan berdasarkan input pengguna, dan mengirim pesan balik ke pengguna.
 *
 * @async
 * @function
 * @name /webhook
 * 
 * @param {Object} req - Objek permintaan dari Express, berisi pesan yang diterima dari webhook.
 * @param {Object} res - Objek respons dari Express.
 *
 * @example
 * app.post("/webhook", async (req, res) => { ... });
 *
 * @returns {void}
 */
app.post("/webhook", signatureRequired, async (req, res) => {
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  const statuses = req.body.entry?.[0]?.changes[0]?.value?.statuses?.[0];
  const businessPhoneNumberId = req.body.entry?.[0].changes?.[0]?.value?.metadata?.phone_number_id;
  const messageTimestamp = message?.timestamp;
  const userId = message?.from || statuses?.recipient_id;


  console.log("messageTimestamp : ", messageTimestamp);
  console.log("serverOnlineTime : ", serverOnlineTime);
  console.log("MESSAGE : ", message);
  console.log("USERDID : ", userId);
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  if (message?.type === "text") {
    const userMessage = message.text.body.trim().toLowerCase();
    if (messageTimestamp < serverOnlineTime) {
      const offlineMessage = 'Bot telah kembali!';
      await sendWhatsAppMessage(businessPhoneNumberId, userId, offlineMessage);
      await sendWhatsAppMessage(businessPhoneNumberId, userId, homeMessage);
      sessionStatus[userId] = { lastActive: Date.now(), option: null, businessPhoneNumberId: businessPhoneNumberId };
    }
    else if (userMessage === "0" || !(userId in sessionStatus)) {
      // Pengguna baru atau meminta kembali ke menu awal
      sessionStatus[userId] = { lastActive: Date.now(), option: null, businessPhoneNumberId: businessPhoneNumberId };
      await sendWhatsAppMessage(businessPhoneNumberId, userId, homeMessage);
    } else {
      const { option } = sessionStatus[userId];
      let responseText = "";
      if (option === null) {
        // Menetapkan opsi berdasarkan input pengguna
        if (validOptions.includes(userMessage)) {
          sessionStatus[userId].option = userMessage;
          switch (userMessage) {
            case "1":
              responseText = "Kirim Pertanyaan Seputar Statistik Boyolali:\n\nKetik 0 untuk kembali ke menu awal.";
              break;
            case "2":
              responseText = "Kirim Pertanyaan Seputar Statistik Secara Umum:\n\nKetik 0 untuk kembali ke menu awal.";
              break;
            case "3":
              responseText = "Kirim Pertanyaan Untuk AI:\n\nKetik 0 untuk kembali ke menu awal.";
              break;
            case "4":
              responseText = "Tunggu Beberapa Saat, Kami Sedang Menghubungi Pegawai Yang Bertugas\n\nKetik 0 untuk kembali ke menu awal.";
              break;
          }
        } else {
          responseText = "Mohon Maaf. Silahkan Pilih Opsi Berikut Untuk Melanjutkan.\n\nKetik 1 untuk bertanya statistik Boyolali\nKetik 2 untuk bertanya statistik secara umum\nKetik 3 untuk bertanya AI.\n\nJika masih ada pertanyaan silahkan kirim email ke: bps3309@bps.go.id atau kunjungi https://boyolalikab.bps.go.id/\n\n📷 [Instagram](https://www.instagram.com/bpskabboyolali/)\n🎥 [YouTube](https://www.youtube.com/@BPSKabupatenBoyolali)";
        }
      } else if (validOptions.includes(option)) {
        // Menangani opsi yang valid
        switch (option) {
          case "1":
            responseText = await handleStatBoy(userMessage);
            break;
          case "2":
            responseText = await handleStatGen(userMessage);
            break;
          case "3":
            responseText = await handleGeminiResponse(userMessage);
            break;
          case "4":
            responseText = await handlePSTResponse(userMessage);
            break;
        }
      } else {
        responseText = "Mohon Maaf. Silahkan Pilih Opsi Berikut Untuk Melanjutkan.\n\nKetik 1 untuk bertanya statistik Boyolali\nKetik 2 untuk bertanya statistik secara umum\nKetik 3 untuk bertanya AI.\n\nJika masih ada pertanyaan silahkan kirim email ke: bps3309@bps.go.id atau kunjungi https://boyolalikab.bps.go.id/\n\n📷 [Instagram](https://www.instagram.com/bpskabboyolali/)\n🎥 [YouTube](https://www.youtube.com/@BPSKabupatenBoyolali)";
        sessionStatus[userId].option = null; // Reset session jika opsi tidak valid
      }

      await sendWhatsAppMessage(businessPhoneNumberId, userId, responseText);
    }
  }
  else if ((message?.type)) {
    console.log("TIPE PESAN : ", message.type);
    const responseText = "Mohon Maaf. Kami Hanya Mendukung percakapan berbasis teks.\n\nKetik 1 untuk bertanya statistik Boyolali\nKetik 2 untuk bertanya statistik secara umum\nKetik 3 untuk bertanya AI.\n\nJika masih ada pertanyaan silahkan kirim email ke: bps3309@bps.go.id atau kunjungi https://boyolalikab.bps.go.id/\n\n📷 Instagram : https://www.instagram.com/bpskabboyolali/\n🎥 YouTube : https://www.youtube.com/@BPSKabupatenBoyolali";
    sessionStatus[userId] = { lastActive: Date.now(), option: null, businessPhoneNumberId: businessPhoneNumberId };
    await sendWhatsAppMessage(businessPhoneNumberId, userId, responseText);
  }
  res.sendStatus(200);
});



/**
 * Endpoint untuk verifikasi webhook dari WhatsApp.
 * Memverifikasi token dan mode yang dikirim oleh WhatsApp untuk memastikan keabsahan webhook.
 *
 * @function
 * @name /webhook
 *
 * @param {Object} req - Objek permintaan dari Express, berisi parameter query untuk verifikasi.
 * @param {Object} res - Objek respons dari Express.
 *
 * @example
 * app.get('/webhook', (req, res) => { ... });
 *
 * @returns {void}
 */
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  console.log(`mode: ${mode}`);
  console.log(`token: ${token}`);
  console.log(`challenge: ${challenge}`);

  if (mode && token) {
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verification successful');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  const date = new Date(); // Current date and time
  const unixTimestampInSeconds = Math.floor(date.getTime() / 1000);
  serverOnlineTime = unixTimestampInSeconds;
  console.log(`Server Online Time: ${serverOnlineTime}`);
  console.log(`Server is listening on port: ${PORT}`);
  console.log(`WEBHOOK_VERIFY_TOKEN: ${WEBHOOK_VERIFY_TOKEN}`);
});