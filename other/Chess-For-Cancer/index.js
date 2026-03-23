
const FOLDER_PATHS = [
    "alpha",
    "game_room",
    "glass",
    "neo",
    "newspaper",
    "wood",
    "icy"
];

const FILE_NAMES = ["bk.png", "bn.png", "bp.png", "bq.png", "br.png", "wk.png", "wn.png", "wp.png", "wq.png", "wr.png"];

/**
 * Picks a random item from an array.
 * @param {Array<T>} arr The array to pick from.
 * @returns {T} A random item from the array.
 * @template T
 */
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const setRandomImageSources = () => {
    const images = document.querySelectorAll('.random-piece');
    images.forEach(img => {
        const randomFolder = getRandomItem(FOLDER_PATHS);
        const randomFile = getRandomItem(FILE_NAMES);
        img.src = `images/${randomFolder}/${randomFile}`;
    });
};

window.addEventListener('blur', () => {
    const favicon = document.querySelector("link[rel='icon']");
    const randomFolder = getRandomItem(FOLDER_PATHS);
    const randomFile = getRandomItem(FILE_NAMES);
    favicon.href = `images/${randomFolder}/${randomFile}`;
});

window.addEventListener('focus', () => {
    const favicon = document.querySelector("link[rel='icon']");
    favicon.href = "icon.png";
});

// Set images on initial page load
document.addEventListener('DOMContentLoaded', setRandomImageSources);
