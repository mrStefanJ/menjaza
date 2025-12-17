// Password:
// - minimum 6 karaktera
// - najmanje 1 broj
// - najmanje 1 specijalni karakter
const passwordRegex =
    /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/;

// Dozvoljava:
// - latinicu
// - srpska slova: č ć ž š đ (mala i velika)
const textOnlyRegex =
  /^[A-Za-zčćžšđČĆŽŠĐ]+$/;

// Email (standardni, dovoljno restriktivan)
const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {
  passwordRegex,
  textOnlyRegex,
  emailRegex
};
