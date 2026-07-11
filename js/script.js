const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Sticky nav background on scroll */
window.addEventListener("scroll", () => {
  nav.classList.toggle("active", window.scrollY > 40);
});

/* Mobile menu toggle */
function toggleMenu(){
  navLinks.classList.toggle("active");
}
menuToggle.addEventListener("click", toggleMenu);
menuToggle.addEventListener("keydown", (e) => {
  if(e.key === "Enter" || e.key === " "){
    e.preventDefault();
    toggleMenu();
  }
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("active"));
});

/* Scroll reveal */
const revealEls = document.querySelectorAll(".reveal");

if(prefersReducedMotion){
  revealEls.forEach(el => el.classList.add("in-view"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* Rotating role text in hero */
const roleEl = document.getElementById("typed-role");
const roles = ["Java Developer", "Frontend Developer", "DSA Enthusiast", "Cloud Explorer"];
let roleIndex = 0;

if(roleEl && !prefersReducedMotion){
  roleEl.style.transition = "opacity .3s ease";
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleEl.style.opacity = 0;
    setTimeout(() => {
      roleEl.textContent = roles[roleIndex];
      roleEl.style.opacity = 1;
    }, 300);
  }, 2600);
}

/* Count-up stats */
const counters = document.querySelectorAll(".count");

function animateCount(el){
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const start = performance.now();

  function step(now){
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if(progress < 1){
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      if(prefersReducedMotion){
        el.textContent = el.dataset.target;
      } else {
        animateCount(el);
      }
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

counters.forEach(el => countObserver.observe(el));

/* ---------- Click-to-type story reveal ---------- */
const storyBtn = document.getElementById("story-btn");
const storyBox = document.getElementById("story-box");
const storyParas = document.querySelectorAll(".story-para");
const storyCursor = document.getElementById("story-cursor");

let hasTyped = false;
let isExpanded = false;

function typeParagraph(el, text, speed, onDone){
  let i = 0;
  el.textContent = "";
  function step(){
    el.textContent += text.charAt(i);
    i++;
    if(i < text.length){
      setTimeout(step, speed);
    } else if(onDone){
      onDone();
    }
  }
  step();
}

function typeAllParagraphs(){
  const list = Array.from(storyParas);
  let index = 0;

  function next(){
    if(index >= list.length){
      storyCursor.style.display = "inline";
      return;
    }
    const el = list[index];
    const text = el.dataset.text;
    typeParagraph(el, text, 12, () => {
      index++;
      next();
    });
  }
  next();
}

if(storyBtn){
  storyCursor.style.display = "none";

  storyBtn.addEventListener("click", () => {
    if(!hasTyped){
      storyBox.classList.add("expanded");
      isExpanded = true;
      hasTyped = true;
      storyBtn.textContent = "Hide Story";

      if(prefersReducedMotion){
        storyParas.forEach(el => el.textContent = el.dataset.text);
        storyCursor.style.display = "inline";
      } else {
        typeAllParagraphs();
      }
    } else {
      isExpanded = !isExpanded;
      storyBox.classList.toggle("expanded", isExpanded);
      storyBtn.textContent = isExpanded ? "Hide Story" : "Read My Full Story";
    }
  });
}