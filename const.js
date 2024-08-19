import express from 'express';
import 'dotenv/config';
export const APP = express();
import { config } from 'dotenv';
config(); // Ini memuat variabel lingkungan dari file .env

/** Note
 * this constant is defined using backticks (`) for each string, 
 * which allows for multiline text formatting. This method ensures that the line breaks and spacing in the strings are preserved 
 * exactly as intended when the menu is displayed to users.
 *  */
const WELCOME_MESSAGE = `Hallo Sahabat Data!!
Saya YANTI (Layanan Statistik Boyolali), Asisten Digital BPS Kabupaten Boyolali yang siap membantu kamu.

Silahkan *PILIH MENU* layanan yang #SahabatData butuhkan dengan *KETIK ANGKA* yang sesuai:
`;
export const FOOTER = `
🌐 *Website*   : https://boyolalikab.bps.go.id/
📷 *Instagram* : https://www.instagram.com/bpskabboyolali/
🎥 *YouTube*   : https://www.youtube.com/@BPSKabupatenBoyolali
`;
//Ketik *3* untuk tanya CS

export const UNSUPPORTED_TYPE_MESSAGE = `Mohon maaf. Kami hanya mendukung percakapan berbasis teks.`;
export const BACK_ONLINE = 'Bot telah kembali!';
export const WRONG_COMMAND = `Mohon maaf. Silahkan pilih opsi berikut untuk melanjutkan\n\n`;
export const BACK_TO_MENU = `\n\nKetik 0 untuk kembali ke menu utama.`;
export const OPTION_ONE = `Kirim pertanyaan seputar statistik Boyolali: `;
export const OPTION_TWO = `Kirim pertanyaan seputar statistik secara umum: `;
export const OPTION_AI = `Kirim pertanyaan untuk AI: `;
export const OPTION_FOUR = `Tunggu beberapa saat, kami sedang menghubungi pegawai yang bertugas.`;
export const NOT_IN_WORKING_HOURS = `Maaf, Admin hanya menjawab di Jam Kerja 08.00--15.30 WIB`
export const VALID_OPTIONS = Array.from({ length: 6 }, (_, i) => (i + 1).toString());

export const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, BOT_NUMBER, BOT_NAME, PEGAWAI_NUMBER } = process.env;

/** OBJEK UNTUK MELACAK STATUS SESI PENGGUNA
 * SESSION_STATUS[USER_PHONE_NUMBER]={CLIENT:CLIENT, LAST_ACTIVE: DATE, OPTION_SESSION: NULL, BUSINESS_PHONE_NUMBER_ID: REQUIRED, PEGAWAI_PHONE_NUMBER: NULL}
 */
export const SESSION_STATUS = {};

// DAFTAR NOMOR PEGAWAI
const PEGAWAI_NUMBER_JSON = process.env.PEGAWAI_NUMBER;
export const PEGAWAI_NUMBERS = JSON.parse(PEGAWAI_NUMBER_JSON);
export const BROADCAST_PEGAWAI =
    `Terdapat responden yang meminta asistensi!
    Klik *Mulai Sesi!* untuk memulai sesi`;

export const CONNECTED_WITH_PEGAWAI =
    `Anda telah terhubung dengan admin!~`;

export const SESSION_LIMIT = 360000; // 3 menit (milisekon)

export const NO_AVAILABLE_PEGAWAI = `Maaf, saat ini tidak ada pegawai yang tersedia. Coba beberapa saat lagi.`;
export const SESSION_QNA_EXPIRED_MESSAGE = `Sesi QNA telah ditutup.`;
export const SESSION_EXPIRED_MESSAGE = `Sesi anda telah berakhir. Silahkan kirim pesan lagi untuk memulai sesi baru.`;
export const MAX_MESSAGES_PER_MINUTE = 15; // Set the maximum number of messages allowed per minute
export const SPAM_THRESHOLD = 2; // Set the number of warnings before blocking

export const BOT_ERROR = `Maaf, bot sedang bermasalah. Kami sedang berupaya sebaik mungkin.`;
export const DISCLAIMER_AI =
`
*Disclaimer*: Jawaban ini dihasilkan oleh AI Gemini sehingga terdapat kemungkinan untuk salah.
SIlahkan Kirim Kritik dan Saran untuk pengembangan Asisten Digital yang lebih baik
Kunjungi https://boyolalikab.bps.go.id/ untuk mencari informasi yang lebih tepat`

const JENIS_STATISTIK =
    `
    1. Tabel/Indikator
    2. Publikasi
    3. Tabel Dinamis
    `
export const HOME_MESSAGE = `${WELCOME_MESSAGE}
    1. Data Perpustakaan
    2. Konsultasi Statistik
    3. Penjualan Produk Statistik
    4. Rekomendasi Statistik
    5. Layanan Pengaduan
    6. Chat dengan Asisten Digital
    `;

// cat 1 == Sosial dan Kependudukan, cat 2 Ekonomi dan Perdagangan, cat 3 Pertanian dan Pertambangan
export const statisticData = [
    { cat: 1, id: 155, value: 'Agama' },
    { cat: 1, id: 40, value: 'Gender' },
    { cat: 1, id: 153, value: 'Geografi' },
    { cat: 1, id: 151, value: 'Iklim' },
    { cat: 1, id: 26, value: 'Indeks-Pembangunan-Panusia' },
    { cat: 1, id: 23, value: 'Kemiskinan' },
    { cat: 1, id: 12, value: 'Kependudukan' },
    { cat: 1, id: 30, value: 'Kesehatan' },
    { cat: 1, id: 5, value: 'Konsumsi-dan-Pengeluaran' },
    { cat: 1, id: 101, value: 'Pemerintahan' },
    { cat: 1, id: 28, value: 'Pendidikan' },
    { cat: 1, id: 29, value: 'Perumahan' },
    { cat: 1, id: 154, value: 'Politik-dan-Keamanan' },
    { cat: 1, id: 27, value: 'Sosial-Budaya' },
    { cat: 1, id: 6, value: 'Tenaga-Kerja' },
    { cat: 2, id: 7, value: 'Energi' },
    { cat: 2, id: 16, value: 'Hotel-dan-Pariwisata' },
    { cat: 2, id: 157, value: 'Indeks-Harga-Konsumen' },
    { cat: 2, id: 9, value: 'Industri' },
    { cat: 2, id: 3, value: 'Inflasi' },
    { cat: 2, id: 13, value: 'Keuangan' },
    { cat: 2, id: 2, value: 'Komunikasi' },
    { cat: 2, id: 4, value: 'Konstruksi' },
    { cat: 2, id: 22, value: 'Nilai-Tukar-Petani' },
    { cat: 2, id: 158, value: 'Perdagangan' },
    { cat: 2, id: 11, value: 'Produk-Domestik-Regional-Bruto-Lapangan-Usaha' },
    { cat: 2, id: 156, value: 'Produk-Domestik-Regional-Bruto-Pengeluaran' },
    { cat: 2, id: 17, value: 'Transportasi' },
    { cat: 2, id: 19, value: 'Upah-Buruh' },
    { cat: 2, id: 35, value: 'Usaha-Mikro-Kecil' },
    { cat: 3, id: 55, value: 'Hortikultura' },
    { cat: 3, id: 60, value: 'Kehutanan' },
    { cat: 3, id: 56, value: 'Perikanan' },
    { cat: 3, id: 54, value: 'Perkebunan' },
    { cat: 3, id: 24, value: 'Peternakan' },
    { cat: 3, id: 53, value: 'Tanaman-Pangan' }
];

const BASE_URL = 'https://boyolalikab.bps.go.id/subject';

function buildMenuFromData(statisticData) {
    const menu = {
        "0": { message: HOME_MESSAGE + FOOTER, options: ["Data Perpustakaan", "Konsultasi Statistik", "Penjualan Produk Statistik", "Rekomendasi Statistik", "Layanan Pengaduan"] 
        },
        "1": { 
            message: `Ketik Angka yang Sesuai`, 
            options: ["1. Publikasi", "2. Data dalam tabel", "3. Berita dan Informasi Statistik", "4. Infografis", "5. Berita Resmi Statistik", "6. Layanan Data Lainnya", "7. Chat dengan Admin (Chat admin dilayani pada hari kerja jam 08.00--15.30 WIB)"] 
        },
        "1.1": { 
            message: `Silahkan Kunjungi Link Berikut untuk Melihat Publikasi dari BPS Boyolali\nhttps://boyolalikab.bps.go.id/publication.html`, 
            options: []
        },
        "1.2": {
            message: 
            `Pilih Kategori Data dalam tabel:`,
            options: ["1. Sosial dan Kependudukan", "2. Ekonomi dan Perdagangan", "3. Pertanian dan Pertambangan"]
        },
        "1.3": { 
            message: `Silahkan Kunjungi Link Berikut untuk Melihat Berita dan Informasi Statistik dari BPS Boyolali\nhttps://boyolalikab.bps.go.id/news.html`,
            options: []
        },
        "1.4": { 
            message: `Silahkan Kunjungi Link Berikut untuk Melihat Infografis dari BPS Boyolali\nhttps://boyolalikab.bps.go.id/galery.html`,
            options: []
        },
        "1.5": { 
            message: `Silahkan Kunjungi Link Berikut untuk Melihat Berita Resmi Statistik dari BPS Boyolali\nhttps://boyolalikab.bps.go.id/pressrelease.html`,
            options: []
        },
        "1.6": { 
            message: `Silahkan Mengisi Form berikut untuk Layanan Data Lainnya\nhttps://forms.gle/noguqNvGLCD38edp8`,
            options: []
        },
        "1.7": { 
            message: `Silahkan Kirim Pertanyaan Anda dan Tunggu hingga Admin menjawab`,
            options: []
        },
        "2": {
            message: `Silahkan Mengisi Form dibawah untuk Konsultasi Statistik\nhttps://forms.gle/mbPbncAHuKYL3xLA6`,
            options: []
        },
        "3": {
            message: `Silahkan Kunjungi Website Silastik untuk Penjualan Produk Statistik\nhttps://silastik.bps.go.id`,
            options: []
        },
        "4": {
            message: `Silahkan Mengunjungi Website romantik untuk Rekomendasi Statistik\nhttps://romantik.web.bps.go.id/`,
            options: []
        },
        "5": {
            message: `Silahkan Mengunjungi link dibawah untuk Mengakses Layanan Pengaduan \nhttp://s.bps.go.id/pengaduanboyolali`,
            options: []
        }
    };

    // Build top-level categories
    const categories = {
        1: "Sosial dan Kependudukan",
        2: "Ekonomi dan Perdagangan",
        3: "Pertanian dan Pertambangan"
    };

    function formatStatisticValue(value) {
        return value
            .replace(/-/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());
    }
    
    // Map each category to its submenus
    Object.entries(categories).forEach(([cat, label]) => {
        const submenus = statisticData.filter(item => item.cat == cat);

        menu[`1.2.${cat}`] = {
            message: `Pilih Subjek Satistik ${label}:`,
            options: submenus.map((item, index) => `${index + 1}. ${item.value}`)
        };

        submenus.forEach((item, index) => {
            menu[`1.2.${cat}.${index + 1}`] = {
                message: `Statistik ${formatStatisticValue(item.value)} mana yang Anda cari?`,
                options: ["Tabel/Indikator", "Publikasi", "Tabel Dinamis"].map((option, i) => `${i + 1}. ${option}`)
            };

            // Generate links for detail views
            for (let i = 1; i <= 3; i++) {
                menu[`1.2.${cat}.${index + 1}.${i}`] = {
                    message: `Silahkan Kunjungi\n${BASE_URL}/${item.id}/${item.value.toLowerCase()}.html#subjekViewTab${2+i}`,
                    options: []
                };
            }
        });
    });

    return menu;
}

function buildMenuStructure(config) {
    const structure = {};
    Object.entries(config).forEach(([key, { message, options }]) => {
        structure[key] = {
            message: key === "0" ? (message) : message + '\n' + options.join('\n') + '\n99. Kembali',
            options: options.reduce((acc, opt, i) => {
                acc[`${key}.${i + 1}`] = opt;
                return acc;
            }, { [`${key}.99`]: "Kembali" })
        };
    });
    return structure;
}

const MENU_CONFIG = buildMenuFromData(statisticData);
export const MENU_STRUCTURE = buildMenuStructure(MENU_CONFIG);




// const MENU_CONFIG = {
//     "0": { message: HOME_MESSAGE, options: ["data perpustakaan", "Konsultasi Statistik", "Penjualan Produk Statistik", "Rekomendasi Statistik", "Layanan Pengaduan", "Chat dengan Admin", "Chat dengan AI"] },
//     "1": {
//         message: `1 data perpustakaan`,
//         options: ["Data dalam tabel", "Publikasi", "Berita dan informasi Statistik", "Infografis", "Berita Resmi Statistik", "Layanan data lainnya"]
//     },
//     "2": {
//         message: `2 konsultasi statistik http://s.bps.go.id/pengaduanboyolali`,
//         options: []
//     },
//     "3": {
//         message: `3 Penjualan Produk Statistik https://silastik.bps.go.id`,
//         options: []
//     },
//     "4": {
//         message: `4 Rekomendasi Statistik https://romantik.web.bps.go.id/`,
//         options: []
//     },
//     "5": {
//         message: `5 Layanan Pengaduan http://s.bps.go.id/pengaduanboyolali`,
//         options: []
//     },
//     "6": {
//         message: `6 Chat dengan Admin`,
//         options: []
//     },
//     "1.1": {
//         message: `1.1 Data dalam tabel`,
//         options: ["Sosial dan Kependudukan", "Ekonomi dan Perdagangan", "Pertanian dan Pertambangan"]
//     },
//     "1.1.1": {
//         message: `1.1.1 Sosial dan Kependudukan`,
//         options: ["Agama", "Gender", "Geografi", "Iklim", "Indeks Pembangunan Manusia", "Kemiskinan", "Kependudukan", "Kesehatan", "Konsumsi dan Pengeluaran", "Pemerintahan", "Pendidikan", "Perumahan", "Politik dan Keamanan", "Sosial Budaya", "Tenaga Kerja"]
//     },
//     "1.1.2": {
//         message: `1.1.2 Ekonomi dan Perdagangan`,
//         options: ["energi", "hotel"] //add more
//     },
//     "1.1.3": {
//         message: `1.1.3 Sosial dan Kependudukan`,
//         options: ["hortikultura", "perkebunan"] //add more
//     },
//     "1.1.1.1": {
//         message: `*Statistik Agama mana yang Anda cari*`,
//         options: ["Tabel/Indikator", "Publikasi", "Tabel Dinamis"]
//     },
//     "1.1.1.1.1": {
//         message:
//             `Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab3`,
//         options: []
//     },
//     "1.1.1.1.2": {
//         message:
//             `Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab4`,
//         options: []
//     },
//     "1.1.1.1.3": {
//         message:
//             `Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab5`,
//         options: []
//     },
//     "1.1.1.2": {
//         message: `*Statistik Gender mana yang Anda cari*`,
//         options: ["Tabel/Indikator", "Publikasi", "Tabel Dinamis"]
//     },
//     "1.1.1.2.1": {
//         message:
//             `Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/40/gender.html#subjekViewTab3`,
//         options: []
//     },
//     "1.1.1.2.2": {
//         message:
//             `Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/40/gender.html#subjekViewTab4`,
//         options: []
//     },
//     "1.1.1.2.3": {
//         message:
//             `Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/40/gender.html#subjekViewTab5`,
//         options: []
//     },
//     // Continue with other sosial kependudukan submenus following the same pattern...
//     "1.1.2.1": {
//         message: `*Statistik Energi mana yang Anda cari*`,
//         options: ["Tabel/Indikator", "Publikasi", "Tabel Dinamis"]
//     },
//     // Continue with other ekonomi perdagangan submenus following the same pattern...
//     "1.1.3.1": {
//         message: `*Statistik Hortikultura mana yang Anda cari*`,
//         options: ["Tabel/Indikator", "Publikasi", "Tabel Dinamis"]
//     },
//     // Continue with other pertanian pertambangan submenus following the same pattern...
// };


// function buildMenuStructure(config) {
//     const structure = {};
//     Object.entries(config).forEach(([key, { message, options }]) => {
//         structure[key] = {
//             message: key === "0" ? message : message + '\n' + options.map((opt, i) => `${i + 1}. ${opt}`).join('\n') + '\n99. Kembali',
//             options: options.reduce((acc, opt, i) => {
//                 acc[`${key}.${i + 1}`] = opt;
//                 return acc;
//             }, { [`${key}.99`]: "Kembali" })
//         };
//     });
//     return structure;
// }

// export const MENU_STRUCTURE = buildMenuStructure(MENU_CONFIG);

// export const MENU_STRUCTURE = {
//     "0": { // Home menu
//         message: HOME_MESSAGE,
//         options: {
//             "1": "Statistik Boyolali",
//             "2": "Tanya AI",
//             "3": "Tanya CS"
//         }
//     },
//     "1": { // Submenu for option 1
//         message: `*Pilih Menu yang Sesuai!*\n
//     1. Sosial dan Kependudukan
//     2. Ekonomi dan Perdagangan
//     3. Pertanian dan Pertambangan
//     99. Kembali`,
//         options: {
//             "1.1": "Sosial dan Kependudukan",
//             "1.2": "Ekonomi dan Perdagangan",
//             "1.3": "Pertanian dan Pertambangan",
//             "1.99": "Kembali"
//         }
//     },
//     "1.1": {
//         message: `*Statistik Sosial dan Kependudukan mana yang Anda cari*\n
//     1. Agama
//     2. Gender
//     3. Geografi
//     4. Iklim
//     5. Indeks Pembangunan Manusia
//     6. Kemiskinan
//     7. Kependudukan
//     8. Kesehatan
//     9. Konsumsi dan Pengeluaran
//     10. Pemerintahan
//     11. Pendidikan
//     12. Perumahan
//     13. Politik dan Keamanan
//     14. Sosial Budaya
//     15. Tenaga Kerja
//     99. Kembali`,
//         options: {
//             "1.1.1": "Agama",
//             "1.1.2": "Gender",
//             "1.1.3": "Geografi",
//             "1.1.4": "Iklim",
//             "1.1.5": "Indeks Pembangunan Manusia",
//             "1.1.6": "Kemiskinan",
//             "1.1.7": "Kependudukan",
//             "1.1.8": "Kesehatan",
//             "1.1.9": "Konsumsi dan Pengeluaran",
//             "1.1.10": "Pemerintahan",
//             "1.1.11": "Pendidikan",
//             "1.1.12": "Perumahan",
//             "1.1.13": "Politik dan Keamanan",
//             "1.1.14": "Sosial Budaya",
//             "1.1.15": "Tenaga Kerja",
//             "1.1.99": "Kembali"
//         }
//     },
//     "1.1.1": {
//         "message": `*Statistik Agama mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.1.1": "Tabel/Indikator",
//             "1.1.1.2": "Publikasi",
//             "1.1.1.3": "Tabel Dinamis",
//             "1.1.1.99": "Kembali"
//         }
//     },
//     "1.1.1.1": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.1.1.99": "Kembali"
//         }
//     },
//     "1.1.1.2": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.1.2.99": "Kembali"
//         }
//     },
//     "1.1.1.3": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/155/agama.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.1.3.99": "Kembali"
//         }
//     },
//     "1.1.2": {
//         "message": `*Statistik Gender mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.2.1": "Tabel/Indikator",
//             "1.1.2.2": "Publikasi",
//             "1.1.2.3": "Tabel Dinamis",
//             "1.1.2.99": "Kembali"
//         }
//     },
//     "1.1.2.1": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/40/gender.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.2.1.99": "Kembali"
//         }
//     },
//     "1.1.2.2": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/40/gender.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.2.2.99": "Kembali"
//         }
//     },
//     "1.1.2.3": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/40/gender.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.2.3.99": "Kembali"
//         }
//     },
//     "1.1.3": {
//         "message": `*Statistik Geografi mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.3.1": "Tabel/Indikator",
//             "1.1.3.2": "Publikasi",
//             "1.1.3.3": "Tabel Dinamis",
//             "1.1.3.99": "Kembali"
//         }
//     },
//     "1.1.3.1": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/153/geografi.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.3.1.99": "Kembali"
//         }
//     },
//     "1.1.3.2": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/153/geografi.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.3.2.99": "Kembali"
//         }
//     },
//     "1.1.3.3": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/153/geografi.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.3.3.99": "Kembali"
//         }
//     },
//     "1.1.4": {
//         "message": `*Statistik Iklim mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.4.1": "Tabel/Indikator",
//             "1.1.4.2": "Publikasi",
//             "1.1.4.3": "Tabel Dinamis",
//             "1.1.4.99": "Kembali"
//         }
//     },
//     "1.1.4.1": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/151/iklim.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.4.1.99": "Kembali"
//         }
//     },
//     "1.1.4.2": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/151/iklim.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.4.2.99": "Kembali"
//         }
//     },
//     "1.1.4.3": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/151/iklim.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.4.3.99": "Kembali"
//         }
//     },
//     "1.1.5": {
//         "message": `*Statistik Indeks Pembangunan Manusia mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.5.1": "Tabel/Indikator",
//             "1.1.5.2": "Publikasi",
//             "1.1.5.3": "Tabel Dinamis",
//             "1.1.5.99": "Kembali"
//         }
//     },
//     "1.1.5.1": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/26/indeks-pembangunan-manusia.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.5.1.99": "Kembali"
//         }
//     },
//     "1.1.5.2": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/26/indeks-pembangunan-manusia.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.5.2.99": "Kembali"
//         }
//     },
//     "1.1.5.3": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/26/indeks-pembangunan-manusia.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.5.3.99": "Kembali"
//         }
//     },
//     "1.1.6": {
//         "message": `*Statistik Kemiskinan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.6.1": "Tabel/Indikator",
//             "1.1.6.2": "Publikasi",
//             "1.1.6.3": "Tabel Dinamis",
//             "1.1.6.99": "Kembali"
//         }
//     },
//     "1.1.6.1": {
//         "message": `
//         Silahkan Kunjungi
//         https://boyolalikab.bps.go.id/subject/23/kemiskinan.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.6.1.99": "Kembali"
//         }
//     },
//     "1.1.6.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/23/kemiskinan.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.6.2.99": "Kembali"
//         }
//     },
//     "1.1.6.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/23/kemiskinan.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.6.3.99": "Kembali"
//         }
//     },
//     "1.1.7": {
//         "message": `*Statistik Kependudukan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.7.1": "Tabel/Indikator",
//             "1.1.7.2": "Publikasi",
//             "1.1.7.3": "Tabel Dinamis",
//             "1.1.7.99": "Kembali"
//         }
//     },
//     "1.1.7.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/12/kependudukan.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.7.1.99": "Kembali"
//         }
//     },
//     "1.1.7.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/12/kependudukan.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.7.2.99": "Kembali"
//         }
//     },
//     "1.1.7.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/12/kependudukan.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.7.3.99": "Kembali"
//         }
//     },
//     "1.1.8": {
//         "message": `*Statistik Kesehatan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.8.1": "Tabel/Indikator",
//             "1.1.8.2": "Publikasi",
//             "1.1.8.3": "Tabel Dinamis",
//             "1.1.8.99": "Kembali"
//         }
//     },
//     "1.1.8.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/30/kesehatan.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.8.1.99": "Kembali"
//         }
//     },
//     "1.1.8.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/30/kesehatan.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.8.2.99": "Kembali"
//         }
//     },
//     "1.1.8.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/30/kesehatan.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.8.3.99": "Kembali"
//         }
//     },
//     "1.1.9": {
//         "message": `*Statistik Konsumsi dan Pengeluaran mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.9.1": "Tabel/Indikator",
//             "1.1.9.2": "Publikasi",
//             "1.1.9.3": "Tabel Dinamis",
//             "1.1.9.99": "Kembali"
//         }
//     },
//     "1.1.9.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/5/konsumsi-dan-pengeluaran.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.9.1.99": "Kembali"
//         }
//     },
//     "1.1.9.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/5/konsumsi-dan-pengeluaran.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.9.2.99": "Kembali"
//         }
//     },
//     "1.1.9.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/5/konsumsi-dan-pengeluaran.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.9.3.99": "Kembali"
//         }
//     },
//     "1.1.10": {
//         "message": `*Statistik Pemerintahan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.10.1": "Tabel/Indikator",
//             "1.1.10.2": "Publikasi",
//             "1.1.10.3": "Tabel Dinamis",
//             "1.1.10.99": "Kembali"
//         }
//     },
//     "1.1.10.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/101/pemerintahan.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.10.1.99": "Kembali"
//         }
//     },
//     "1.1.10.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/101/pemerintahan.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.10.2.99": "Kembali"
//         }
//     },
//     "1.1.10.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/101/pemerintahan.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.10.3.99": "Kembali"
//         }
//     },
//     "1.1.11": {
//         "message": `*Statistik Pendidikan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.11.1": "Tabel/Indikator",
//             "1.1.11.2": "Publikasi",
//             "1.1.11.3": "Tabel Dinamis",
//             "1.1.11.99": "Kembali"
//         }
//     },
//     "1.1.11.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/7/pendidikan.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.11.1.99": "Kembali"
//         }
//     },
//     "1.1.11.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/7/pendidikan.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.11.2.99": "Kembali"
//         }
//     },
//     "1.1.11.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/7/pendidikan.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.11.3.99": "Kembali"
//         }
//     },
//     "1.1.12": {
//         "message": `*Statistik Perumahan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.12.1": "Tabel/Indikator",
//             "1.1.12.2": "Publikasi",
//             "1.1.12.3": "Tabel Dinamis",
//             "1.1.12.99": "Kembali"
//         }
//     },
//     "1.1.12.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/102/perumahan.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.12.1.99": "Kembali"
//         }
//     },
//     "1.1.12.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/102/perumahan.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.12.2.99": "Kembali"
//         }
//     },
//     "1.1.12.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/102/perumahan.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.12.3.99": "Kembali"
//         }
//     },
//     "1.1.13": {
//         "message": `*Statistik Politik dan Keamanan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.13.1": "Tabel/Indikator",
//             "1.1.13.2": "Publikasi",
//             "1.1.13.3": "Tabel Dinamis",
//             "1.1.13.99": "Kembali"
//         }
//     },
//     "1.1.13.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/103/politik-dan-keamanan.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.13.1.99": "Kembali"
//         }
//     },
//     "1.1.13.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/103/politik-dan-keamanan.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.13.2.99": "Kembali"
//         }
//     },
//     "1.1.13.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/103/politik-dan-keamanan.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.13.3.99": "Kembali"
//         }
//     },
//     "1.1.14": {
//         "message": `*Statistik Sosial Budaya mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.14.1": "Tabel/Indikator",
//             "1.1.14.2": "Publikasi",
//             "1.1.14.3": "Tabel Dinamis",
//             "1.1.14.99": "Kembali"
//         }
//     },
//     "1.1.14.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/104/sosial-budaya.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.14.1.99": "Kembali"
//         }
//     },
//     "1.1.14.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/104/sosial-budaya.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.14.2.99": "Kembali"
//         }
//     },
//     "1.1.14.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/104/sosial-budaya.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.14.3.99": "Kembali"
//         }
//     },
//     "1.1.15": {
//         "message": `*Statistik Tenaga Kerja mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.1.15.1": "Tabel/Indikator",
//             "1.1.15.2": "Publikasi",
//             "1.1.15.3": "Tabel Dinamis",
//             "1.1.15.99": "Kembali"
//         }
//     },
//     "1.1.15.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/15/tenaga-kerja.html#subjekViewTab3\n\n99. Kembali`,
//         "options": {
//             "1.1.15.1.99": "Kembali"
//         }
//     },
//     "1.1.15.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/15/tenaga-kerja.html#subjekViewTab4\n\n99. Kembali`,
//         "options": {
//             "1.1.15.2.99": "Kembali"
//         }
//     },
//     "1.1.15.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/15/tenaga-kerja.html#subjekViewTab5\n\n99. Kembali`,
//         "options": {
//             "1.1.15.3.99": "Kembali"
//         }
//     },
//     "1.2": {
//         "message": `*Statistik Ekonomi dan Perdagangan mana yang Anda cari*\n
//         1. Energi
//         2. Hotel dan Pariwisata
//         3. Indeks Harga Konsumen
//         4. Industri
//         5. Inflasi
//         6. Keuangan
//         7. Komunikasi
//         8. Konstruksi
//         9. Nilai Tukar Petani
//         10. Perdagangan
//         11. Produk Domestik Regional Bruto
//             (Lapangan Usaha)
//         12. Produk Domestik Regional Bruto
//             (Pengeluaran)
//         13. Transportasi
//         14. Upah Buruh
//         15. Usaha Mikro Kecil
//         99. Kembali`,
//         "options": {
//             "1.2.1": "Energi",
//             "1.2.2": "Hotel dan Pariwisata",
//             "1.2.3": "Indeks Harga Konsumen",
//             "1.2.4": "Industri",
//             "1.2.5": "Inflasi",
//             "1.2.6": "Keuangan",
//             "1.2.7": "Komunikasi",
//             "1.2.8": "Konstruksi",
//             "1.2.9": "Nilai Tukar Petani",
//             "1.2.10": "Perdagangan",
//             "1.2.11": "Produk Domestik Regional Bruto (Lapangan Usaha)",
//             "1.2.12": "Produk Domestik Regional Bruto (Pengeluaran)",
//             "1.2.13": "Transportasi",
//             "1.2.14": "Upah Buruh",
//             "1.2.15": "Usaha Mikro Kecil",
//             "1.2.99": "Kembali"
//         }
//     },
//     "1.2.1": {
//         "message": `*Statistik Energi mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.1.1": "Tabel/Indikator",
//             "1.2.1.2": "Publikasi",
//             "1.2.1.3": "Tabel Dinamis",
//             "1.2.1.99": "Kembali"
//         }
//     },
//     "1.2.1.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/7/energi.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.1.1.99": "Kembali"
//         }
//     },
//     "1.2.1.2": {
//         "message": `
//         Silahkan Kunjungi
//             https://boyolalikab.bps.go.id/subject/7/energi.html#subjekViewTab4
//         99. Kembali`,
//         "options": {
//             "1.2.1.2.99": "Kembali"
//         }
//     },
//     "1.2.1.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/7/energi.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.1.3.99": "Kembali"
//         }
//     },
//     "1.2.2": {
//         "message": `*Statistik Hotel dan Pariwisata mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.2.1": "Tabel/Indikator",
//             "1.2.2.2": "Publikasi",
//             "1.2.2.3": "Tabel Dinamis",
//             "1.2.2.99": "Kembali"
//         }
//     },
//     "1.2.2.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/16/hotel-dan-pariwisata.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.2.1.99": "Kembali"
//         }
//     },
//     "1.2.2.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/16/hotel-dan-pariwisata.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.2.2.99": "Kembali"
//         }
//     },
//     "1.2.2.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/16/hotel-dan-pariwisata.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.2.3.99": "Kembali"
//         }
//     },
//     "1.2.3": {
//         "message": `*Statistik Indeks Harga Konsumen mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.3.1": "Tabel/Indikator",
//             "1.2.3.2": "Publikasi",
//             "1.2.3.3": "Tabel Dinamis",
//             "1.2.3.99": "Kembali"
//         }
//     },
//     "1.2.3.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/157/indeks-harga-konsumen.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.3.1.99": "Kembali"
//         }
//     },
//     "1.2.3.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/157/indeks-harga-konsumen.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.3.2.99": "Kembali"
//         }
//     },
//     "1.2.3.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/157/indeks-harga-konsumen.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.3.3.99": "Kembali"
//         }
//     },
//     "1.2.4": {
//         "message": `*Statistik Industri mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.4.1": "Tabel/Indikator",
//             "1.2.4.2": "Publikasi",
//             "1.2.4.3": "Tabel Dinamis",
//             "1.2.4.99": "Kembali"
//         }
//     },
//     "1.2.4.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/9/industri.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.4.1.99": "Kembali"
//         }
//     },
//     "1.2.4.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/9/industri.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.4.2.99": "Kembali"
//         }
//     },
//     "1.2.4.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/9/industri.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.4.3.99": "Kembali"
//         }
//     },
//     "1.2.5": {
//         "message": `*Statistik Inflasi mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.5.1": "Tabel/Indikator",
//             "1.2.5.2": "Publikasi",
//             "1.2.5.3": "Tabel Dinamis",
//             "1.2.5.99": "Kembali"
//         }
//     },
//     "1.2.5.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/3/inflasi.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.5.1.99": "Kembali"
//         }
//     },
//     "1.2.5.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/3/inflasi.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.5.2.99": "Kembali"
//         }
//     },
//     "1.2.5.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/3/inflasi.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.5.3.99": "Kembali"
//         }
//     },
//     "1.2.6": {
//         "message": `*Statistik Keuangan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.6.1": "Tabel/Indikator",
//             "1.2.6.2": "Publikasi",
//             "1.2.6.3": "Tabel Dinamis",
//             "1.2.6.99": "Kembali"
//         }
//     },
//     "1.2.6.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/13/keuangan.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.6.1.99": "Kembali"
//         }
//     },
//     "1.2.6.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/13/keuangan.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.6.2.99": "Kembali"
//         }
//     },
//     "1.2.6.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/13/keuangan.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.6.3.99": "Kembali"
//         }
//     },
//     "1.2.7": {
//         "message": `*Statistik Komunikasi mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.7.1": "Tabel/Indikator",
//             "1.2.7.2": "Publikasi",
//             "1.2.7.3": "Tabel Dinamis",
//             "1.2.7.99": "Kembali"
//         }
//     },
//     "1.2.7.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/2/komunikasi.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.7.1.99": "Kembali"
//         }
//     },
//     "1.2.7.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/2/komunikasi.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.7.2.99": "Kembali"
//         }
//     },
//     "1.2.7.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/2/komunikasi.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.7.3.99": "Kembali"
//         }
//     },
//     "1.2.8": {
//         "message": `*Statistik Konstruksi mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.8.1": "Tabel/Indikator",
//             "1.2.8.2": "Publikasi",
//             "1.2.8.3": "Tabel Dinamis",
//             "1.2.8.99": "Kembali"
//         }
//     },
//     "1.2.8.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/4/konstruksi.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.8.1.99": "Kembali"
//         }
//     },
//     "1.2.8.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/4/konstruksi.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.8.2.99": "Kembali"
//         }
//     },
//     "1.2.8.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/4/konstruksi.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.8.3.99": "Kembali"
//         }
//     },
//     "1.2.9": {
//         "message": `*Statistik Nilai Tukar Petani mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.9.1": "Tabel/Indikator",
//             "1.2.9.2": "Publikasi",
//             "1.2.9.3": "Tabel Dinamis",
//             "1.2.9.99": "Kembali"
//         }
//     },
//     "1.2.9.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/22/nilai-tukar-petani.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.9.1.99": "Kembali"
//         }
//     },
//     "1.2.9.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/22/nilai-tukar-petani.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.9.2.99": "Kembali"
//         }
//     },
//     "1.2.9.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/22/nilai-tukar-petani.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.9.3.99": "Kembali"
//         }
//     },
//     "1.2.10": {
//         "message": `*Statistik Perdagangan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.10.1": "Tabel/Indikator",
//             "1.2.10.2": "Publikasi",
//             "1.2.10.3": "Tabel Dinamis",
//             "1.2.10.99": "Kembali"
//         }
//     },
//     "1.2.10.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/158/perdagangan.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.10.1.99": "Kembali"
//         }
//     },
//     "1.2.10.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/158/perdagangan.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.10.2.99": "Kembali"
//         }
//     },
//     "1.2.10.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/158/perdagangan.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.10.3.99": "Kembali"
//         }
//     },
//     "1.2.11": {
//         "message": `*Statistik Produk Domestik Regional Bruto (Lapangan Usaha) mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.11.1": "Tabel/Indikator",
//             "1.2.11.2": "Publikasi",
//             "1.2.11.3": "Tabel Dinamis",
//             "1.2.11.99": "Kembali"
//         }
//     },
//     "1.2.11.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/11/produk-domestik-regional-bruto-lapangan-usaha.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.11.1.99": "Kembali"
//         }
//     },
//     "1.2.11.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/11/produk-domestik-regional-bruto-lapangan-usaha.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.11.2.99": "Kembali"
//         }
//     },
//     "1.2.11.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/11/produk-domestik-regional-bruto-lapangan-usaha.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.11.3.99": "Kembali"
//         }
//     },
//     "1.2.12": {
//         "message": `*Statistik Produk Domestik Regional Bruto (Pengeluaran) mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.12.1": "Tabel/Indikator",
//             "1.2.12.2": "Publikasi",
//             "1.2.12.3": "Tabel Dinamis",
//             "1.2.12.99": "Kembali"
//         }
//     },
//     "1.2.12.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/156/produk-domestik-regional-bruto-pengeluaran.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.12.1.99": "Kembali"
//         }
//     },
//     "1.2.12.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/156/produk-domestik-regional-bruto-pengeluaran.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.12.2.99": "Kembali"
//         }
//     },
//     "1.2.12.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/156/produk-domestik-regional-bruto-pengeluaran.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.12.3.99": "Kembali"
//         }
//     },
//     "1.2.13": {
//         "message": `*Statistik Transportasi mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.13.1": "Tabel/Indikator",
//             "1.2.13.2": "Publikasi",
//             "1.2.13.3": "Tabel Dinamis",
//             "1.2.13.99": "Kembali"
//         }
//     },
//     "1.2.13.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/17/transportasi.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.13.1.99": "Kembali"
//         }
//     },
//     "1.2.13.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/17/transportasi.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.13.2.99": "Kembali"
//         }
//     },
//     "1.2.13.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/17/transportasi.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.13.3.99": "Kembali"
//         }
//     },
//     "1.2.14": {
//         "message": `*Statistik Upah Buruh mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.14.1": "Tabel/Indikator",
//             "1.2.14.2": "Publikasi",
//             "1.2.14.3": "Tabel Dinamis",
//             "1.2.14.99": "Kembali"
//         }
//     },
//     "1.2.14.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/19/upah-buruh.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.14.1.99": "Kembali"
//         }
//     },
//     "1.2.14.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/19/upah-buruh.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.14.2.99": "Kembali"
//         }
//     },
//     "1.2.14.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/19/upah-buruh.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.14.3.99": "Kembali"
//         }
//     },
//     "1.2.15": {
//         "message": `*Statistik Usaha Mikro Kecil mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.2.15.1": "Tabel/Indikator",
//             "1.2.15.2": "Publikasi",
//             "1.2.15.3": "Tabel Dinamis",
//             "1.2.15.99": "Kembali"
//         }
//     },
//     "1.2.15.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/35/usaha-mikro-kecil.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.2.15.1.99": "Kembali"
//         }
//     },
//     "1.2.15.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/35/usaha-mikro-kecil.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.2.15.2.99": "Kembali"
//         }
//     },
//     "1.2.15.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/35/usaha-mikro-kecil.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.2.15.3.99": "Kembali"
//         }
//     },
//     "1.3": {
//         "message": `*Statistik Pertanian dan Pertambangan mana yang Anda cari*\n
//         1. Hortikultura
//         2. Kehutanan
//         3. Perikanan
//         4. Perkebunan
//         5. Peternakan
//         6. Tanaman Pangan
//         99. Kembali`,
//         "options": {
//             "1.3.1": "Hortikultura",
//             "1.3.2": "Kehutanan",
//             "1.3.3": "Perikanan",
//             "1.3.4": "Perkebunan",
//             "1.3.5": "Peternakan",
//             "1.3.6": "Tanaman Pangan",
//             "1.3.99": "Kembali"
//         }
//     },
//     "1.3.1": {
//         "message": `*Statistik Hortikultura mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.3.1.1": "Tabel/Indikator",
//             "1.3.1.2": "Publikasi",
//             "1.3.1.3": "Tabel Dinamis",
//             "1.3.1.99": "Kembali"
//         }
//     },
//     "1.3.1.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/55/hortikultura.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.3.1.1.99": "Kembali"
//         }
//     },
//     "1.3.1.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/55/hortikultura.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.3.1.2.99": "Kembali"
//         }
//     },
//     "1.3.1.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/55/hortikultura.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.3.1.3.99": "Kembali"
//         }
//     },
//     "1.3.2": {
//         "message": `*Statistik Kehutanan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.3.2.1": "Tabel/Indikator",
//             "1.3.2.2": "Publikasi",
//             "1.3.2.3": "Tabel Dinamis",
//             "1.3.2.99": "Kembali"
//         }
//     },
//     "1.3.2.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/60/kehutanan.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.3.2.1.99": "Kembali"
//         }
//     },
//     "1.3.2.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/60/kehutanan.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.3.2.2.99": "Kembali"
//         }
//     },
//     "1.3.2.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/60/kehutanan.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.3.2.3.99": "Kembali"
//         }
//     },
//     "1.3.3": {
//         "message": `*Statistik Perikanan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.3.3.1": "Tabel/Indikator",
//             "1.3.3.2": "Publikasi",
//             "1.3.3.3": "Tabel Dinamis",
//             "1.3.3.99": "Kembali"
//         }
//     },
//     "1.3.3.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/56/perikanan.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.3.3.1.99": "Kembali"
//         }
//     },
//     "1.3.3.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/56/perikanan.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.3.3.2.99": "Kembali"
//         }
//     },
//     "1.3.3.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/56/perikanan.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.3.3.3.99": "Kembali"
//         }
//     },
//     "1.3.4": {
//         "message": `*Statistik Perkebunan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.3.4.1": "Tabel/Indikator",
//             "1.3.4.2": "Publikasi",
//             "1.3.4.3": "Tabel Dinamis",
//             "1.3.4.99": "Kembali"
//         }
//     },
//     "1.3.4.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/54/perkebunan.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.3.4.1.99": "Kembali"
//         }
//     },
//     "1.3.4.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/54/perkebunan.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.3.4.2.99": "Kembali"
//         }
//     },
//     "1.3.4.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/54/perkebunan.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.3.4.3.99": "Kembali"
//         }
//     },
//     "1.3.5": {
//         "message": `*Statistik Peternakan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.3.5.1": "Tabel/Indikator",
//             "1.3.5.2": "Publikasi",
//             "1.3.5.3": "Tabel Dinamis",
//             "1.3.5.99": "Kembali"
//         }
//     },
//     "1.3.5.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/24/peternakan.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.3.5.1.99": "Kembali"
//         }
//     },
//     "1.3.5.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/24/peternakan.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.3.5.2.99": "Kembali"
//         }
//     },
//     "1.3.5.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/24/peternakan.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.3.5.3.99": "Kembali"
//         }
//     },
//     "1.3.6": {
//         "message": `*Statistik Tanaman Pangan mana yang Anda cari*\n${JENIS_STATISTIK}\n 99. Kembali`,
//         "options": {
//             "1.3.6.1": "Tabel/Indikator",
//             "1.3.6.2": "Publikasi",
//             "1.3.6.3": "Tabel Dinamis",
//             "1.3.6.99": "Kembali"
//         }
//     },
//     "1.3.6.1": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/53/tanaman-pangan.html#subjekViewTab3\n 99. Kembali`,
//         "options": {
//             "1.3.6.1.99": "Kembali"
//         }
//     },
//     "1.3.6.2": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/53/tanaman-pangan.html#subjekViewTab4\n 99. Kembali`,
//         "options": {
//             "1.3.6.2.99": "Kembali"
//         }
//     },
//     "1.3.6.3": {
//         "message": `Silahkan Kunjungi
//     https://boyolalikab.bps.go.id/subject/53/tanaman-pangan.html#subjekViewTab5\n 99. Kembali`,
//         "options": {
//             "1.3.6.3.99": "Kembali"
//         }
//     },
//     // Add more submenus here
// };