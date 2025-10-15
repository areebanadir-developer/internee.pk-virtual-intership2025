const nextBtns = document.querySelectorAll(".next");
const previousBtns = document.querySelectorAll(".previous");
const formSteps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");
const circle = document.querySelectorAll(".circle");
const name = document.getElementById("name");
const father = document.getElementById("father");
const email = document.getElementById("email");
const contact = document.getElementById("contact");
const address = document.getElementById("address");
const city = document.getElementById("city");
const password = document.getElementById("password");
const confirm = document.getElementById("confirm");

let currentStep = 0;

function updateFormSteps() {
    formSteps.forEach((step, idx) => step.classList.toggle("active", idx === currentStep));
    circle.forEach((c, i) => c.classList.toggle("active", i <= currentStep));
    const actives = document.querySelectorAll(".circle.active");
    progress.style.width = ((actives.length - 1) / (circle.length - 1)) * 100 + "%";
}

// Validation
function validateStep() {
    let valid = true;
    document.querySelectorAll(".error").forEach(e => e.textContent = "");


    if (currentStep === 0) {
        if (!name.value.trim()) { document.getElementById("err-name").textContent = "Full Name is required"; valid = false; }
        if (!father.value.trim()) { document.getElementById("err-father").textContent = "Father Name is required"; valid = false }
    }

    else if (currentStep === 1) {
        if (!email.value.trim()) { document.getElementById("err-email").textContent = "Email is required"; valid = false; }
        if (!contact.value.trim()) { document.getElementById("err-contact").textContent = "Contact number is required"; valid = false; }
    }

    else if (currentStep === 2) {
        if (!address.value.trim()) { document.getElementById("err-address").textContent = "Address is required"; valid = false; }
        if (!city.value.trim()) { document.getElementById("err-city").textContent = "City is required"; valid = false; }
    }

    else if (currentStep === 3) {
        if (!password.value.trim()) { document.getElementById("err-password").textContent = "Password is required"; valid = false; }
        if (!confirm.value.trim()) { document.getElementById("err-confirm").textContent = "Confirm password is required"; valid = false; }

        else if (password.value !== confirm.value) {
            document.getElementById("err-confirm").textContent = "Passwords do not match"; valid = false;
        }
    }
    return valid;
}

// Next Button
nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (validateStep()) {
            currentStep++;
            if (currentStep === 4) { showSummary(); }
            updateFormSteps();
        }
    });
});

//  Previous Button
previousBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentStep--;
        updateFormSteps();
    });
});


// Summary
function showSummary() {
    const summary = document.getElementById("summary");
    summary.innerHTML = `
    <h4>Review Your Details:</h4>
    <p><strong>Name:</strong> ${name.value}</p>
    <p><strong>Father's Name:</strong> ${father.value}</p>
    <p><strong>Email:</strong> ${email.value}</p>
    <p><strong>Contact:</strong> ${contact.value}</p>
    <p><strong>Address:</strong> ${address.value}</p>
    <p><strong>City:</strong> ${city.value}</p>
  `;
}

// Submit
document.getElementById("multi-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Form submitted successfully!");
    e.target.reset();
    currentStep = 0;
    updateFormSteps();
});


document.getElementById("clear-btn").addEventListener("click", () => {
  localStorage.clear();
  document.querySelectorAll("#multi-form input").forEach(i => i.value = "");
  alert("🗑️ Saved data cleared!");
});



// ---- AUTO SAVE INPUT FIELDS ----
const inputs = document.querySelectorAll("#multi-form input");

inputs.forEach(input => {
  // Restore old data (if any)
  const saved = localStorage.getItem(input.id);
  if (saved) input.value = saved;

  // Save whenever user types
  input.addEventListener("input", () => {
    localStorage.setItem(input.id, input.value);
  });
});
