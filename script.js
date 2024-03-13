document.getElementById('uploadInput').addEventListener('change', handleFileSelect, false);
document.getElementById('copyButton').addEventListener('click', copyASCII, false);

function go(imageData) {
    const { data, width, height } = imageData;
    let curr = '';
    for (let i = 0; i < height; i += 2) {
        for (let j = 0; j < width; j++) {
            const offset = (i * width + j) * 4;
            const brightness = (data[offset] + data[offset + 1] + data[offset + 2]) / 3;
            const asciiChar = ' .:-=+*#%@'.charAt(Math.floor(brightness / 255 * 10));
            curr += asciiChar;
        }
        curr += '\n';
    }
    return curr;
}

function select(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const scale = img.width / img.height;
            const targetWidth = 100;
            canvas.width = targetWidth;
            canvas.height = targetWidth / scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const asciiArt = go(imageData);
            document.getElementById('asciiArt').innerText = asciiArt;
            document.getElementById('copyButton').style.display = 'inline-block'; // Show the button
        };
    };

    reader.readAsDataURL(file);
}

function copyButton() {
    const asciiArt = document.getElementById('asciiArt').innerText;
    navigator.clipboard.writeText(asciiArt)
        .then(() => {
            alert('Copied!');
        })
        .catch((error) => {
            console.error('Failed to copy :(', error);
        });
}
