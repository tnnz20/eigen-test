/*
2. Diberikan contoh sebuah kalimat, silahkan cari kata terpanjang dari kalimat 
tersebut, jika ada kata dengan panjang yang sama silahkan ambil salah satu
*/

const sentence = "Saya sangat senang mengerjakan soal algoritma";

function longestWord(sentence) {
    const words = sentence.split(" ");
    let longestWord = words[0];
    for (let i = 1; i < words.length; i++) {
        if (words[i].length > longestWord.length) {
            longestWord = words[i];
        }
    }
    return `${longestWord} : ${longestWord.length}`;
}

console.log("Longest word: ", longestWord(sentence));
