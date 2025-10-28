
  // Initialize particles.js
particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    size: { value: 3 },
    move: { speed: 2 },
    line_linked: { enable: true, color: "#38bdf8" },
    color: { value: "#38bdf8" },
  },
  interactivity: {
    events: { onhover: { enable: true, mode: "repulse" } },
  },
});

// Typing Animation
const typed = new Typed(".typed-text", {
  strings: [
    "CSE Student",
    "Web Developer",
    "I build random web things",
    "Exploring how tech works ⚡",
  ],
  typeSpeed: 60,
  backSpeed: 40,
  backDelay: 1500,
  loop: true,
});

// Year Auto Update
document.getElementById("year").textContent = new Date().getFullYear();

// Projects
const projects = [
  {
    title: "Project 1",
    desc: "A personal web project built as part of my learning journey in web development.",
    tags: ["Web", "Frontend", "Private"],
    image: "assets/project1.png",
    link: "https://shreyasmh26.github.io/shrisha/",
  },
];

const projectGrid = document.getElementById("projectGrid");
projects.forEach((p) => {
  const card = document.createElement("div");
  card.className = "project-card fade-in";
  card.innerHTML = `
    <img src="${p.image || 'https://via.placeholder.com/400x250?text=Project+1'}" alt="${p.title}" class="project-img" />
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
    <div class="tags">${p.tags.map(t => `<span>#${t}</span>`).join(" ")}</div>
    <a href="${p.link}" target="_blank" class="project-btn">View Project</a>
  `;
  projectGrid.appendChild(card);
});