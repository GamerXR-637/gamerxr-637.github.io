window.addEventListener('DOMContentLoaded', () => {
    const copyright = document.getElementById('copyright');
    if (copyright) {
        copyright.appendChild(document.createTextNode(new Date().getFullYear()));
    }
});