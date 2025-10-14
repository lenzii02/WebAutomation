// Membuat variabel untuk mengisi baris untuk segitga siku2 nya dengan 4 baris
let baris = 4;


// Perullangan loop untuk setiap baris indeks sama dengan 1 setiap baris ditambah 1 dari sebelumnya
for (let i = 1; i <= baris; i++){
    let bintang = ""; // loop pertama dengan mengosongkan variabel bintang
// perulangan loop kedua mendefinisikan jika jumlah bintang per baris adalah nomor baris sebelumnya
for (let j = 1; j <= i; j++) {
        bintang = bintang + "*"; // menambahkan bintang dengan jumlah bintang tiap barisnya
    }
// Menampilkan hasil dari looping
console.log(bintang);
}
