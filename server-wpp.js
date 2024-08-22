/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */
import wppconnect from "@wppconnect-team/wppconnect";
import { HOME_MESSAGE, WRONG_COMMAND, BACK_TO_MENU, VALID_OPTIONS, SESSION_STATUS, SESSION_LIMIT, UNSUPPORTED_TYPE_MESSAGE, SESSION_EXPIRED_MESSAGE, SESSION_QNA_EXPIRED_MESSAGE, BOT_ERROR, BOT_NUMBER, BOT_NAME, MENU_STRUCTURE, NOT_IN_WORKING_HOURS, OPTION_AI, FOOTER, app, PORT_NODE } from "./const.js";
import { handleGeminiResponse } from "./aiHandlers.js";

const myTokenStore = new wppconnect.tokenStore.MemoryTokenStore();

/**
 * Menangani kedaluwarsa sesi untuk penerima tertentu.
 * Menghapus status sesi dari objek SESSION_STATUS dan mengirim pesan pemberitahuan sesi kedaluwarsa melalui WhatsApp.
 *
 * @async
 * @function
 * @name handleSessionExpiration
 * 
 * @param {string} business_phone_number_id - ID nomor telepon bisnis yang digunakan untuk mengirim pesan.
 * @param {string} recipient - Penerima yang sesi-nya telah berakhir.
 *
 * @example
 * handleSessionExpiration('123456789', 'recipient123');
 *
 * @returns {Promise<void>}
 */
async function handleSessionExpiration(client, recipient) {

    if (SESSION_STATUS[recipient]) {
        await sendWhatsAppMessage(client, recipient, SESSION_EXPIRED_MESSAGE);
        if (SESSION_STATUS[recipient].pegawaiPhoneNumber) {
            await sendWhatsAppMessage(client, SESSION_STATUS[recipient].pegawaiPhoneNumber, SESSION_QNA_EXPIRED_MESSAGE);
            availablePegawai.push(SESSION_STATUS[recipient].pegawaiPhoneNumber);
        }
    }
    delete SESSION_STATUS[recipient];
}

/**
 * Memeriksa kedaluwarsa sesi untuk setiap penerima dalam objek SESSION_STATUS.
 * Jika sesi telah tidak aktif selama lebih dari 6 menit (360000 ms), sesi akan dianggap kedaluwarsa dan
 * fungsi handleSessionExpiration akan dipanggil untuk menangani kedaluwarsa sesi tersebut.
 *
 * @function
 * @name checkSessionExpiration
 *
 * @example
 * checkSessionExpiration();
 *
 * @returns {void}
 */
function checkSessionExpiration() {
    const currentTime = Date.now();
    for (const recipient in SESSION_STATUS) {
        if ((currentTime - SESSION_STATUS[recipient].lastActive) > SESSION_LIMIT) {
            handleSessionExpiration(SESSION_STATUS[recipient].client, recipient);
        }
    }
}


/**
 * Memanggil fungsi checkSessionExpiration setiap 60 detik (60000 ms) untuk memeriksa dan menangani
 * kedaluwarsa sesi secara berkala.
 *
 * @example
 * setInterval(checkSessionExpiration, 60000);
 *
 * @returns {void}
 */
setInterval(checkSessionExpiration, 60000);

const serverOnlineTime = Date.now() / 1000; // Current timestamp in milliseconds

// create client wpp
wppconnect
    .create({
        session: BOT_NAME,
        tokenStore: myTokenStore,
        deviceSyncTimeout: 0,
        autoClose: false, // set waktu auto stop kode pairing
        phoneNumber: BOT_NUMBER,
        catchLinkCode: (str) => {
            console.error('Code: ' + str);
            // Tambahkan lebih banyak kode log jika perlu
        },
        protocolTimeout: 120000, // set waktu timeout dari proses komunikasi
        puppeteerOptions: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            // Tambahkan opsi puppeteer lain di sini jika diperlukan
        }
    })
    .then((client) => {
        // Tambahkan kode yang berhubungan dengan client di sini
        console.error('Client Running...');
        start(client)
    })
    .catch((error) => {
        console.error('Error:', error);
    });



async function start(client) {
    client.onMessage(async (message) => {
        if (message.isGroupMsg) {
            return
        }
        if (message.timestamp < serverOnlineTime) {
            return
        }

        if(message.type ==='e2e_notification'){
            return
        }
        // console.log("client == ", client);
        console.log("message == ", message);
        // console.log("session == ", SESSION_STATUS);
        const userPhoneNumber = message.from;
        const botPhoneNumber = message.to;
        const messageTimestamp = message.timestamp;

        let responseText = "";

        // Handle text messages
        if (message.type === 'chat') {
            // Handle unsupported message types
            if (message.type !== 'chat') {
                await sendWhatsAppMessage(client, userPhoneNumber, UNSUPPORTED_TYPE_MESSAGE);
                // unsupported types message but still not in session
                if (!(SESSION_STATUS[userPhoneNumber])) {
                    SESSION_STATUS[userPhoneNumber] = { client: client, lastActive: Date.now(), optionSession: "0", businessPhoneNumberId: botPhoneNumber };
                    await sendWhatsAppMessage(client, userPhoneNumber, HOME_MESSAGE + FOOTER);
                }
                SESSION_STATUS[userPhoneNumber] = {
                    ...SESSION_STATUS[userPhoneNumber],
                    lastActive: Date.now(),
                };
                return;
            }
        } else {
            await sendWhatsAppMessage(client, userPhoneNumber, UNSUPPORTED_TYPE_MESSAGE);
            return;
        }

        // Handle First Message
        if ((messageTimestamp > serverOnlineTime) && (!(SESSION_STATUS[userPhoneNumber]))) {
            SESSION_STATUS[userPhoneNumber] = { client: client, lastActive: Date.now(), optionSession: "0", businessPhoneNumberId: botPhoneNumber };
            await sendWhatsAppMessage(client, userPhoneNumber, MENU_STRUCTURE["0"].message);
            return;
        }

        // Check if message is valid and the user is in session
        if (messageTimestamp > serverOnlineTime && SESSION_STATUS[userPhoneNumber]) {
            const userMessage = message.body.trim().toLowerCase();
            const isValidOption = VALID_OPTIONS.includes(userMessage);
            const { optionSession } = SESSION_STATUS[userPhoneNumber];
            SESSION_STATUS[userPhoneNumber].lastActive = Date.now();
            const currentMenu = MENU_STRUCTURE[SESSION_STATUS[userPhoneNumber].optionSession];

            // back to main menu
            if (userMessage === "0") {
                SESSION_STATUS[userPhoneNumber] = {
                    lastActive: Date.now(),
                    optionSession: "0",
                    businessPhoneNumberId: botPhoneNumber
                };
                responseText = MENU_STRUCTURE["0"].message;

                // main code when in session
            } else if (optionSession && optionSession != "0") {
                if (optionSession === "6") {
                    await client.startTyping(userPhoneNumber);
                    responseText = await handleGeminiResponse(userMessage);
                    await client.stopTyping(userPhoneNumber);
                }
                if (currentMenu && optionSession != "6") {
                    if (currentMenu == MENU_STRUCTURE["1.7"]) {
                        SESSION_STATUS[userPhoneNumber] = {
                            ...SESSION_STATUS[userPhoneNumber],
                            lastActive: Date.now(),
                        };
                        return
                    }
                    if (currentMenu.options?.[`${SESSION_STATUS[userPhoneNumber]?.optionSession}.${userMessage}`]) {
                        if (userMessage === "99") {
                            SESSION_STATUS[userPhoneNumber].optionSession = SESSION_STATUS[userPhoneNumber].optionSession.split('.').slice(0, -1).join('.') || "0";
                        } else {
                            SESSION_STATUS[userPhoneNumber].optionSession = `${SESSION_STATUS[userPhoneNumber].optionSession}.${userMessage}`;
                        }
                        const newMenu = MENU_STRUCTURE[SESSION_STATUS[userPhoneNumber].optionSession];
                        if (newMenu == MENU_STRUCTURE["1.7"]) {
                            const now = new Date();
                            const utcHour = now.getUTCHours(); // Jam UTC
                            const utcMinute = now.getUTCMinutes(); // Menit UTC

                            const gmtOffset = 7; // Offset untuk GMT+7
                            const currentHour = (utcHour + gmtOffset) % 24; // Sesuaikan dengan GMT+7
                            const currentMinute = utcMinute;

                            console.log("Current Hour (GMT+7):", currentHour);
                            console.log("Current Minute (GMT+7):", currentMinute);

                            const startHour = 8;
                            const endHour = 15;
                            const endMinute = 30;

                            const isWorkHour =
                                (currentHour > startHour && currentHour < endHour) || // Jam berada di antara 8:00 dan 15:00
                                (currentHour === startHour && currentMinute >= 0) || // Tepat pada jam 8:00 atau setelahnya
                                (currentHour === endHour && currentMinute <= endMinute); // Tepat pada jam 15:00 hingga 15:30
                            (currentHour === endHour && currentMinute <= endMinute); // Tepat pada jam 15:00 hingga 15:30

                            if (isWorkHour) {
                                console.log("It's within working hours.");
                                SESSION_STATUS[userPhoneNumber] = {
                                    ...SESSION_STATUS[userPhoneNumber],
                                    lastActive: Date.now(),
                                };
                                if (userMessage === "99") {
                                    SESSION_STATUS[userPhoneNumber].optionSession = SESSION_STATUS[userPhoneNumber].optionSession.split('.').slice(0, -1).join('.') || "0";
                                }
                                // Additional logic for working hours
                            } else {
                                console.log("It's outside working hours.");
                                await sendWhatsAppMessage(client, userPhoneNumber, NOT_IN_WORKING_HOURS);
                                SESSION_STATUS[userPhoneNumber] = {
                                    ...SESSION_STATUS[userPhoneNumber],
                                    lastActive: Date.now(),
                                };
                                return
                                // Additional logic for outside working hours
                            }
                        }
                        // Check if newMenu's message is the same as HOME_MESSAGE + FOOTER
                        responseText = newMenu
                            ? (newMenu.message == (HOME_MESSAGE + FOOTER) ? newMenu.message : (newMenu.message + BACK_TO_MENU))
                            : WRONG_COMMAND + MENU_STRUCTURE[SESSION_STATUS[userPhoneNumber].optionSession].message + BACK_TO_MENU;
                    } else {
                        responseText = WRONG_COMMAND + MENU_STRUCTURE[SESSION_STATUS[userPhoneNumber].optionSession].message + BACK_TO_MENU;
                    }
                }
                // first valid message
            } else if (isValidOption) {
                SESSION_STATUS[userPhoneNumber].optionSession = userMessage;
                if (userMessage === "6") {
                    responseText = OPTION_AI + BACK_TO_MENU;
                    await sendWhatsAppMessage(client, userPhoneNumber, responseText);
                    SESSION_STATUS[userPhoneNumber] = {
                        ...SESSION_STATUS[userPhoneNumber],
                        lastActive: Date.now(),
                        optionSession: "6"
                    };
                    return
                } else {
                    responseText = MENU_STRUCTURE[SESSION_STATUS[userPhoneNumber].optionSession].message + BACK_TO_MENU
                }
            } else {
                responseText = WRONG_COMMAND + HOME_MESSAGE + FOOTER;
                SESSION_STATUS[userPhoneNumber] = {
                    ...SESSION_STATUS[userPhoneNumber],
                    lastActive: Date.now(),
                    optionSession: "0"
                };
            }
            // send ai response and follow up another "Kirim pertanyaan untuk AI:"
            if (SESSION_STATUS[userPhoneNumber].optionSession == "6") {
                await sendWhatsAppMessage(client, userPhoneNumber, responseText)
                await sendWhatsAppMessage(client, userPhoneNumber, OPTION_AI + BACK_TO_MENU)
                SESSION_STATUS[userPhoneNumber] = {
                    ...SESSION_STATUS[userPhoneNumber],
                    lastActive: Date.now(),
                };
                // just send
            } else {
                await sendWhatsAppMessage(client, userPhoneNumber, responseText);
                SESSION_STATUS[userPhoneNumber] = {
                    ...SESSION_STATUS[userPhoneNumber],
                    lastActive: Date.now(),
                };
            }
        }
    });
}

// send func
async function sendWhatsAppMessage(client, to, message) {
    try {
        await markMessageAsSeen(client, to);
        await client.startTyping(to);
        await client.sendText(to, message);
        await client.stopTyping(to);
    } catch (error) {
        console.error(`Failed to send message to ${to}:`, error.message);
    }
}

// blue mark func
async function markMessageAsSeen(client, messageId) {
    try {
        await client.sendSeen(messageId);
    } catch (error) {
        console.error(`Failed to mark message ${messageId} as seen:`, error.message);
    }
}