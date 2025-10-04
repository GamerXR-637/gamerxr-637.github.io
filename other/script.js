window.addEventListener('DOMContentLoaded', () => {
    const copyright = document.getElementById('copyright');
    if (copyright) {
        copyright.appendChild(document.createTextNode(new Date().getFullYear()));
    }
});

const originalTitle = document.title;
const originalFavicon = document.querySelector("link[rel~='icon']");
let originalFaviconHref = originalFavicon ? originalFavicon.href : null;

window.addEventListener('blur', () => {
    document.title = "_gamerxr.637_ Profile || :(";
});

window.addEventListener('focus', () => {
    document.title = originalTitle;
    if (originalFaviconHref) {
        changeFavicon(originalFaviconHref);
    }
});

function changeFavicon(src) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = src;
}

const konamiCode = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
];
let konamiIndex = 0;
document.addEventListener("keydown", (event) => {
    if (event.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateKonamiCode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});
function activateKonamiCode() {
    const easterEgg = document.getElementById("easter-egg");
    if (easterEgg) {
        easterEgg.style.display = "flex";
        setTimeout(() => {
            easterEgg.style.display = "none";
        }, 3000);
    }
}


// document.addEventListener('keydown', (event) => {
//     const key = event.key.toLowerCase();
//     if (key === 't') {
//         window.location.href = 'tetris.html';
//     } else if (key === 's') {
//         window.location.href = 'writings.html';
//     } else if (key === 'n') {
//         window.location.href = 'https://gamerxr637.is-a.dev/GuessTheNumber/';
//     }
// });

const chars = "@cH(2LD9317oS2XO8Zb[T4d036%qT/WfwzBx8G<m&-9FV!iAE$kR1←N6^→rU}n↓KpuvΠh{#¯ΣCs)0aQe5—4j]l↑57g?M×y_IPJ>";

function getUniqueRandomIndices(length, count) {
    const indices = new Set();
    while (indices.size < count) {
        indices.add(Math.floor(Math.random() * length));
    }
    return Array.from(indices);
}

class Glitch {
    constructor(selector, index, numberOfGlitchedLetter, timeGlitch, timePerLetter, timeBetweenGlitch) {
        this.selector = selector;
        this.index = index;
        this.numberOfGlitchedLetter = numberOfGlitchedLetter;
        this.innerText = '';
        this.charArray = [];
        this.charIndex = [];
        this.timeGlitch = timeGlitch;
        this.timeBetweenGlitch = timeBetweenGlitch;
        this.timePerLetter = timePerLetter;
        this.maxCount = Math.floor(this.timeGlitch / this.timePerLetter);
        this.count = 0;
        this.interval = null;
    }

    init() {
        this.innerText = this.selector.textContent;
        this.charArray = this.innerText.split("");
        if (this.numberOfGlitchedLetter === undefined || this.numberOfGlitchedLetter > this.charArray.length) {
            this.numberOfGlitchedLetter = this.charArray.length;
        }
        this.defineCharIndexToRandomize();
    }

    defineCharIndexToRandomize() {
        this.charIndex = getUniqueRandomIndices(this.charArray.length, this.numberOfGlitchedLetter);
    }

    randomize() {
        let randomString = Array.from(this.charArray);
        for (let i = 0; i < this.numberOfGlitchedLetter; i++) {
            let randIndex = Math.floor(Math.random() * chars.length);
            let randCharIndex = this.charIndex[i];
            // Ignore space, tab, and escape character
            if (
                randomString[randCharIndex] !== ' ' &&
                randomString[randCharIndex] !== '\t' &&
                randomString[randCharIndex] !== '\x1B' &&
                randomString[randCharIndex] !== '\n'

            ) {
                randomString[randCharIndex] = chars[randIndex];
            }
        }
        this.selector.textContent = randomString.join("");
    }

    update() {
        if (this.count >= this.maxCount - 1) {
            this.selector.textContent = this.innerText;
            this.defineCharIndexToRandomize();
            this.count = 0;
            setTimeout(() => {
                // Continue glitching after pause
            }, this.timeBetweenGlitch);
        } else {
            this.randomize();
            this.count++;
        }
    }

    glitch() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.update();
        }, this.timePerLetter);
    }
}

let glitchArray = [];

function initAllGlitch() {
    const arrayElements = document.querySelectorAll(".content");
    glitchArray = [];
    for (let i = 0; i < arrayElements.length; i++) {
        let selector = arrayElements[i];
        let randLetterNumber = 2 + Math.floor(Math.random() * 8);
        let randGlitchTime = 500 + Math.floor(Math.random() * 2500);
        let randGlitchPauseTime = 500 + Math.floor(Math.random() * 2500);
        let glitch = new Glitch(selector, i, randLetterNumber, randGlitchTime, 65, randGlitchPauseTime);
        glitch.init();
        glitchArray.push(glitch);
    }
}

function update() {
    for (let i = 0; i < glitchArray.length; i++) {
        glitchArray[i].glitch();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initAllGlitch();
    update();
});

function navigateToWebsite(url) {
    if (!url || url === "Links") return;

    // If url starts with 'replace:' we'll replace the top-left image instead of navigating
    if (url.startsWith('replace:')) {
        // format: replace:src|optional alt text
        const payload = url.slice('replace:'.length);
        const [src, alt] = payload.split('|');
        const img = document.querySelector('.top-left-image');
        if (img) {
            img.src = src;
            if (alt !== undefined) img.alt = alt;
        }
        return;
    }

    window.open(url, '_blank');
}

/**
 * Swaps an image's source with a fade effect.
 * @param {HTMLImageElement} img The image element to swap.
 * @param {string} newSrc The new image source URL.
 * @param {string} [newAlt] The new alt text for the image.
 */
function swapImageWithFade(img, newSrc, newAlt) {
    if (!img) return;
    // Smooth fade-out -> change -> fade-in
    img.style.transition = 'opacity 300ms ease';
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = newSrc;
        if (newAlt !== undefined) img.alt = newAlt;
        img.style.opacity = '1';
    }, 310);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Randomly swap the main avatar ---
    const mainAvatarChance = 0.05;
    if (Math.random() < mainAvatarChance) {
        const mainAvatar = document.querySelector('.top-left-image');
        const avatarPool = [
            'other/axvill.png',
            'other/bamboo.png',
            'other/gac.png',
            'other/image.png'
        ];
        const choice = avatarPool[Math.floor(Math.random() * avatarPool.length)];
        swapImageWithFade(mainAvatar, choice);
    }
});
