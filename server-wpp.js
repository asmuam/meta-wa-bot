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
import { MAX_MESSAGES_PER_MINUTE, SPAM_THRESHOLD, HOME_MESSAGE, BACK_ONLINE, WRONG_COMMAND, OPTION_ONE, BACK_TO_MENU, OPTION_TWO, OPTION_FOUR, APP, VALID_OPTIONS, WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, SESSION_STATUS, PEGAWAI_NUMBERS, CONNECTED_WITH_PEGAWAI, SESSION_LIMIT, NO_AVAILABLE_PEGAWAI, UNSUPPORTED_TYPE_MESSAGE, SESSION_EXPIRED_MESSAGE, SESSION_QNA_EXPIRED_MESSAGE, BOT_ERROR, BOT_NUMBER, BOT_NAME, MENU_STRUCTURE, NOT_IN_WORKING_HOURS, OPTION_AI, FOOTER } from "./const.js";
import { isPegawaiPhoneNumberInSession } from "./func.js";
import { handleGeminiResponse } from "./aiHandlers.js";
import { handlePSTResponse, pegawaiBroadcast, sendMessageToPegawai } from "./pegawaiHandlers.js"

// Inisialisasi array availablePegawai dengan nomor pegawai
let availablePegawai = PEGAWAI_NUMBERS.map(pegawai => pegawai.number);
// Inisialisasi Online Time
let serverOnlineTime = 0;
// Simpan status pengguna yang sudah menerima balasan
// Ini untuk mengakali jika whatsapp mengirim webhook dari pesan2 lama yg dikirim user sebelum server aktif
// sebenarnya ada di dokumentasi tetapi untuk kemudahan dilakukan cara ini meskipun masih terdapat flaws karena webhook kadang memiliki delay yg lama
let repliedUsers = {};
let userActivity = {}; // To track user activity and warnings

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


wppconnect
    .create({
        session: BOT_NAME, // Pass the name of the client you want to start the bot
        phoneNumber: BOT_NUMBER,
        catchLinkCode: (str) => console.log('Code: ' + str),
        protocolTimeout: 60000, // Set the timeout to 60 seconds or adjust as needed
    })
    .then((client) => start(client))
    .catch((error) => console.log(error));


async function start(client) {
    client.onMessage(async (message) => {
        if (message.isGroupMsg) {
            return
        }
        // console.log("client == ", client);
        // console.log("message == ", message);
        // console.log("session == ", SESSION_STATUS);
        const userPhoneNumber = message.from;
        const botPhoneNumber = message.to;
        const messageTimestamp = message.timestamp;
        const isBlocked = await handleSpamProtection(botPhoneNumber, userPhoneNumber, message);

        let responseText = "";

        // Handle spam protection
        // if (isBlocked) {
        //     return;
        // }

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
            await sendWhatsAppMessage(client, userPhoneNumber, BOT_ERROR);
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
                if (currentMenu && optionSession!="6") {
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
                            const startHour = 7;
                            const endHour = 16;
                            const endMinute = 0;
                        
                            const currentHour = now.getHours();
                            const currentMinute = now.getMinutes();
                        
                            const isWorkHour = (currentHour > startHour && currentHour < endHour) ||
                                               (currentHour === startHour && currentMinute >= 0) ||
                                               (currentHour === endHour && currentMinute <= endMinute);
                        
                            if (isWorkHour) {
                                console.log("It's within working hours.");
                                SESSION_STATUS[userPhoneNumber] = {
                                    ...SESSION_STATUS[userPhoneNumber],
                                    lastActive: Date.now(),
                                };
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

async function sendWhatsAppMessage(client, to, message) {
    try {
        await markMessageAsSeen(client, to);

        // Tunggu sejenak sebelum memulai "typing"
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 detik, sesuaikan jika perlu

        await client.startTyping(to);

        // Tunggu 2 detik sebelum mengirim pesan
        await new Promise(resolve => setTimeout(resolve, 2000));

        await client.sendText(to, message);

        await client.stopTyping(to);
    } catch (error) {
        console.error(`Failed to send message to ${to}:`, error.message);
    }
}
async function markMessageAsSeen(client, messageId) {
    try {
        await client.sendSeen(messageId);
    } catch (error) {
        console.error(`Failed to mark message ${messageId} as seen:`, error.message);
    }
}
async function handleSpamProtection(businessPhoneNumberId, recipient, message) {
    // Implement your spam protection logic here
    if (!message) {
        console.log("No messages found, skipping spam protection."); // if using webhooks it will ignore statuses webhook
        return false;
    }

    // Initialize user data if not present
    if (!userActivity[recipient]) {
        userActivity[recipient] = { messageCount: 0, lastMessageTime: Date.now(), warnings: 0 };
        console.log(`Initialized user data for ${recipient}.`);
    }

    const currentTime = Date.now();
    const userData = userActivity[recipient];

    // Reset message count if more than a minute has passed
    if (currentTime - userData.lastMessageTime > 60000) {  // 1 minute in milliseconds
        userData.messageCount = 0;
        console.log(`Reset message count for ${recipient} due to inactivity.`);
    }

    userData.messageCount += 1;
    userData.lastMessageTime = currentTime;

    console.log(`User ${recipient} has sent ${userData.messageCount} messages.`);

    // Check for spam behavior
    if (userData.messageCount > MAX_MESSAGES_PER_MINUTE) {
        userData.warnings += 1;
        userData.messageCount = 0; // Reset the message count after a warning

        console.log(`User ${recipient} exceeded message limit. Warnings: ${userData.warnings}`);

        if (userData.warnings >= SPAM_THRESHOLD) {
            // Block user or take action (e.g., notify admin)
            try {
                await sendWhatsAppMessage(businessPhoneNumberId, recipient, "You have been blocked due to excessive messaging.");
                console.log(`User ${recipient} has been blocked.`);
            } catch (error) {
                console.error("Failed to send block message:", error);
            }
            // Optionally, add the user to a blacklist
            return true;
        } else {
            // Send warning message
            try {
                await sendWhatsAppMessage(businessPhoneNumberId, recipient, `Warning: Please reduce the number of messages. You have ${SPAM_THRESHOLD - userData.warnings} warnings left.`);
                console.log(`Warning sent to user ${recipient}.`);
            } catch (error) {
                console.error("Failed to send warning message:", error);
            }
        }
    }
    return false; // Example return value
}

