(function() {
  emailjs.init("YOUR_PUBLIC_KEY_HERE"); // add your EmailJS public key
})();

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // --- Projects ---
  const projects = [
    {
      title: "Project 1",
      desc: "A personal web project built as part of my learning journey in web development.",
      tags: ["Web", "Frontend", "Private"],
      image: "assets/project1.png", // create /assets/project1.png or use placeholder below
    },
  ];

  const projectGrid = document.getElementById("projectGrid");
  if (projects.length > 0) {
    projects.forEach((p) => {
      const card = document.createElement("div");
      card.className = "project-card fade-in";
      card.innerHTML = `
        <img src="${p.image || 'https://via.placeholder.com/400x250?text=Project+1'}" alt="${p.title}" class="project-img" />
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="tags">${p.tags.map(t => `<span>#${t}</span>`).join(" ")}</div>
      `;
      projectGrid.appendChild(card);
    });
  } else {
    projectGrid.innerHTML = "<p>No projects yet — stay tuned!</p>";
  }

  // --- Contact Form ---
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      from_name: name,
      from_email: email,
      message: message,
    })
    .then(() => {
      alert("✅ Message sent successfully!");
      form.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("❌ Failed to send message. Please try again later.");
    });
  });
});