import { PEGAWAI_NUMBERS } from "./const.js";

export function isPegawaiPhoneNumberInSession(session, nomorPegawai) {
    // Iterate through each session
    for (const key in session) {
      if (session[key].pegawaiPhoneNumber === nomorPegawai) {
        return true; // Found the pegawaiPhoneNumber
      }
    }
    return false; // pegawaiPhoneNumber not found in any session
  }

/**
* Get the name of the staff member given their phone number.
* @param {string} number - The phone number of the staff member.
* @returns {string | null} - The name of the staff member or null if not found.
*/
export function getStaffNameByNumber(number) {
 // Find the staff member with the given number
 const staff = PEGAWAI_NUMBERS.find(pegawai => pegawai.number === number);
 // Return the name if found, otherwise return null
 return staff ? staff.name : null;
}

/**
* Get the user phone number (key) from the session object by pegawaiPhoneNumber.
* @param {string} pegawaiPhoneNumber - The phone number of the staff member.
* @returns {string | null} - The user phone number (key) or null if not found.
*/
export function getUserPhoneNumberInSession(session, pegawaiPhoneNumber) {
 // Iterate over the keys in the SESSION object
 for (const userPhoneNumber in session) {
   // Check if the pegawaiPhoneNumber matches
   if (session[userPhoneNumber].pegawaiPhoneNumber === pegawaiPhoneNumber) {
     return userPhoneNumber;
   }
 }
 // Return null if no match is found
 return null;
}
