import express from 'express';
import 'dotenv/config';
export const app = express();
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

export const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT_NODE, PORT_PY, BOT_NUMBER, BOT_NAME, PEGAWAI_NUMBER } = process.env;

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
// export const statisticData = [
//     { cat: 1, id: 155, value: 'Agama' },
//     { cat: 1, id: 40, value: 'Gender' },
//     { cat: 1, id: 153, value: 'Geografi' },
//     { cat: 1, id: 151, value: 'Iklim' },
//     { cat: 1, id: 26, value: 'Indeks-Pembangunan-Panusia' },
//     { cat: 1, id: 23, value: 'Kemiskinan' },
//     { cat: 1, id: 12, value: 'Kependudukan' },
//     { cat: 1, id: 30, value: 'Kesehatan' },
//     { cat: 1, id: 5, value: 'Konsumsi-dan-Pengeluaran' },
//     { cat: 1, id: 101, value: 'Pemerintahan' },
//     { cat: 1, id: 28, value: 'Pendidikan' },
//     { cat: 1, id: 29, value: 'Perumahan' },
//     { cat: 1, id: 154, value: 'Politik-dan-Keamanan' },
//     { cat: 1, id: 27, value: 'Sosial-Budaya' },
//     { cat: 1, id: 6, value: 'Tenaga-Kerja' },
//     { cat: 2, id: 7, value: 'Energi' },
//     { cat: 2, id: 16, value: 'Hotel-dan-Pariwisata' },
//     { cat: 2, id: 157, value: 'Indeks-Harga-Konsumen' },
//     { cat: 2, id: 9, value: 'Industri' },
//     { cat: 2, id: 3, value: 'Inflasi' },
//     { cat: 2, id: 13, value: 'Keuangan' },
//     { cat: 2, id: 2, value: 'Komunikasi' },
//     { cat: 2, id: 4, value: 'Konstruksi' },
//     { cat: 2, id: 22, value: 'Nilai-Tukar-Petani' },
//     { cat: 2, id: 158, value: 'Perdagangan' },
//     { cat: 2, id: 11, value: 'Produk-Domestik-Regional-Bruto-Lapangan-Usaha' },
//     { cat: 2, id: 156, value: 'Produk-Domestik-Regional-Bruto-Pengeluaran' },
//     { cat: 2, id: 17, value: 'Transportasi' },
//     { cat: 2, id: 19, value: 'Upah-Buruh' },
//     { cat: 2, id: 35, value: 'Usaha-Mikro-Kecil' },
//     { cat: 3, id: 55, value: 'Hortikultura' },
//     { cat: 3, id: 60, value: 'Kehutanan' },
//     { cat: 3, id: 56, value: 'Perikanan' },
//     { cat: 3, id: 54, value: 'Perkebunan' },
//     { cat: 3, id: 24, value: 'Peternakan' },
//     { cat: 3, id: 53, value: 'Tanaman-Pangan' }
// ];  // daftar lama per 21 agustus 2024 berubah

export const statisticData = [
    // Statistik Demografi dan Sosial
    { cat: 1, id: 519, value: 'Kependudukan dan Migrasi' },
    { cat: 1, id: 520, value: 'Tenaga Kerja' },
    { cat: 1, id: 521, value: 'Pendidikan' },
    { cat: 1, id: 522, value: 'Kesehatan' },
    { cat: 1, id: 523, value: 'Konsumsi dan Pendapatan' },
    { cat: 1, id: 524, value: 'Perlindungan Sosial' },
    { cat: 1, id: 525, value: 'Pemukiman dan Perumahan' },
    { cat: 1, id: 526, value: 'Hukum dan Kriminal' },
    { cat: 1, id: 527, value: 'Budaya' },
    { cat: 1, id: 528, value: 'Aktivitas Politik dan Komunitas Lainnya' },
    { cat: 1, id: 529, value: 'Penggunaan Waktu' },

    // Statistik Ekonomi
    { cat: 2, id: 530, value: 'Statistik Makroekonomi' },
    { cat: 2, id: 531, value: 'Neraca Ekonomi' },
    { cat: 2, id: 532, value: 'Statistik Bisnis' },
    { cat: 2, id: 533, value: 'Statistik Sektoral' },
    { cat: 2, id: 534, value: 'Keuangan Pemerintah, Fiskal dan Statistik Sektor Publik' },
    { cat: 2, id: 535, value: 'Perdagangan Internasional dan Neraca Pembayaran' },
    { cat: 2, id: 536, value: 'Harga-Harga' },
    { cat: 2, id: 537, value: 'Biaya Tenaga Kerja' },
    { cat: 2, id: 538, value: 'Ilmu Pengetahuan, Teknologi, dan Inovasi' },
    { cat: 2, id: 557, value: 'Pertanian, Kehutanan, Perikanan' },
    { cat: 2, id: 558, value: 'Energi' },
    { cat: 2, id: 559, value: 'Pertambangan, Manufaktur, Konstruksi' },
    { cat: 2, id: 560, value: 'Transportasi' },
    { cat: 2, id: 561, value: 'Pariwisata' },
    { cat: 2, id: 562, value: 'Perbankan, Asuransi dan Finansial' },

    // Statistik Lingkungan Hidup dan Multi-domain
    { cat: 3, id: 539, value: 'Lingkungan' },
    { cat: 3, id: 540, value: 'Statistik Regional dan Statistik Area Kecil' },
    { cat: 3, id: 541, value: 'Statistik dan Indikator Multi-Domain' },
    { cat: 3, id: 542, value: 'Buku Tahunan dan Ringkasan Sejenis' },
    { cat: 3, id: 563, value: 'Kondisi Tempat Tinggal, Kemiskinan, dan Permasalahan Sosial Lintas Sektor' },
    { cat: 3, id: 564, value: 'Gender dan Kelompok Populasi Khusus' },
    { cat: 3, id: 565, value: 'Masyarakat Informasi' },
    { cat: 3, id: 566, value: 'Globalisasi' },
    { cat: 3, id: 567, value: 'Indikator Millenium Development Goals (MDGs)' },
    { cat: 3, id: 568, value: 'Perkembangan Berkelanjutan' },
    { cat: 3, id: 569, value: 'Kewiraswastaan' }
];


const BASE_URL = 'https://boyolalikab.bps.go.id/id/statistics-table?subject=';


function buildMenuFromData(statisticData) {
    const menu = {
        "0": { message: HOME_MESSAGE + FOOTER, options: ["Data Perpustakaan", "Konsultasi Statistik", "Penjualan Produk Statistik", "Rekomendasi Statistik", "Layanan Pengaduan"] 
        },
        "1": { 
            message: `Ketik Angka yang Sesuai`, 
            options: ["1. Publikasi", "2. Data dalam tabel", "3. Berita dan Informasi Statistik", "4. Infografis", "5. Berita Resmi Statistik", "6. Layanan Data Lainnya", "7. Chat dengan Admin (Chat admin dilayani pada hari kerja jam 08.00--15.30 WIB)"] 
        },
        "1.1": { 
            message: `Silahkan Kunjungi Link Berikut untuk Melihat Publikasi dari BPS Boyolali\nhttps://boyolalikab.bps.go.id/id/publication`, 
            options: []
        },
        "1.2": {
            message: 
            `Pilih Kategori Data dalam tabel:`,
            options: ["1. Statistik Demografi dan Sosial", "2. Statistik Ekonomi", "3. Statistik Lingkungan Hidup dan Multi-domain"]
        },
        "1.3": { 
            message: `Silahkan Kunjungi Link Berikut untuk Melihat Berita dan Informasi Statistik dari BPS Boyolali\nhttps://boyolalikab.bps.go.id/news`,
            options: []
        },
        "1.4": { 
            message: `Silahkan Kunjungi Link Berikut untuk Melihat Infografis dari BPS Boyolali\nhttps://boyolalikab.bps.go.id/infographic`,
            options: []
        },
        "1.5": { 
            message: `Silahkan Kunjungi Link Berikut untuk Melihat Berita Resmi Statistik dari BPS Boyolali\nhttps://boyolalikab.bps.go.id/pressrelease`,
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
        1: "Statistik Demografi dan Sosial",
        2: "Statistik Ekonomi",
        3: "Statistik Lingkungan Hidup dan Multi-domain"
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
            // for (let i = 1; i <= 3; i++) {
            //     menu[`1.2.${cat}.${index + 1}.${i}`] = {
            //         message: `Silahkan Kunjungi\n${BASE_URL}/${item.id}/${item.value.toLowerCase()}.html#subjekViewTab${2+i}`,
            //         options: []
            //     };
            // }   // kode lama sebelum tampialn bps baru

            for (let i = 1; i <= 2; i++) {
                menu[`1.2.${cat}.${index + 1}.${i}`] = {
                    message: `Silahkan Kunjungi\n${BASE_URL}${item.id}}`,
                    options: []
                };
            }
            menu[`1.2.${cat}.${index + 1}.3`] = {
                message: `Silahkan Kunjungi\nhttps://boyolalikab.bps.go.id/id/query-builder`,
                options: []
            };
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


