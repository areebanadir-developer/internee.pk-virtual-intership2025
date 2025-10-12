const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const previewImg = document.getElementById("preview-img");
const error = document.getElementById("error");
const progress = document.getElementById("progress");


// Highlight effect when dragging file
["dragenter", "dragover"].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropArea.classList.add("highlight");
    });
});


["dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
        dropArea.classList.remove("highlight");
    });
});

// Drop file
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

// Click to upload
dropArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

// File handling function
function handleFile(file) {
    if (!file) return; // prevent undefined error
    error.textContent = "";

    if (!file.type.startsWith("image/")) {
        error.textContent = "Invalid file type! Please upload an image (JPG, PNG, GIF)";
        preview.style.display = "none";
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        previewImg.src = reader.result;
        previewImg.style.display = "block";
        simulateUpload();

        // ✅ Save uploaded image in localStorage
        localStorage.setItem("uploadedImage", reader.result);
    };
}


// Simulate upload progress
function simulateUpload() {
    progress.style.width = "0%";

    // step 1 after 0.5 seconds
    setTimeout(() => {
        progress.style.width = "30%";
    }, 500);

    // Step 2 after 1 seconds
    setTimeout(() => {
        progress.style.width = "60%";
    }, 1000);

    // Step 3 after 1.5 seconds
    setTimeout(() => {
        progress.style.width = "80%";
    }, 1500);

    // Step 4 after 2 seconds
    setTimeout(() => {
        progress.style.width = "100%";
    }, 2000);
}

window.addEventListener("load", () => {
    const savedImage = localStorage.getItem("uploadedImage");
    if (savedImage) {
        previewImg.src = savedImage;
        previewImg.style.display = "block";
    }
});

document.getElementById("clear-btn").addEventListener("click", () => {
    localStorage.removeItem("uploadedImage");
    previewImg.style.display = "none";
    progress.style.width = "0%";
    alert("Saved image cleared successfully!");
});