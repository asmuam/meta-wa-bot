// pegawaisHandler.js
import dotenv from 'dotenv';
import axios from 'axios';
import { GRAPH_API_TOKEN, BROADCAST_PEGAWAI } from './const.js';
dotenv.config();

// webhook version
// /**
//  * Sends a message to a staff member (pegawai) via WhatsApp.
//  * 
//  * @param {string} businessPhoneNumberId - The ID of the business phone number.
//  * @param {string} pegawaiNumber - The phone number of the staff member.
//  * @param {string} userMessage - The message to be sent to the staff member.
//  * @param {string} userPhoneNumber - The phone number of the user initiating the message.
//  * @returns {Promise<void>} - A promise that resolves when the message is sent or rejects if an error occurs.
//  */
// export async function sendMessageToPegawai(businessPhoneNumberId, pegawaiNumber, userMessage, userPhoneNumber) {
//   let data;

//   // Prepare the data object based on the userMessage
//   if (userMessage === "4") {
//     userMessage = BROADCAST_PEGAWAI;
//     data = {
//       messaging_product: "whatsapp",
//       to: pegawaiNumber,
//       type: 'interactive',
//       interactive: {
//         header: {
//           type: 'text',
//           text: "TANGGAPI SESI TANYA JAWAB?"
//         },
//         type: 'button',
//         body: {
//           text: userMessage
//         },
//         action: {
//           buttons: [
//             {
//               type: 'reply',
//               reply: {
//                 id: `respond_${userPhoneNumber}`,
//                 title: 'Mulai Sesi!'
//               }
//             }
//           ]
//         }
//       }
//     };
//   } else {
//     data = {
//       messaging_product: "whatsapp",
//       to: pegawaiNumber,
//       text: { body: userMessage }, // Correct structure for text messages
//     };
//   }

//   // Define the API endpoint and headers
//   const url = `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/messages`;
//   const headers = {
//     Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//     "Content-Type": "application/json",
//   };

//   try {
//     // Send the message using axios
//     const response = await axios.post(url, data, { headers });
//     console.log(`Message sent successfully to ${pegawaiNumber}. Response:`, response.data);
//   } catch (error) {
//     // Log detailed error information
//     console.error(`Error sending message to ${pegawaiNumber}:`);
//     console.error(`Message Content: ${userMessage}`);
//     console.error("Error details:", error.response ? error.response.data : error.message);
//   }
// }

// /**
//  * Sends a broadcast message to all available staff members via WhatsApp.
//  * 
//  * Notes:
//  * - Messages are only sent to staff members if they have interacted with the bot
//  *   within the last 24 hours. Please ensures that staff have interacted with the bot
//  *   at least once within this period.
//  * - An alternative is to use templates provided by Facebook, but note there are 
//  *   limitations for free-tier versions.
//  * 
//  * @param {string} businessPhoneNumberId - The ID of the business phone number.
//  * @param {Array<string>} availablePegawai - List of available staff phone numbers.
//  * @param {string} userMessage - The message to be sent to the staff members.
//  * @param {string} userPhoneNumber - The phone number of the user sending the message.
//  * @returns {Promise<boolean>} - Returns true if all messages were sent successfully, false otherwise.
//  */
// export async function pegawaiBroadcast(businessPhoneNumberId, availablePegawai, userMessage, userPhoneNumber) {
//   if (availablePegawai && availablePegawai.length > 0) {
//     // Send broadcast to all available staff members
//     for (const number of availablePegawai) {
//       try {
//         // Attempt to send the message
//         await sendMessageToPegawai(businessPhoneNumberId, number, userMessage, userPhoneNumber);
//         console.log(`Message sent successfully to ${number}`);
//       } catch (error) {
//         // Log error details and indicate failure
//         console.error(`Failed to send message to ${number}:`, error.message);
//         // If sending fails, return false immediately
//         return false;
//       }
//     }
//     // All messages were sent successfully
//     return true;
//   } else {
//     // No available staff members to send the message to
//     console.log('No available staff members to send the message to.');
//     return false;
//   }
// }

// export function handlePSTResponse() {
// }


// WPP version
/**
 * Sends a message to a staff member (pegawai) via WhatsApp.
 * 
 * @param {string} businessPhoneNumberId - The ID of the business phone number.
 * @param {string} pegawaiNumber - The phone number of the staff member.
 * @param {string} userMessage - The message to be sent to the staff member.
 * @param {string} userPhoneNumber - The phone number of the user initiating the message.
 * @returns {Promise<void>} - A promise that resolves when the message is sent or rejects if an error occurs.
 */
export async function sendMessageToPegawai(businessPhoneNumberId, pegawaiNumber, userMessage, userPhoneNumber) {
  let data;

  // Prepare the data object based on the userMessage
  if (userMessage === "4") {
    userMessage = BROADCAST_PEGAWAI;
    data = {
      messaging_product: "whatsapp",
      to: pegawaiNumber,
      type: 'interactive',
      interactive: {
        header: {
          type: 'text',
          text: "TANGGAPI SESI TANYA JAWAB?"
        },
        type: 'button',
        body: {
          text: userMessage
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: `respond_${userPhoneNumber}`,
                title: 'Mulai Sesi!'
              }
            }
          ]
        }
      }
    };
  } else {
    data = {
      messaging_product: "whatsapp",
      to: pegawaiNumber,
      text: { body: userMessage }, // Correct structure for text messages
    };
  }

  // Define the API endpoint and headers
  const url = `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/messages`;
  const headers = {
    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    // Send the message using axios
    const response = await axios.post(url, data, { headers });
    console.log(`Message sent successfully to ${pegawaiNumber}. Response:`, response.data);
  } catch (error) {
    // Log detailed error information
    console.error(`Error sending message to ${pegawaiNumber}:`);
    console.error(`Message Content: ${userMessage}`);
    console.error("Error details:", error.response ? error.response.data : error.message);
  }
}

/**
 * Sends a broadcast message to all available staff members via WhatsApp.
 * 
 * Notes:
 * - Messages are only sent to staff members if they have interacted with the bot
 *   within the last 24 hours. Please ensures that staff have interacted with the bot
 *   at least once within this period.
 * - An alternative is to use templates provided by Facebook, but note there are 
 *   limitations for free-tier versions.
 * 
 * @param {string} businessPhoneNumberId - The ID of the business phone number.
 * @param {Array<string>} availablePegawai - List of available staff phone numbers.
 * @param {string} userMessage - The message to be sent to the staff members.
 * @param {string} userPhoneNumber - The phone number of the user sending the message.
 * @returns {Promise<boolean>} - Returns true if all messages were sent successfully, false otherwise.
 */
export async function pegawaiBroadcast(businessPhoneNumberId, availablePegawai, userMessage, userPhoneNumber) {
  if (availablePegawai && availablePegawai.length > 0) {
    // Send broadcast to all available staff members
    for (const number of availablePegawai) {
      try {
        // Attempt to send the message
        await sendMessageToPegawai(businessPhoneNumberId, number, userMessage, userPhoneNumber);
        console.log(`Message sent successfully to ${number}`);
      } catch (error) {
        // Log error details and indicate failure
        console.error(`Failed to send message to ${number}:`, error.message);
        // If sending fails, return false immediately
        return false;
      }
    }
    // All messages were sent successfully
    return true;
  } else {
    // No available staff members to send the message to
    console.log('No available staff members to send the message to.');
    return false;
  }
}

export function handlePSTResponse() {
}
