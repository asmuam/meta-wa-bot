// pegawaisHandler.js
import dotenv from 'dotenv';
import axios from 'axios';
import { backToMenu } from "./const.js";
dotenv.config();

async function sendMessageToPegawai(businessPhoneNumberId, pegawaiNumber, userPrompt) {
  const API_URL = `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/messages`;
  const ACCESS_TOKEN = process.env.GRAPH_API_TOKEN;
  const messagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: pegawaiNumber,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: userPrompt
      },
      footer: {
        text: 'Pilih salah satu opsi di bawah'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'tanggapi-button',
              title: 'Tanggapi'
            }
          }
        ]
      }
    }
  };

  try {
    const response = await axios.post(API_URL, messagePayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function pegawaiBroadcast(businessPhoneNumberId, availablePegawai, userMessage) {
  // kirim broadcast ke semua pegawai
  for (const number of availablePegawai) {
    try {
      // Misalkan menggunakan API untuk mengirim pesan
      await sendMessageToPegawai(businessPhoneNumberId, number, userMessage)
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