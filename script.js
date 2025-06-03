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
    document.title = "_gamerxr.637_ || :)";
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

// Redirect to t.html when user presses the "t" key
document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 't') {
        window.location.href = 'tetris.html';
    }
});