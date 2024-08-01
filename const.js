import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
export const app = express();
const welcomeMessage = 
"Selamat Datang di BPS Boyolali Bot"
const menuMessage = 
"\n\nKetik *1* untuk bertanya statistik Boyolali\n"+
"Ketik *2* untuk bertanya statistik secara umum\n"+
"Ketik *3* untuk bertanya AI\n"+
"Ketik *4* untuk bertanya dengan CS\n\n"+
"📷 *Instagram* : https://www.instagram.com/bpskabboyolali/\n"+
"🎥 *YouTube* : https://www.youtube.com/@BPSKabupatenBoyolali"
export const unsupportedType = "Mohon Maaf. Kami Hanya Mendukung percakapan berbasis teks."
export const homeMessage = welcomeMessage+menuMessage 
export const backOnline = 'Bot telah kembali!';
export const wrongCommand = "Mohon Maaf. Silahkan Pilih Opsi Berikut Untuk Melanjutkan\n\n"
export const backToMenu = "\n\nKetik 0 untuk kembali ke menu awal."
export const optionOne = "Kirim Pertanyaan Seputar Statistik Boyolali: "
export const optionTwo = "Kirim Pertanyaan Seputar Statistik Secara Umum: "
export const optionThree = "Kirim Pertanyaan Untuk AI: "
export const optionfour = "Tunggu Beberapa Saat, Kami Sedang Menghubungi Pegawai Yang Bertugas."
export const validOptions = ["0", "1", "2", "3", "4"];
export const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, PINECONE_API_KEY } = process.env;

/** Objek untuk melacak status sesi pengguna
 * sessionStatus[userPhoneNumber]={lastActive: Date, optionSession: null, businessPhoneNumberId: required, pegawaiPhoneNumber: null}
 */
export const sessionStatus = {};

// daftar nomor pegawai
const PEGAWAI_NUMBER_JSON = process.env.PEGAWAI_NUMBER;
export const PEGAWAI_NUMBERS = JSON.parse(PEGAWAI_NUMBER_JSON);
export const broadcastPegawai = 
"Terdapat Responden yang meminta Asistensi!\n\n"+
"Klik *Mulai Sesi!* untuk memulai sesi"

export const connectedWithPegawai = 
"Anda Telah Terhubung Dengan Admin!~"

export const SESSION_LIMIT = 180000 // 3 menit (milisecond)

export const noAvailablePegawai = "Maaf, saat ini tidak ada pegawai yang tersedia. Coba beberapa saat lagi"