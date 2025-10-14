const { kalkulator } = require("./rumus.js");
const readline = require ("readline");

// Membuat input interface untuk user
const inputUser = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Memasukkan angka untuk dilakukannya perhitungan
inputUser.question("Masukkan angka pertama: ", (angka1) => {
  inputUser.question("Masukkan angka kedua: ", (angka2) => {
    inputUser.question("Masukkan operator (+, -, *, /): ", (operator) => {

      // Panggil fungsi kalkulator dari rumus.js
      const hasil = kalkulator(
        parseFloat(angka1),
        parseFloat(angka2),
        operator
      );

      console.log(`Hasil: ${hasil}`);

      // Otomatis close setelah hasil muncul
      inputUser.close();
    });
  });
});
