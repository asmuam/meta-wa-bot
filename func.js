export function isPegawaiPhoneNumberInSession(session, nomorPegawai) {
    // Iterate through each session
    for (const key in session) {
      if (session[key].pegawaiPhoneNumber === nomorPegawai) {
        return true; // Found the pegawaiPhoneNumber
      }
    }
    return false; // pegawaiPhoneNumber not found in any session
  }