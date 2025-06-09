// stats.js r6 - http://github.com/mrdoob/stats.js

var Stats = function () {
    // Helper function to update the graph data
    function updateGraph(data, value, type) {
        var i, j, idx;
        // Shift old graph data left by one column
        for (j = 0; j < 30; j++) {
            for (i = 0; i < 73; i++) {
                idx = (i + j * 74) * 4;
                data[idx]     = data[idx + 4];
                data[idx + 1] = data[idx + 5];
                data[idx + 2] = data[idx + 6];
            }
        }
        // Add new value as the last column
        for (j = 0; j < 30; j++) {
            idx = (73 + j * 74) * 4;
            if (j < value) {
                data[idx]     = colors[type].bg.r;
                data[idx + 1] = colors[type].bg.g;
                data[idx + 2] = colors[type].bg.b;
            } else {
                data[idx]     = colors[type].fg.r;
                data[idx + 1] = colors[type].fg.g;
                data[idx + 2] = colors[type].fg.b;
            }
        }
    }

    // Color presets for FPS, MS, MB graphs
    var colors = {
        fps: { bg: { r: 16, g: 16, b: 48 }, fg: { r: 0, g: 255, b: 255 } },
        ms:  { bg: { r: 16, g: 48, b: 16 }, fg: { r: 0, g: 255, b: 0 } },
        mb:  { bg: { r: 48, g: 16, b: 26 }, fg: { r: 255, g: 0, b: 128 } }
    };

    // State variables
    var mode = 0, // 0: FPS, 1: MS, 2: MB
        maxMode = 2,
        frameCount = 0,
        startTime = Date.now(),
        prevTime = startTime,
        ms = 0,
        msMin = 1000,
        msMax = 0,
        fps = 0,
        fpsMin = 1000,
        fpsMax = 0,
        memory = 0,
        memoryMin = 1000,
        memoryMax = 0,
        showMemory = false;

    // Main container
    var container = document.createElement("div");
    container.style.cursor = "pointer";
    container.style.width = "80px";
    container.style.opacity = "0.9";
    container.style.zIndex = "10001";

    // Toggle mode on click
    container.addEventListener("click", function () {
        mode = (mode + 1) % (showMemory ? 3 : 2);
        fpsDiv.style.display = "none";
        msDiv.style.display = "none";
        if (showMemory) memoryDiv.style.display = "none";
        if (mode === 0) fpsDiv.style.display = "block";
        else if (mode === 1) msDiv.style.display = "block";
        else if (mode === 2 && showMemory) memoryDiv.style.display = "block";
    }, false);

    // --- FPS Panel ---
    var fpsDiv = document.createElement("div");
    fpsDiv.style.backgroundColor = `rgb(${Math.floor(colors.fps.bg.r / 2)},${Math.floor(colors.fps.bg.g / 2)},${Math.floor(colors.fps.bg.b / 2)})`;
    fpsDiv.style.padding = "2px 0px 3px 0px";
    container.appendChild(fpsDiv);

    var fpsText = document.createElement("div");
    fpsText.style.fontFamily = "Helvetica, Arial, sans-serif";
    fpsText.style.textAlign = "left";
    fpsText.style.fontSize = "9px";
    fpsText.style.color = `rgb(${colors.fps.fg.r},${colors.fps.fg.g},${colors.fps.fg.b})`;
    fpsText.style.margin = "0px 0px 1px 3px";
    fpsText.innerHTML = '<span style="font-weight:bold">FPS</span>';
    fpsDiv.appendChild(fpsText);

    var fpsCanvas = document.createElement("canvas");
    fpsCanvas.width = 74;
    fpsCanvas.height = 30;
    fpsCanvas.style.display = "block";
    fpsCanvas.style.marginLeft = "3px";
    fpsDiv.appendChild(fpsCanvas);

    var fpsCtx = fpsCanvas.getContext("2d");
    fpsCtx.fillStyle = `rgb(${colors.fps.bg.r},${colors.fps.bg.g},${colors.fps.bg.b})`;
    fpsCtx.fillRect(0, 0, fpsCanvas.width, fpsCanvas.height);
    var fpsImage = fpsCtx.getImageData(0, 0, fpsCanvas.width, fpsCanvas.height);

    // --- MS Panel ---
    var msDiv = document.createElement("div");
    msDiv.style.backgroundColor = `rgb(${Math.floor(colors.ms.bg.r / 2)},${Math.floor(colors.ms.bg.g / 2)},${Math.floor(colors.ms.bg.b / 2)})`;
    msDiv.style.padding = "2px 0px 3px 0px";
    msDiv.style.display = "none";
    container.appendChild(msDiv);

    var msText = document.createElement("div");
    msText.style.fontFamily = "Helvetica, Arial, sans-serif";
    msText.style.textAlign = "left";
    msText.style.fontSize = "9px";
    msText.style.color = `rgb(${colors.ms.fg.r},${colors.ms.fg.g},${colors.ms.fg.b})`;
    msText.style.margin = "0px 0px 1px 3px";
    msText.innerHTML = '<span style="font-weight:bold">MS</span>';
    msDiv.appendChild(msText);

    var msCanvas = document.createElement("canvas");
    msCanvas.width = 74;
    msCanvas.height = 30;
    msCanvas.style.display = "block";
    msCanvas.style.marginLeft = "3px";
    msDiv.appendChild(msCanvas);

    var msCtx = msCanvas.getContext("2d");
    msCtx.fillStyle = `rgb(${colors.ms.bg.r},${colors.ms.bg.g},${colors.ms.bg.b})`;
    msCtx.fillRect(0, 0, msCanvas.width, msCanvas.height);
    var msImage = msCtx.getImageData(0, 0, msCanvas.width, msCanvas.height);

    // --- MB Panel (if supported) ---
    try {
        if (performance && performance.memory && performance.memory.totalJSHeapSize) {
            showMemory = true;
            maxMode = 3;
        }
    } catch (e) { }

    var memoryDiv, memoryText, memoryCanvas, memoryCtx, memoryImage;
    if (showMemory) {
        memoryDiv = document.createElement("div");
        memoryDiv.style.backgroundColor = `rgb(${Math.floor(colors.mb.bg.r / 2)},${Math.floor(colors.mb.bg.g / 2)},${Math.floor(colors.mb.bg.b / 2)})`;
        memoryDiv.style.padding = "2px 0px 3px 0px";
        memoryDiv.style.display = "none";
        container.appendChild(memoryDiv);

        memoryText = document.createElement("div");
        memoryText.style.fontFamily = "Helvetica, Arial, sans-serif";
        memoryText.style.textAlign = "left";
        memoryText.style.fontSize = "9px";
        memoryText.style.color = `rgb(${colors.mb.fg.r},${colors.mb.fg.g},${colors.mb.fg.b})`;
        memoryText.style.margin = "0px 0px 1px 3px";
        memoryText.innerHTML = '<span style="font-weight:bold">MB</span>';
        memoryDiv.appendChild(memoryText);

        memoryCanvas = document.createElement("canvas");
        memoryCanvas.width = 74;
        memoryCanvas.height = 30;
        memoryCanvas.style.display = "block";
        memoryCanvas.style.marginLeft = "3px";
        memoryDiv.appendChild(memoryCanvas);

        memoryCtx = memoryCanvas.getContext("2d");
        memoryCtx.fillStyle = "#301010";
        memoryCtx.fillRect(0, 0, memoryCanvas.width, memoryCanvas.height);
        memoryImage = memoryCtx.getImageData(0, 0, memoryCanvas.width, memoryCanvas.height);
    }

    // Return the stats object
    return {
        domElement: container,
        update: function () {
            // MS updates
            ms = Date.now() - startTime;
            msMin = Math.min(msMin, ms);
            msMax = Math.max(msMax, ms);
            updateGraph(msImage.data, Math.min(30, 30 - ms / 200 * 30), "ms");
            msText.innerHTML = `<span style="font-weight:bold">${ms} MS</span> (${msMin}-${msMax})`;
            msCtx.putImageData(msImage, 0, 0);

            // FPS updates
            frameCount++;
            if (Date.now() > prevTime + 1000) {
                fps = Math.round((frameCount * 1000) / (Date.now() - prevTime));
                fpsMin = Math.min(fpsMin, fps);
                fpsMax = Math.max(fpsMax, fps);
                updateGraph(fpsImage.data, Math.min(30, 30 - fps / 100 * 30), "fps");
                fpsText.innerHTML = `<span style="font-weight:bold">${fps} FPS</span> (${fpsMin}-${fpsMax})`;
                fpsCtx.putImageData(fpsImage, 0, 0);

                // Memory updates
                if (showMemory) {
                    memory = performance.memory.usedJSHeapSize * 9.54e-7;
                    memoryMin = Math.min(memoryMin, memory);
                    memoryMax = Math.max(memoryMax, memory);
                    updateGraph(memoryImage.data, Math.min(30, 30 - memory / 2), "mb");
                    memoryText.innerHTML = `<span style="font-weight:bold">${Math.round(memory)} MB</span> (${Math.round(memoryMin)}-${Math.round(memoryMax)})`;
                    memoryCtx.putImageData(memoryImage, 0, 0);
                }
                prevTime = Date.now();
                frameCount = 0;
            }
            startTime = Date.now();
        }
    };
};

document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 't') {
        window.location.href = 'tetris.html';
    }
});
