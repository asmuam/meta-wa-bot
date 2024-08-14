import { HOME_MESSAGE, statisticData } from "./const.js";

const BASE_URL = 'https://boyolalikab.bps.go.id/subject';

function buildMenuFromData(statisticData) {
    const menu = {
        "0": { message: HOME_MESSAGE, options: ["data perpustakaan", "Konsultasi Statistik", "Penjualan Produk Statistik", "Rekomendasi Statistik", "Layanan Pengaduan", "Chat dengan Admin", "Chat dengan AI"] },
        "1": {
            message: "Data dalam tabel",
            options: ["Sosial dan Kependudukan", "Ekonomi dan Perdagangan", "Pertanian dan Pertambangan"]
        },
        "2": {
            message: "Konsultasi Statistik http://s.bps.go.id/pengaduanboyolali",
            options: []
        },
        "3": {
            message: "Penjualan Produk Statistik https://silastik.bps.go.id",
            options: []
        },
        "4": {
            message: "Rekomendasi Statistik https://romantik.web.bps.go.id/",
            options: []
        },
        "5": {
            message: "Layanan Pengaduan http://s.bps.go.id/pengaduanboyolali",
            options: []
        },
        "6": {
            message: "Chat dengan Admin",
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

        menu[`1.1.${cat}`] = {
            message: label,
            options: submenus.map((item, index) => `${index + 1}. ${item.value}`).concat(["99. Kembali"])
        };

        submenus.forEach((item, index) => {
            menu[`1.1.${cat}.${index + 1}`] = {
                message: `Statistik ${formatStatisticValue(item.value)} mana yang Anda cari?`,
                options: ["Tabel/Indikator", "Publikasi", "Tabel Dinamis"].map((option, i) => `${i + 1}. ${option}`)
            };

            // Generate links for detail views
            for (let i = 1; i <= 3; i++) {
                menu[`1.1.${cat}.${index + 1}.${i}`] = {
                    message: `Silahkan Kunjungi\n${BASE_URL}/${item.id}/${item.value}.html#subjekViewTab${i}`,
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
            message: key === "0" ? message : message + '\n' + options.join('\n') + '\n99. Kembali',
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


console.log(MENU_STRUCTURE);
