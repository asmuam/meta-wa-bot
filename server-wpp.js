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
import { MAX_MESSAGES_PER_MINUTE, SPAM_THRESHOLD, HOME_MESSAGE, BACK_ONLINE, WRONG_COMMAND, OPTION_ONE, BACK_TO_MENU, OPTION_TWO, OPTION_THREE, OPTION_FOUR, APP, VALID_OPTIONS, WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, SESSION_STATUS, PEGAWAI_NUMBERS, CONNECTED_WITH_PEGAWAI, SESSION_LIMIT, NO_AVAILABLE_PEGAWAI, UNSUPPORTED_TYPE_MESSAGE, SESSION_EXPIRED_MESSAGE, SESSION_QNA_EXPIRED_MESSAGE, BOT_ERROR } from "./const.js";
import { isPegawaiPhoneNumberInSession } from "./func.js";
import { handleStatBoy, handleStatGen } from "./statsHandlers.js";
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


wppconnect
    .create({
        session: 'boyolaliBot', //Pass the name of the client you want to start the bot
        phoneNumber: '6285163513267',
        catchLinkCode: (str) => console.log('Code: ' + str),
    })
    .then((client) => start(client))
    .catch((error) => console.log(error));

async function start(client) {
    client.onMessage(async (message) => {
        if (message.isGroupMsg) {
            return
        }
        console.log("client == ", client);
        console.log("message == ", message);
        console.log("session == ", SESSION_STATUS);
        const userPhoneNumber = message.from;
        const botPhoneNumber = message.to;
        const messageTimestamp = message.timestamp;
        const isBlocked = await handleSpamProtection(botPhoneNumber, userPhoneNumber, message);

        let responseText = "";
        let isBroadcast = false; // Default to false unless a broadcast is initiated

        // Handle spam protection
        if (isBlocked) {
            return;
        }

        // Handle button replies
        if (message.type === 'button_reply') {
            const { id: buttonId } = message;
            const uniqueId = buttonId.split('_')[1];

            console.log(`Button ID: ${buttonId}`);
            console.log(`Extracted Unique ID: ${uniqueId}`);

            SESSION_STATUS[uniqueId] = {
                lastActive: Date.now(),
                optionSession: "4",
                businessPhoneNumberId: botPhoneNumber,
                pegawaiPhoneNumber: userPhoneNumber
            };

            availablePegawai = availablePegawai.filter(number => number !== userPhoneNumber);

            console.log(`Updated session status for user ID ${uniqueId}:`, SESSION_STATUS[uniqueId]);
            console.log(`Updated available staff list:`, availablePegawai);

            try {
                await sendWhatsAppMessage(client, uniqueId, `${CONNECTED_WITH_PEGAWAI}${getStaffNameByNumber(userPhoneNumber)}`);
                console.log(`Confirmation message sent to user ID ${uniqueId}.`);
            } catch (error) {
                console.error(`Failed to send confirmation message to user ID ${uniqueId}:`, error.message);
            }

            return;
        }

        // Handle text messages
        if (message.type === 'chat') {
            await markMessageAsSeen(client, userPhoneNumber);

            // Handle unsupported message types
            if (message.type !== 'chat') {
                await sendWhatsAppMessage(client, userPhoneNumber, UNSUPPORTED_TYPE_MESSAGE);
                if (!(SESSION_STATUS[userPhoneNumber])) {
                    await sendWhatsAppMessage(client, userPhoneNumber, HOME_MESSAGE);
                }
                return;
            }
        } else if (message.type === 'status') {
            return;
        } else {
            return;
        }

        // Handle First Message
        if ((messageTimestamp > serverOnlineTime) && (!(SESSION_STATUS[userPhoneNumber]))) {
            const userMessage = message.body.trim().toLowerCase();
            // menangani pesan yang dikirim pegawai agar diteruskan ke penanya, percakapan pegawai sbg CS akan selalu dianggap first message karena sesi pegawai dgn bot tdk dibuat
            if (isPegawaiPhoneNumberInSession(SESSION_STATUS, userPhoneNumber)) {
                responseText = userMessage;
                await sendWhatsAppMessage(client, getUserPhoneNumberInSession(SESSION_STATUS, userPhoneNumber), responseText);
                return;
            }
            SESSION_STATUS[userPhoneNumber] = { lastActive: Date.now(), optionSession: "0", businessPhoneNumberId: botPhoneNumber };
            await sendWhatsAppMessage(client, userPhoneNumber, HOME_MESSAGE);
            return;
        }

        // Check if message is valid and the user is in session
        if (messageTimestamp > serverOnlineTime && SESSION_STATUS[userPhoneNumber]) {
            const userMessage = message.body.trim().toLowerCase();
            const isValidOption = VALID_OPTIONS.includes(userMessage);
            const { optionSession } = SESSION_STATUS[userPhoneNumber];
            SESSION_STATUS[userPhoneNumber].lastActive = Date.now();

            if (userMessage === "0") {
                SESSION_STATUS[userPhoneNumber] = {
                    lastActive: Date.now(),
                    optionSession: "0",
                    businessPhoneNumberId: botPhoneNumber
                };
                responseText = HOME_MESSAGE;
            } else if (optionSession && optionSession != "0") {
                if (optionSession === "1") {
                    responseText = await handleStatBoy(userMessage);
                } else if (optionSession === "2") {
                    responseText = await handleStatGen(userMessage);
                } else if (optionSession === "3") {
                    responseText = await handleGeminiResponse(userMessage);
                } else if (optionSession === "4") {
                    await sendMessageToPegawai(client, SESSION_STATUS[userPhoneNumber].pegawaiPhoneNumber, userMessage, userPhoneNumber);
                    return;
                }
            } else if (isValidOption) {
                SESSION_STATUS[userPhoneNumber].optionSession = userMessage;
                if (userMessage === "1") {
                    responseText = OPTION_ONE + BACK_TO_MENU;
                } else if (userMessage === "2") {
                    responseText = OPTION_TWO + BACK_TO_MENU;
                } else if (userMessage === "3") {
                    responseText = OPTION_THREE + BACK_TO_MENU;
                } else if (userMessage === "4") {
                    responseText = OPTION_FOUR + BACK_TO_MENU;
                    isBroadcast = await pegawaiBroadcast(client, availablePegawai, userMessage, userPhoneNumber);
                }
            } else {
                responseText = WRONG_COMMAND + HOME_MESSAGE;
                SESSION_STATUS[userPhoneNumber] = {
                    ...SESSION_STATUS[userPhoneNumber],
                    lastActive: Date.now(),
                    optionSession: "0"
                };
            }

            await sendWhatsAppMessage(client, userPhoneNumber, responseText);

            if (!isBroadcast && userMessage === "4") {
                await sendWhatsAppMessage(client, userPhoneNumber, NO_AVAILABLE_PEGAWAI + HOME_MESSAGE);
                SESSION_STATUS[userPhoneNumber] = {
                    ...SESSION_STATUS[userPhoneNumber],
                    lastActive: Date.now(),
                    optionSession: "0"
                };
            }
        }
    });
}

// Define helper functions

async function sendWhatsAppMessage(client, to, message) {
    try {
        await client.startTyping(to);
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
        console.log("No messages found, skipping spam protection.");
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

// Add your remaining helper functions here (handleStatBoy, handleStatGen, handleGeminiResponse, sendMessageToPegawai, etc.)

