// pegawaisHandler.js
import dotenv from 'dotenv';
import axios from 'axios';
import { backToMenu } from "./const.js";

const API_URL = 'https://graph.facebook.com/v20.0/106540352242922/messages';
const ACCESS_TOKEN = process.env.GRAPH_API_TOKEN;

async function sendMessageToPegawai(pegawaiNumber, userPrompt) {
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
          },
          {
            type: 'reply',
            reply: {
              id: 'abaikan-button',
              title: 'Abaikan'
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

export async function pegawaiConnect(availablePegawai, sessionStatus, userPhoneNumber) {
  // Misalnya, pilih pegawai pertama dari availablePegawai
  const pegawai = availablePegawai[0]; // Ini adalah objek pegawai pertama dari array

  if (!availablePegawai) {
    return { responsePegawai: "Tidak ada pegawai yang tersedia", pegawaiPhoneNumber: null };
  }

  // Mengembalikan respons yang menyertakan nama dan nomor pegawai
  return {
    responsePegawai: `Anda Telah Terhubung Dengan Admin ${pegawai.name}` + backToMenu, // Template literal
    pegawaiPhoneNumber: pegawai.number
  };
}

export function handlePSTResponse(){

}