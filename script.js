/* Final JS: auto-theme aware Apple+Cyber-Glass portfolio
   - particles background
   - typed tagline
   - hero parallax tilt
   - smooth scrolling
   - intersection reveal
   - dynamic projects render
   - EmailJS contact (placeholders; replace locally)
*/

// ---- Helper: wait for DOM loaded (for safe element queries)
document.addEventListener('DOMContentLoaded', () => {

  // ---- Typed.js tagline (fallback if Typed is loaded)
  if (window.Typed) {
    new Typed('.typed-text', {
      strings: [
        'CSE Student — Web Developer',
        'I build random web things 🌐',
        'Exploring how tech actually works ⚙️'
      ],
      typeSpeed: 48,
      backSpeed: 28,
      backDelay: 1400,
      loop: true
    });
  } else {
    // fallback simple text
    const el = document.querySelector('.typed-text');
    if (el) el.textContent = 'CSE Student — Web Developer';
  }

  // ---- Particles (if available)
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 55 },
        color: { value: ["#003366", "#3a0ca3", "#00a8a8"] },
        opacity: { value: 1 },
        size: { value: 3 },
        line_linked: { enable: true, distance: 120, color: "rgba(0,50,100,0.5)", opacity: 0.5 },
        move: { enable: true, speed: 1.5, out_mode: "out" }
      },
      interactivity: { events: { onhover: { enable: true, mode: "repulse" } } },
      retina_detect: true
    });
  }

  // ---- Hero parallax tilt
  const heroInner = document.getElementById('heroInner');
  if (heroInner) {
    document.addEventListener('mousemove', (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      const mx = (e.clientX - w/2) / (w/2);
      const my = (e.clientY - h/2) / (h/2);
      const rx = my * 4, ry = mx * -6;
      heroInner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    document.addEventListener('mouseleave', ()=> heroInner.style.transform = 'none');
  }

  // ---- Smooth scroll for anchor links
  document.querySelectorAll('[data-scroll]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const href = a.getAttribute('href');
      const target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // ---- IntersectionObserver for reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, {threshold: 0.18});
  document.querySelectorAll('.section, .card, .skill-card, .project-card, .about-card, .hero').forEach(el=>{
    el.classList.add('hidden');
    observer.observe(el);
  });

  // ---- Render Projects dynamically (fetch from backend)
  const grid = document.getElementById('projectGrid');
  if (grid) {
    fetch('/api/projects')
      .then(res => res.json())
      .then(projects => {
        if (!Array.isArray(projects)) return;
        projects.forEach(p => {
          const card = document.createElement('article');
          card.className = 'project-card card lift';
          card.innerHTML = `
            <img class="project-img" src="${p.image || 'https://via.placeholder.com/600x360?text=Project'}" alt="${p.title}" />
            <h4>${p.title}</h4>
            <p class="muted">${p.description || p.desc || ''}</p>
            <div style="margin-top:12px">
              ${p.live ? `<a class="btn btn-ghost" href="${p.live}" target="_blank" rel="noopener">View Project</a>` : ''}
              ${p.repo ? `<a class="btn btn-ghost" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
            </div>
          `;
          // tilt micro-interaction
          card.addEventListener('mousemove', (ev) => {
            const r = card.getBoundingClientRect();
            const dx = (ev.clientX - (r.left + r.width/2)) / r.width;
            const dy = (ev.clientY - (r.top + r.height/2)) / r.height;
            card.style.transform = `rotateX(${dy * -6}deg) rotateY(${dx * 10}deg) translateZ(0)`;
          });
          card.addEventListener('mouseleave', ()=> card.style.transform = 'none');
          grid.appendChild(card);
          observer.observe(card);
        });
      })
      .catch(err => console.error('Failed to load projects', err));
  }

  // ---- EmailJS contact form (replace placeholders locally)
  // IMPORTANT: Replace these placeholders locally with your real keys.
  // Example replacement (do locally, do NOT commit your real key publicly):
  //   emailjs.init('Q17DE7rZ7v8J01ubQZ-QL');
  //   emailjs.send('service_aws8mdq','template_gfyruqu', templateParams)
  if (window.emailjs) {
    // leave init commented here; user will init locally with their key
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const payload = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
      };
      if (!payload.name || !payload.email || !payload.message) {
        status.textContent = 'Please fill all fields.';
        return;
      }

      status.textContent = 'Sending...';
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(r => r.json())
        .then(res => {
          if (res && res.ok) {
            status.textContent = '✅ Message sent!';
            contactForm.reset();
          } else {
            status.textContent = res && res.error ? `❌ ${res.error}` : '❌ Send failed';
          }
        })
        .catch(err => {
          console.error('Contact send failed', err);
          status.textContent = '❌ Send failed';
        });
    });
  }

  // ---- Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---- Ambient subtle hue shift (light/dark aware)
  let hue = 190;
  setInterval(() => {
    hue = (hue + 0.25) % 360;
    // softer pastel shifts for light mode, brighter for dark mode
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.getElementById('ambient-gradient').style.background =
        `radial-gradient(circle at 20% 20%, rgba(40,120,120,0.08), transparent 20%), radial-gradient(circle at 80% 80%, rgba(120,80,240,0.06), transparent 30%)`;
    } else {
      document.getElementById('ambient-gradient').style.background =
        `radial-gradient(circle at 10% 20%, rgba(127,201,195,0.10), transparent 20%), radial-gradient(circle at 85% 80%, rgba(255,214,224,0.06), transparent 30%)`;
    }
  }, 2000);

}); // DOMContentLoaded end