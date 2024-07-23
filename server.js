/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { handleStatBoy, handleStatGen } from "./statsHandlers.js";
import { handleGeminiResponse } from "./aiHandlers.js";
import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

const homeMessage = `Selamat Datang di BPS Boyolali Bot\n\nKetik 1 untuk bertanya statistik Boyolali\nKetik 2 untuk bertanya statistik secara umum\nKetik 3 untuk bertanya AI\n\n📷 Instagram : https://www.instagram.com/bpskabboyolali/\n🎥 YouTube : https://www.youtube.com/@BPSKabupatenBoyolali`;

const sessionStatus = {};

const validOptions = ["1", "2", "3"];  // Daftar nilai yang valid

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
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.response.data);
  }
}

async function handleSessionExpiration(business_phone_number_id, recipient) {
  delete sessionStatus[recipient];
  const sessionExpiredMessage = "Sesi Anda telah berakhir. Silahkan kirim pesan lagi untuk memulai sesi baru.";
  await sendWhatsAppMessage(business_phone_number_id, recipient, sessionExpiredMessage);
}

function checkSessionExpiration() {
  const currentTime = Date.now();
  for (const recipient in sessionStatus) {
    if ((currentTime - sessionStatus[recipient].lastActive) > 180000) {
      handleSessionExpiration(sessionStatus[recipient].businessPhoneNumberId, recipient);
    }
  }
}

setInterval(checkSessionExpiration, 60000);

app.post("/webhook", async (req, res) => {
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text") {
      const businessPhoneNumberId = req.body.entry?.[0].changes?.[0]?.value?.metadata?.phone_number_id;
      const userMessage = message.text.body.trim().toLowerCase();
      const userId = message.from;

      if (userMessage === "0" || !(userId in sessionStatus)) {
          // User is either new or requested to go back to home
          sessionStatus[userId] = { lastActive: Date.now(), option: null };
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
              }
          } else {
              responseText = "Mohon Maaf. Silahkan Pilih Opsi Berikut Untuk Melanjutkan.\n\nKetik 1 untuk bertanya statistik Boyolali\nKetik 2 untuk bertanya statistik secara umum\nKetik 3 untuk bertanya AI.\n\nJika masih ada pertanyaan silahkan kirim email ke: bps3309@bps.go.id atau kunjungi https://boyolalikab.bps.go.id/\n\n📷 [Instagram](https://www.instagram.com/bpskabboyolali/)\n🎥 [YouTube](https://www.youtube.com/@BPSKabupatenBoyolali)";
              sessionStatus[userId].option = null; // Reset session if invalid option
          }

          await sendWhatsAppMessage(businessPhoneNumberId, userId, responseText);
      }
  }
  res.sendStatus(200);
});



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
  console.log(`Server is listening on port: ${PORT}`);
  console.log(`WEBHOOK_VERIFY_TOKEN: ${WEBHOOK_VERIFY_TOKEN}`);
});