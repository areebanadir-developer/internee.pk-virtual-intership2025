const toggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".right-side ul");

toggle.addEventListener("click", () => {
  navMenu.classList.toggle("show-menu");
});

let index = 0;
const cards = document.querySelectorAll(".feedback-card");

function showNextReview() {
  cards.forEach((card, i) => {
    card.style.display = i === index ? "flex" : "none";
  });
  index = (index + 1) % cards.length;
}

if (cards.length > 0) {
  showNextReview();
  setInterval(showNextReview, 4000);
}


const elements = document.querySelectorAll(".fade-in");

window.addEventListener("scroll", () => {
  elements.forEach(el => {
    const rect = el.getBoundingClientRect().top;
    if (rect < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});


document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();


  let existingMsg = document.querySelector(".form-message");
  if (existingMsg) existingMsg.remove();

  const msg = document.createElement("p");
  msg.classList.add("form-message");
  msg.style.textAlign = "center";
  msg.style.marginTop = "15px";


  if (!name || !email || !message) {
    msg.textContent = "⚠️ Please fill in all fields.";
    msg.style.color = "red";
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    msg.textContent = "⚠️ Please enter a valid email address.";
    msg.style.color = "orange";
  } else {
    msg.textContent = "✅ Thank you! Your message has been sent successfully.";
    msg.style.color = "green";
    msg.style.opacity = "0";
    msg.style.transition = "opacity 0.8s ease";

    setTimeout(() => {
      msg.style.opacity = "1";
    }, 50);

    this.reset();
  }

  document.querySelector(".contact-form").appendChild(msg);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

const feedbackCards = document.querySelectorAll(".feedback-card");

window.addEventListener("scroll", () => {
  feedbackCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (cardTop < windowHeight - 100) {
      card.classList.add("visible");
    }
  });
});
