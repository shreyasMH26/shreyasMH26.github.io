let projects = [];
let activeTags = [];

const projectContainer = document.getElementById("projects");
const searchInput = document.getElementById("searchInput");
const tagContainer = document.getElementById("tagContainer");
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalTags = document.getElementById("modalTags");
const modalLinks = document.getElementById("modalLinks");
const closeModal = document.getElementById("closeModal");

document.getElementById("year").textContent = new Date().getFullYear();

async function loadProjects() {
  const res = await fetch("data.json");
  projects = await res.json();
  renderTags();
  renderProjects();
}

function renderTags() {
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));
  tagContainer.innerHTML = `
    <button class="tag ${activeTags.length === 0 ? "active" : ""}" data-tag="all">All</button>
    ${allTags
      .map(
        (t) => `<button class="tag ${activeTags.includes(t) ? "active" : ""}" data-tag="${t}">${t}</button>`
      )
      .join("")}
  `;

  document.querySelectorAll(".tag").forEach((btn) =>
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      if (tag === "all") activeTags = [];
      else if (activeTags.includes(tag)) activeTags = activeTags.filter((t) => t !== tag);
      else activeTags.push(tag);
      renderTags();
      renderProjects();
    })
  );
}

function renderProjects() {
  const query = searchInput.value.toLowerCase();
  let filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query) &&
      (activeTags.length === 0 || p.tags.some((t) => activeTags.includes(t)))
  );

  projectContainer.innerHTML = filtered
    .map(
      (p, i) => `
      <div class="card fade-in" style="animation-delay: ${i * 0.1}s" data-id="${p.id}">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tags">
          ${p.tags.map((t) => `<span class="tag-label">${t}</span>`).join("")}
        </div>
        <div class="links">
          ${p.repo ? `<a href="${p.repo}" target="_blank">Repo</a>` : ""}
          ${p.live ? `<a href="${p.live}" target="_blank">Live</a>` : ""}
          <a href="#" class="details" data-id="${p.id}">Details</a>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".details").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const project = projects.find((x) => x.id === btn.dataset.id);
      openModal(project);
    })
  );
}

function openModal(project) {
  modalTitle.textContent = project.title;
  modalDesc.textContent = project.description;
  modalTags.innerHTML = project.tags.map((t) => `<span class="tag-label">${t}</span>`).join("");
  modalLinks.innerHTML = `
    ${project.repo ? `<a href="${project.repo}" target="_blank">View Repo</a>` : ""}
    ${project.live ? `<a href="${project.live}" target="_blank">Live Demo</a>` : ""}
  `;
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
searchInput.addEventListener("input", renderProjects);

loadProjects();