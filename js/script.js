/* =============================================
   BENJAMIN TEO ROJAS — PORTFOLIO
   script.js
   ============================================= */

/* ---- LOADER ---- */
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1500);
});

/* ---- CUSTOM CURSOR ---- */
const cursor = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursorFollower");

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  }
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if (cursorFollower) {
    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top  = followerY + "px";
  }
  requestAnimationFrame(animateFollower);
}
animateFollower();

/* ---- NAVBAR SCROLL EFFECT ---- */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  updateActiveNav();
});

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href").replace("#", "");
    if (href === currentSection) {
      link.classList.add("active");
    }
  });
}

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const spans = hamburger.querySelectorAll("span");
    if (navLinks.classList.contains("open")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity   = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity   = "";
      spans[2].style.transform = "";
    }
  });

  // Close nav when clicking a link
  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      const spans = hamburger.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.opacity   = "";
      spans[2].style.transform = "";
    });
  });
}

/* ---- TYPED TEXT EFFECT ---- */
const typedEl = document.getElementById("typedText");
const roles = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "SQL Developer"
];
let roleIndex = 0;
let charIndex  = 0;
let isDeleting = false;

function type() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(type, isDeleting ? 60 : 95);
}

type();

/* ---- PARTICLE CANVAS ---- */
const canvas = document.getElementById("particleCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const chars = ["{", "}", "<", ">", "/", ";", "()", "=>", "[]", "/*", "*/"];
  let particles = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.char  = chars[Math.floor(Math.random() * chars.length)];
      this.size  = Math.random() * 10 + 8;
      this.speed = Math.random() * 0.4 + 0.15;
      this.alpha = Math.random() * 0.12 + 0.03;
      this.drift = (Math.random() - 0.5) * 0.3;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = "#38BDF8";
      ctx.font        = `${this.size}px JetBrains Mono, monospace`;
      ctx.fillText(this.char, this.x, this.y);
      ctx.restore();
    }
  }

  for (let i = 0; i < 55; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // start spread
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ---- ANIMATED COUNTER ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const step = 16;
  const steps = Math.floor(duration / step);
  let current = 0;
  let count = 0;

  const interval = setInterval(() => {
    count++;
    // ease-out: fast at start, slow at end
    const progress = count / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.round(eased * target);
    el.textContent = current + suffix;

    if (count >= steps) {
      el.textContent = target + suffix;
      clearInterval(interval);
    }
  }, step);
}

// Trigger counters when hero stats come into view
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".counter").forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) counterObserver.observe(heroStats);

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);

document.querySelectorAll("[data-reveal], .skill-card, .project-card, .contact-card, .goal-item").forEach(el => {
  revealObserver.observe(el);
});

/* Fire once on load for visible elements */
window.dispatchEvent(new Event("scroll"));