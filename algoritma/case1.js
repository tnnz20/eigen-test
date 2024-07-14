/*
1.  Terdapat string "NEGIE1", silahkan reverse alphabet nya 
    dengan angka tetap diakhir kata Hasil = "EIGEN1"
*/

function reverseAlphabet(str) {
    const letters = str.match(/[A-Za-z]+/)[0];
    const number = str.match(/\d+/)[0];

    // const reversedLetters = letters.split("").reverse().join("");

    // let reversedLetters = "";
    // for (let i = letters.length - 1; i >= 0; i--) {
    //     reversedLetters += letters[i];
    // }

    let reversedLetters = "";
    for (const element of letters) {
        reversedLetters = element + reversedLetters;
    }

    return reversedLetters + number;
}

const text = "NEGIE1";
console.log("Before reversed: ", text);
console.log("After reversed: ", reverseAlphabet(text));
