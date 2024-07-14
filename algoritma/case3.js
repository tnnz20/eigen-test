function countOccurrences(input, query) {
    const wordCount = new Map();

    for (const word of input) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }

    const result = query.map((word) => wordCount.get(word) || 0);

    return result;
}

const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERY = ["bbb", "ac", "dz"];

const output = countOccurrences(INPUT, QUERY);
console.log(output);
