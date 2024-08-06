import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
export const APP = express();

const WELCOME_MESSAGE = `Selamat datang di BPS Boyolali bot
https://boyolalikab.bps.go.id/`;
const MENU_MESSAGE = `
\nKetik *1* untuk Statistik Boyolali
Ketik *2* untuk tanya AI
Ketik *3* untuk tanya CS\n
📷 *Instagram* : https://www.instagram.com/bpskabboyolali/
🎥 *YouTube* : https://www.youtube.com/@BPSKabupatenBoyolali
`;

export const UNSUPPORTED_TYPE_MESSAGE = "Mohon maaf. Kami hanya mendukung percakapan berbasis teks.";
export const HOME_MESSAGE = WELCOME_MESSAGE + MENU_MESSAGE;
export const BACK_ONLINE = 'Bot telah kembali!';
export const WRONG_COMMAND = "Mohon maaf. Silahkan pilih opsi berikut untuk melanjutkan\n\n";
export const BACK_TO_MENU = "\n\nKetik 0 untuk kembali ke menu utama.";
export const OPTION_ONE = "Kirim pertanyaan seputar statistik Boyolali: ";
export const OPTION_TWO = "Kirim pertanyaan seputar statistik secara umum: ";
export const OPTION_THREE = "Kirim pertanyaan untuk AI: ";
export const OPTION_FOUR = "Tunggu beberapa saat, kami sedang menghubungi pegawai yang bertugas.";

export const VALID_OPTIONS = ["1", "2", "3"];
export const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, BOT_NUMBER, BOT_NAME } = process.env;

/** OBJEK UNTUK MELACAK STATUS SESI PENGGUNA
 * SESSION_STATUS[USER_PHONE_NUMBER]={CLIENT:CLIENT, LAST_ACTIVE: DATE, OPTION_SESSION: NULL, BUSINESS_PHONE_NUMBER_ID: REQUIRED, PEGAWAI_PHONE_NUMBER: NULL}
 */
export const SESSION_STATUS = {};

// DAFTAR NOMOR PEGAWAI
const PEGAWAI_NUMBER_JSON = process.env.PEGAWAI_NUMBER;
export const PEGAWAI_NUMBERS = JSON.parse(PEGAWAI_NUMBER_JSON);
export const BROADCAST_PEGAWAI =
    `Terdapat responden yang meminta asistensi!\n\n
Klik *Mulai Sesi!* untuk memulai sesi`;

export const CONNECTED_WITH_PEGAWAI =
    "Anda telah terhubung dengan admin!~";

export const SESSION_LIMIT = 180000; // 3 menit (milisekon)

export const NO_AVAILABLE_PEGAWAI = "Maaf, saat ini tidak ada pegawai yang tersedia. Coba beberapa saat lagi.\n\n";
export const SESSION_QNA_EXPIRED_MESSAGE = "Sesi QNA telah ditutup.";
export const SESSION_EXPIRED_MESSAGE = "Sesi anda telah berakhir. Silahkan kirim pesan lagi untuk memulai sesi baru.";
export const MAX_MESSAGES_PER_MINUTE = 30; // Set the maximum number of messages allowed per minute
export const SPAM_THRESHOLD = 1; // Set the number of warnings before blocking

export const BOT_ERROR = "Maaf, bot sedang bermasalah. Kami sedang berupaya sebaik mungkin.";
export const DISCLAIMER_AI = `
\n*Disclaimer*: Jawaban ini dihasilkan oleh AI Gemini sehingga terdapat kemungkinan untuk salah.\n\n
Kunjungi https://boyolalikab.bps.go.id/ untuk mencari informasi yang lebih tepat`

export const JENIS_STATISTIK = `
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis`
export const MENU_STRUCTURE = {
    "0": { // Home menu
        message: HOME_MESSAGE,
        options: {
            "1": "Statistik Boyolali",
            "2": "Tanya AI",
            "3": "Tanya CS"
        }
    },
    "1": { // Submenu for option 1
        message: `*Pilih Menu yang Sesuai!*\n
        1. Sosial dan Kependudukan
        2. Ekonomi dan Perdagangan
        3. Pertanian dan Pertambangan
        99. Back`,
        options: {
            "1.1": "Sosial dan Kependudukan",
            "1.2": "Ekonomi dan Perdagangan",
            "1.3": "Pertanian dan Pertambangan",
            "1.99": "Back"
        }
    },
    "1.1": {
        message: `*Statistik Sosial dan Kependudukan mana yang Anda cari*\n
    1. Agama
    2. Gender
    3. Geografi
    4. Iklim
    5. Indeks Pembangunan Manusia
    6. Kemiskinan
    7. Kependudukan
    8. Kesehatan
    9. Konsumsi dan Pengeluaran
    10. Pemerintahan
    11. Pendidikan
    12. Perumahan
    13. Politik dan Keamanan
    14. Sosial Budaya
    15. Tenaga Kerja
    99. Back`,
        options: {
            "1.1.1": "Agama",
            "1.1.2": "Gender",
            "1.1.3": "Geografi",
            "1.1.4": "Iklim",
            "1.1.5": "Indeks Pembangunan Manusia",
            "1.1.6": "Kemiskinan",
            "1.1.7": "Kependudukan",
            "1.1.8": "Kesehatan",
            "1.1.9": "Konsumsi dan Pengeluaran",
            "1.1.10": "Pemerintahan",
            "1.1.11": "Pendidikan",
            "1.1.12": "Perumahan",
            "1.1.13": "Politik dan Keamanan",
            "1.1.14": "Sosial Budaya",
            "1.1.15": "Tenaga Kerja",
            "1.1.99": "Back"
        }
    },
    "1.1.1": {
        message: `*Statistik Agama mana yang Anda cari*\n${JENIS_STATISTIK}
    99. Back`,
        options: {
            "1.1.1.1": "Tabel/Indikator",
            "1.1.1.2": "Publikasi",
            "1.1.1.3": "Tabel Dinamis",
            "1.1.1.99": "Back"
        }
    },
    "1.1.1.1": {
        message: `Silahkan Kunjungi https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab3
        99. Back`,
        options: {
            "1.1.1.1.99": "Back"
        }
    },
    "1.1.1.2": {
        message: `Silahkan Kunjungi https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab4
        99. Back`,
        options: {
            "1.1.1.2.99": "Back"
        }
    },
    "1.1.1.3": {
        message: `Silahkan Kunjungi https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab5
        99. Back`,
        options: {
            "1.1.1.3.99": "Back"
        }    },
    "1.1.2": {
        message: `*Statistik Gender mana yang Anda cari*\n${JENIS_STATISTIK}
    ${JENIS_STATISTIK}
    99. Back`,
        options: {
            "1.1.2.1": "Tabel/Indikator",
            "1.1.2.2": "Publikasi",
            "1.1.2.3": "Tabel Dinamis",
            "1.1.2.99": "Back"
        }
    },
    "1.1.3": {
        message: `*Statistik Geografi mana yang Anda cari*\n${JENIS_STATISTIK}
    ${JENIS_STATISTIK}
    99. Back`,
        options: {
            "1.1.3.1": "Tabel/Indikator",
            "1.1.3.2": "Publikasi",
            "1.1.3.3": "Tabel Dinamis",
            "1.1.3.99": "Back"
        }
    },
    // Tambahkan subkategori lainnya dengan pola yang sama
    "1.1.4": {
        message: `*Statistik Iklim mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.4.1": "Tabel/Indikator",
            "1.1.4.2": "Publikasi",
            "1.1.4.3": "Tabel Dinamis",
            "1.1.4.99": "Back"
        }
    },
    "1.1.5": {
        message: `*Statistik Indeks Pembangunan Manusia mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.5.1": "Tabel/Indikator",
            "1.1.5.2": "Publikasi",
            "1.1.5.3": "Tabel Dinamis",
            "1.1.5.99": "Back"
        }
    },
    "1.1.6": {
        message: `*Statistik Kemiskinan mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.6.1": "Tabel/Indikator",
            "1.1.6.2": "Publikasi",
            "1.1.6.3": "Tabel Dinamis",
            "1.1.6.99": "Back"
        }
    },
    "1.1.7": {
        message: `*Statistik Kependudukan mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.7.1": "Tabel/Indikator",
            "1.1.7.2": "Publikasi",
            "1.1.7.3": "Tabel Dinamis",
            "1.1.7.99": "Back"
        }
    },
    "1.1.8": {
        message: `*Statistik Kesehatan mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.8.1": "Tabel/Indikator",
            "1.1.8.2": "Publikasi",
            "1.1.8.3": "Tabel Dinamis",
            "1.1.8.99": "Back"
        }
    },
    "1.1.9": {
        message: `*Statistik Konsumsi dan Pengeluaran mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.9.1": "Tabel/Indikator",
            "1.1.9.2": "Publikasi",
            "1.1.9.3": "Tabel Dinamis",
            "1.1.9.99": "Back"
        }
    },
    "1.1.10": {
        message: `*Statistik Pemerintahan mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.10.1": "Tabel/Indikator",
            "1.1.10.2": "Publikasi",
            "1.1.10.3": "Tabel Dinamis",
            "1.1.10.99": "Back"
        }
    },
    "1.1.11": {
        message: `*Statistik Pendidikan mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.11.1": "Tabel/Indikator",
            "1.1.11.2": "Publikasi",
            "1.1.11.3": "Tabel Dinamis",
            "1.1.11.99": "Back"
        }
    },
    "1.1.12": {
        message: `*Statistik Perumahan mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.12.1": "Tabel/Indikator",
            "1.1.12.2": "Publikasi",
            "1.1.12.3": "Tabel Dinamis",
            "1.1.12.99": "Back"
        }
    },
    "1.1.13": {
        message: `*Statistik Politik dan Keamanan mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.13.1": "Tabel/Indikator",
            "1.1.13.2": "Publikasi",
            "1.1.13.3": "Tabel Dinamis",
            "1.1.13.99": "Back"
        }
    },
    "1.1.14": {
        message: `*Statistik Sosial Budaya mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.14.1": "Tabel/Indikator",
            "1.1.14.2": "Publikasi",
            "1.1.14.3": "Tabel Dinamis",
            "1.1.14.99": "Back"
        }
    },
    "1.1.15": {
        message: `*Statistik Tenaga Kerja mana yang Anda cari*\n${JENIS_STATISTIK}
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    99. Back`,
        options: {
            "1.1.15.1": "Tabel/Indikator",
            "1.1.15.2": "Publikasi",
            "1.1.15.3": "Tabel Dinamis",
            "1.1.15.99": "Back"
        }
    },
    "1.2": {
        message: `*Statistik Ekonomi dan Perdagangan mana yang Anda cari*\n
        1. Energi
        2. Hotel dan Pariwisata
        3. Indeks Harga Konsumen
        99. Back`,
        options: {
            "1.2.1": "Energi",
            "1.2.2": "Hotel dan Pariwisata",
            "1.2.3": "Indeks Harga Konsumen",
            "1.2.99": "Back"
        }
    },
    "1.3": {
        message: `*Statistik Pertanian dan Pertambangan mana yang Anda cari*\n
        1. Hortikultura
        2. Kehutanan
        3. Perikanan
        99. Back`,
        options: {
            "1.3.1": "Hortikultura",
            "1.3.2": "Kehutanan",
            "1.3.3": "Perikanan",
            "1.3.99": "Back"
        }
    },
    // Add more submenus here
};