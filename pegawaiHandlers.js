// pegawaisHandler.js
import dotenv from 'dotenv';
import axios from 'axios';
import { backToMenu, broadcastPegawai } from "./const.js";
import { GRAPH_API_TOKEN } from './const.js';
dotenv.config();

async function sendMessageToPegawai(businessPhoneNumberId, pegawaiNumber, userMessage, userPhoneNumber) {
  let uniqueId = userPhoneNumber
  if (userMessage=="4") {
    userMessage = broadcastPegawai    
  }
  const url = `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/messages`;
  const headers = {
    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    "Content-Type": "application/json",
  };
  const data = {
    messaging_product: "whatsapp",
    to: pegawaiNumber,
    type: 'interactive',
    interactive: {
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
  // kirim broadcast ke semua pegawai
  for (const number of availablePegawai) {
    try {
      // Misalkan menggunakan API untuk mengirim pesan
      await sendMessageToPegawai(businessPhoneNumberId, number, userMessage, userPhoneNumber)
      console.log(`Pesan terkirim ke ${number}`);
    } catch (error) {
      console.error(`Gagal mengirim pesan ke ${number}:`, error);
    }
  }
  return 
}

export function handlePSTResponse(){

}

export function pegawaiConnect(){

}