// pegawaisHandler.js
import dotenv from 'dotenv';
import axios from 'axios';
import { backToMenu, broadcastPegawai, noAvailablePegawai } from "./const.js";
import { GRAPH_API_TOKEN } from './const.js';
dotenv.config();

export async function sendMessageToPegawai(businessPhoneNumberId, pegawaiNumber, userMessage, userPhoneNumber) {
  let data;
  if (userMessage == "4") {
    userMessage = broadcastPegawai
    data = {
      messaging_product: "whatsapp",
      to: pegawaiNumber,
      type: 'interactive',
      interactive: {
        header: {
          type: 'text',
          text:
            "TANGGAPI SESI TANYA JAWAB?"
        },
        type: 'button',
        body: {
          text: userMessage
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: `respond_${userPhoneNumber}`,
                title: 'Mulai Sesi!'
              }
            }
          ]
        }
      }
    };
  } else {
    data = {
      messaging_product: "whatsapp",
      to: pegawaiNumber,
      text: { body: userMessage }, // Correct structure for text messages
    };
  }

  const url = `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/messages`;
  const headers = {
    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    "Content-Type": "application/json",
  };


  try {
    const response = await axios.post(url, data, { headers });
    console.log("Message sent successfully:");
  } catch (error) {
    console.error("Error sending message:");
    console.error(`Recipient: ${pegawaiNumber}`);
    console.error(`Message: ${userMessage}`);
    console.error("Error details:", error.response.data);
  }
}


export async function pegawaiBroadcast(businessPhoneNumberId, availablePegawai, userMessage, userPhoneNumber) {
  if (availablePegawai && availablePegawai.length > 0){
    console.log("AVAILABLE PEGAWAI == ",availablePegawai);
      // kirim broadcast ke semua pegawai
  for (const number of availablePegawai) {
    try {
      await sendMessageToPegawai(businessPhoneNumberId, number, userMessage, userPhoneNumber)
      console.log(`Pesan terkirim ke ${number}`);
    } catch (error) {
      console.error(`Gagal mengirim pesan ke ${number}:`, error);
      return false
    }
  }
  return true
  } else {
    return false
  }
}

export function handlePSTResponse() {

}
