/**
 * A map that returns a default value for keys that are not present.
 * @extends Map
 */
class DefaultMap extends Map {
    /**
     * Creates a new DefaultMap instance.
     * @param {*} defaultValue - The default value to be returned for keys that are not present.
     */
    constructor(defaultValue) {
        super();
        this.defaultValue = defaultValue;
    }

    /**
     * Retrieves the value associated with the specified key.
     * If the key is not present, the default value is returned.
     * @param {*} key - The key to retrieve the value for.
     * @returns {*} The value associated with the key, or the default value if the key is not present.
     */
    get(key) {
        if (this.has(key)) {
            return super.get(key);
        } else {
            return this.defaultValue;
        }
    }
}

/**
 * Represents a histogram that counts the frequency of letters in a given text.
 * @class
 */
class Histogram {
    constructor() {
        this.letterCount = new DefaultMap(0);
        this.totalLetters = 0;
    }

    /**
     * Adds text to the letter count.
     * @param {string} text - The text to be added.
     * @param {boolean} [useLowerCase=false] - Indicates whether to convert the text to lowercase before counting.
     */
    add(text, useLowerCase = false) {
        if (useLowerCase) {
            text = text.replace(/\s/g, "").toLowerCase();
        } else {
            text = text.replace(/\s/g, "").toUpperCase();
        }
        for (let character of text) {
            let count = this.letterCount.get(character);
            this.letterCount.set(character, count + 1);
            this.totalLetters++;
        }
    }

    /**
     * Returns a string representation of the object.
     * @param {number} [treshold=0] - The threshold value for filtering entries.
     * @returns {string} The string representation of the object.
     */
    toString(treshold = 0) {
        let entries = [...this.letterCount];
        entries.sort((a, b) => {
            if (a[1] === b[1]) {
                return a[0] < b[0] ? -1 : 1;
            } else {
                return b[1] - a[1];
            }
        });

        for (let entry of entries) {
            entry[1] = entry[1] / this.totalLetters * 100;
        }

        entries = entries.filter(entry => entry[0] !== " " && entry[0] !== "\n");
        entries = entries.filter(entry => entry[1] >= treshold);

        let lines = entries.map(
            ([l, n]) => `${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`
        );

        return lines.join("\n");
    }
}


/**
 * Reads input from standard input and creates a histogram.
 * @async
 * @returns {Histogram} The histogram object.
 */
async function histogramFromStdin() {
    process.stdin.setEncoding("utf-8");
    let histogram = new Histogram();
    for await (let chunk of process.stdin) {
        histogram.add(chunk, true);
    }
    return histogram;
}

// Call the function to generate the histogram.
histogramFromStdin().then(histogram => {console.log(histogram.toString());});
