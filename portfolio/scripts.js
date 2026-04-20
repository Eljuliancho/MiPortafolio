// Loader Simple - Fade out rápido
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('loader-fade-out');
  }, 1200);
  setTimeout(() => {
    loader.style.display = 'none';
    document.body.classList.add('loaded');
  }, 1800);
});

// Custom Cursor con 5 trails (microinteracción hero)
const cursor = document.getElementById('cursor');
const cursorLabel = document.getElementById('cursor-label');
let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice) {
  // 5 trails originales - optimizados
  const trails = [];
  for (let i = 0; i < 5; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.opacity = (0.3 - i * 0.05).toString();
    document.body.appendChild(trail);
    trails.push({ el: trail, x: 0, y: 0 });
  }

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  function animateCursor() {
    cursorX += (targetX - cursorX) * 0.15;
    cursorY += (targetY - cursorY) * 0.15;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorLabel.style.left = cursorX + 'px';
    cursorLabel.style.top = cursorY + 'px';

    trails.forEach((trail, i) => {
      const delay = (i + 1) * 0.08;
      trail.x += (targetX - trail.x) * delay;
      trail.y += (targetY - trail.y) * delay;
      trail.el.style.left = trail.x + 'px';
      trail.el.style.top = trail.y + 'px';
    });

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand cursor on project rows
  document.querySelectorAll('.project-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      cursor.classList.add('expanded');
      cursorLabel.classList.add('visible');
    });
    row.addEventListener('mouseleave', () => {
      cursor.classList.remove('expanded');
      cursorLabel.classList.remove('visible');
    });
  });
}

// Clock - actualizar cada segundo
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}
updateClock();
setInterval(updateClock, 1000);

// Navbar scroll effect - con throttle
let lastScrollY = 0;
let ticking = false;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', lastScrollY > 100);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Particles - Microinteracción hero restaurada y optimizada
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [], mouseX = 0, mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.3 + 0.2;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.03;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 120) {
      const force = (120 - distance) / 120;
      this.x -= dx * force * 0.018;
      this.y -= dy * force * 0.018;
    }

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.15;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 57, 70, ${Math.max(0.1, pulseOpacity)})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const opacity = (1 - distance / 120) * 0.25;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(230, 57, 70, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    // Conexión al mouse - microinteracción hero
    const dx = mouseX - particles[i].x;
    const dy = mouseY - particles[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 120) {
      const opacity = (1 - distance / 120) * 0.35;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(230, 57, 70, ${opacity})`;
      ctx.lineWidth = 0.8;
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// Experience Cards
const cards = document.querySelectorAll('.experience-card');
const dots = document.querySelectorAll('.card-dot');
let currentCard = 0;
const cardInterval = 4000;

function showCard(index) {
  cards.forEach((card, i) => {
    card.classList.remove('active', 'exiting');
    if (i === currentCard && i !== index) {
      card.classList.add('exiting');
    }
  });
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));

  setTimeout(() => {
    cards[index].classList.add('active');
  }, 100);

  currentCard = index;
}

function nextCard() {
  const next = (currentCard + 1) % cards.length;
  showCard(next);
}

let cardTimer = setInterval(nextCard, cardInterval);

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    clearInterval(cardTimer);
    showCard(index);
    cardTimer = setInterval(nextCard, cardInterval);
  });
});

// Project Detail Panel
const projectDetail = document.getElementById('project-detail');
const detailClose = document.getElementById('detail-close');
const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-desc');
const detailCode = document.getElementById('detail-code');
const detailCategory = document.getElementById('detail-category');

// Extended project data with more text and details
const projectsData = {
  '73software': {
    title: '73SOFTWARE.DEV',
    category: 'Branding · UX/UI · Desarrollo Web',
    desc: 'Desarrollo completo de identidad digital y plataforma web para 73Software, una empresa de desarrollo de software especializada en soluciones empresariales. El proyecto abarcó desde la conceptualización de la marca hasta la implementación final del sitio web.\n\nRealicé un exhaustivo proceso de research para comprender el mercado objetivo y las necesidades de los usuarios. Diseñé un sistema de identidad visual coherente que refleja la innovación y profesionalismo de la empresa. La interfaz de usuario fue cuidadosamente diseñada para ofrecer una experiencia fluida y moderna, con atención especial a la navegación intuitiva y la accesibilidad.\n\nEl desarrollo frontend se implementó utilizando tecnologías modernas como HTML5, CSS3 y JavaScript, garantizando un rendimiento óptimo y una experiencia responsive en todos los dispositivos. El resultado es una plataforma que comunica efectivamente los valores de la marca mientras proporciona una experiencia de usuario excepcional.',
    code: 'JLSM-0001',
    highlights: ['Brand Strategy', 'UI/UX Design', 'Frontend Dev'],
    stats: { weeks: '16', screens: '25+', satisfaction: '100%' }
  },
  'sube-nube': {
    title: 'SUBE A LA NUBE',
    category: 'Branding · UX/UI · Full-Stack',
    desc: 'Plataforma integral de servicios en la nube diseñada para empresas colombianas que buscan modernizar sus operaciones digitales. El proyecto abarcó desde la investigación de usuarios hasta el desarrollo full-stack de la aplicación.\n\nComencé con una fase de descubrimiento que incluyó entrevistas con stakeholders, análisis de competidores y definición de objetivos de negocio. Esto permitió crear una arquitectura de información sólida y un flujo de usuario optimizado. El diseño visual se centró en transmitir confianza y tecnología de vanguardia, utilizando una paleta de colores moderna y tipografía legible.\n\nLa implementación técnica incluyó el desarrollo de un dashboard interactivo, sistemas de autenticación seguros, y una API robusta para la gestión de servicios en la nube. Cada componente fue diseñado pensando en la escalabilidad y el mantenimiento a largo plazo.',
    code: 'JLSM-0002',
    highlights: ['User Research', 'Full-Stack Dev', 'Cloud Integration'],
    stats: { weeks: '20', screens: '40+', satisfaction: '98%' }
  },
  'trebol': {
    title: 'TRÉBOL COLOMBIA S.A.S.',
    category: 'UX Research · Arquitectura Info · Figma',
    desc: 'Rediseño completo de la experiencia digital para una de las principales empresas de servicios financieros de Colombia. El objetivo era modernizar la plataforma existente y mejorar significativamente la experiencia del usuario.\n\nEl proceso comenzó con una investigación exhaustiva que incluyó análisis heurístico, pruebas de usabilidad con usuarios reales, y mapeo de journey maps. Estos insights revelaron puntos de fricción críticos que guiaron las decisiones de diseño posteriores.\n\nDesarrollé una nueva arquitectura de información que simplificó la navegación y redujo el tiempo de completación de tareas en un 40%. El sistema de diseño creado en Figma incluyó componentes reutilizables, guías de estilo detalladas, y patrones de interacción consistentes. El prototipo interactivo permitió validar las soluciones con usuarios antes del desarrollo.',
    code: 'JLSM-0003',
    highlights: ['UX Research', 'Information Architecture', 'Design System'],
    stats: { weeks: '24', screens: '60+', satisfaction: '95%' }
  },
  'pedidos-click': {
    title: 'PEDIDOS.CLICK',
    category: 'Branding · Identidad Visual · Manual de Marca',
    desc: 'Desarrollo de identidad de marca completa para plataforma de pedidos online. Desde el naming hasta el manual de marca, cada elemento fue cuidadosamente diseñado para crear una presencia memorable en el mercado.\n\nEl proceso de branding comenzó con la definición de la estrategia de marca, incluyendo análisis de competencia, definición de valores y personalidad de marca. El nombre "Pedidos.Click" fue seleccionado por su claridad y facilidad de recordación.\n\nEl diseño del logotipo exploró múltiples direcciones antes de llegar a la solución final: un ícono dinámico que representa la velocidad y eficiencia del servicio. La paleta de colores vibrantes transmite energía y confianza, mientras que la tipografía seleccionada equilibra legibilidad y personalidad. El manual de marca resultante proporciona directrices completas para mantener la coherencia en todas las aplicaciones.',
    code: 'JLSM-0004',
    highlights: ['Brand Identity', 'Logo Design', 'Brand Guidelines'],
    stats: { weeks: '10', screens: '15+', satisfaction: '100%' }
  },
  'santoto-pro': {
    title: 'SANTOTO+PRO',
    category: 'App Design · Branding · Design System · Motion',
    desc: 'Diseño completo de la aplicación móvil SantotoPro para la Universidad Santo Tomás, junto con la creación de imagen de marca y recursos visuales. Este proyecto representó un hito importante en mi carrera como diseñador de interacción.\n\nLa aplicación fue concebida como una herramienta integral para estudiantes y profesionales, ofreciendo acceso a cursos, recursos educativos, networking y oportunidades laborales. El proceso de diseño comenzó con extensas sesiones de descubrimiento con stakeholders de la universidad para comprender las necesidades de los usuarios y los objetivos del negocio.\n\nDesarrollé un sistema de diseño completo que incluye componentes UI reutilizables, patrones de interacción, y directrices de accesibilidad. Los recursos visuales creados incluyen pantallas de carga animadas, ilustraciones personalizadas, iconografía consistente, y microinteracciones que mejoran la experiencia del usuario. El resultado es una aplicación moderna, intuitiva y alineada con la identidad institucional de la Universidad Santo Tomás.',
    code: 'JLSM-0005',
    highlights: ['Mobile App Design', 'Motion Graphics', 'Design System'],
    stats: { weeks: '18', screens: '80+', satisfaction: '97%' }
  }
};

// Open project detail
document.querySelectorAll('.project-row').forEach(row => {
  row.addEventListener('click', () => {
    const project = projectsData[row.dataset.project];
    if (project) {
      detailTitle.textContent = project.title;
      detailDesc.textContent = project.desc;
      detailCode.textContent = project.code;
      detailCategory.textContent = project.category;

      // Update highlights
      const highlightItems = document.querySelectorAll('.highlight-text');
      project.highlights.forEach((highlight, i) => {
        if (highlightItems[i]) highlightItems[i].textContent = highlight;
      });

      // Update stats
      document.getElementById('stat-1').textContent = project.stats.weeks;
      document.getElementById('stat-2').textContent = project.stats.screens;
      document.getElementById('stat-3').textContent = project.stats.satisfaction;

      projectDetail.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Animate stat values
      animateStats();
    }
  });
});

// Close project detail
detailClose.addEventListener('click', () => {
  projectDetail.classList.remove('active');
  document.body.style.overflow = '';
});

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectDetail.classList.contains('active')) {
    projectDetail.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Animate stats with counting effect - optimizado
function animateStats() {
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(stat => {
    const finalValue = stat.textContent;
    const isPercentage = finalValue.includes('%');
    const isPlus = finalValue.includes('+');
    const numericValue = parseInt(finalValue);

    let current = 0;
    const increment = numericValue / 20;
    const suffix = isPercentage ? '%' : (isPlus ? '+' : '');

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current) + suffix;
    }, 40);
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Intersection Observer for reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.work-header, .project-row, .about-name, .about-text, .about-stack-title, .footer-top, .footer-tagline, .footer-links, .footer-bottom').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Stagger animation for project rows
document.querySelectorAll('.project-row').forEach((row, i) => {
  row.style.transitionDelay = `${i * 0.08}s`;
});

// Parallax effect for glow orbs - microinteracción hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  document.querySelectorAll('.glow-orb').forEach((el, i) => {
    el.style.transform = `translateY(${scrolled * (0.1 + i * 0.05)}px)`;
  });
}, { passive: true });

// Magnetic effect for buttons - microinteracción hero
if (!isTouchDevice) {
  document.querySelectorAll('.nav-contact, .hero-work-link, .footer-link').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - rect.left - rect.width/2) * 0.2}px, ${(e.clientY - rect.top - rect.height/2) * 0.2}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// ==========================================
// TECH CAROUSEL - Draggable con inercia
// ==========================================
(function initTechCarousel() {
  const carousel = document.getElementById('tech-carousel');
  const track = document.getElementById('tech-carousel-track');
  if (!carousel || !track) return;

  // Duplicar items para loop infinito
  const originalItems = track.innerHTML;
  track.innerHTML = originalItems + originalItems + originalItems;

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let rafId = null;
  let momentumRafId = null;

  // Centrar la vista en el segundo set (el del medio)
  function getItemWidth() {
    const item = track.querySelector('.tech-item');
    return item ? item.offsetWidth + 50 : 150; // 50 = gap
  }

  function getSetWidth() {
    const items = track.querySelectorAll('.tech-item');
    const originalCount = items.length / 3;
    return originalCount * getItemWidth();
  }

  function centerCarousel() {
    const setWidth = getSetWidth();
    currentTranslate = -setWidth;
    prevTranslate = currentTranslate;
    setTranslate(currentTranslate);
  }

  function setTranslate(val) {
    track.style.transform = `translate3d(${val}px, 0, 0)`;
  }

  // Loop infinito - reposicionar cuando se sale de los límites
  function checkLoop() {
    const setWidth = getSetWidth();
    const totalWidth = setWidth * 3;

    if (currentTranslate > -setWidth * 0.3) {
      currentTranslate -= setWidth;
      prevTranslate = currentTranslate;
      track.style.transition = 'none';
      setTranslate(currentTranslate);
    } else if (currentTranslate < -setWidth * 2.7) {
      currentTranslate += setWidth;
      prevTranslate = currentTranslate;
      track.style.transition = 'none';
      setTranslate(currentTranslate);
    }
  }

  function startDrag(x) {
    isDragging = true;
    startX = x;
    scrollLeft = currentTranslate;
    prevTranslate = currentTranslate;
    lastX = x;
    lastTime = Date.now();
    velocity = 0;

    track.classList.add('is-dragging');
    track.classList.remove('has-momentum');
    carousel.style.cursor = 'grabbing';

    if (momentumRafId) {
      cancelAnimationFrame(momentumRafId);
      momentumRafId = null;
    }
  }

  function moveDrag(x) {
    if (!isDragging) return;

    const now = Date.now();
    const dt = now - lastTime;
    const dx = x - lastX;

    if (dt > 0) {
      velocity = dx / dt * 16; // normalizar a ~60fps
    }

    currentTranslate = prevTranslate + (x - startX);
    setTranslate(currentTranslate);

    lastX = x;
    lastTime = now;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    track.classList.remove('is-dragging');
    carousel.style.cursor = 'grab';

    // Aplicar momentum/inercia
    const absVelocity = Math.abs(velocity);

    if (absVelocity > 0.5) {
      track.classList.add('has-momentum');
      applyMomentum();
    } else {
      checkLoop();
    }
  }

  function applyMomentum() {
    const friction = 0.95;
    const minVelocity = 0.1;

    function step() {
      velocity *= friction;
      currentTranslate += velocity;
      setTranslate(currentTranslate);

      checkLoop();

      if (Math.abs(velocity) > minVelocity) {
        momentumRafId = requestAnimationFrame(step);
      } else {
        track.classList.remove('has-momentum');
        snapToNearest();
      }
    }

    momentumRafId = requestAnimationFrame(step);
  }

  function snapToNearest() {
    const itemWidth = getItemWidth();
    const setWidth = getSetWidth();
    const relativePos = currentTranslate % itemWidth;
    let snapOffset = 0;

    if (Math.abs(relativePos) > itemWidth / 2) {
      snapOffset = relativePos > 0 ? itemWidth - relativePos : -itemWidth - relativePos;
    } else {
      snapOffset = -relativePos;
    }

    if (Math.abs(snapOffset) > 1) {
      track.classList.add('has-momentum');
      currentTranslate += snapOffset;
      setTranslate(currentTranslate);

      setTimeout(() => {
        track.classList.remove('has-momentum');
        checkLoop();
      }, 800);
    }
  }

  // Mouse events
  carousel.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.pageX);
  }, { passive: false });

  window.addEventListener('mousemove', (e) => {
    moveDrag(e.pageX);
  }, { passive: true });

  window.addEventListener('mouseup', endDrag);
  window.addEventListener('mouseleave', endDrag);

  // Touch events
  carousel.addEventListener('touchstart', (e) => {
    startDrag(e.touches[0].pageX);
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    moveDrag(e.touches[0].pageX);
  }, { passive: true });

  carousel.addEventListener('touchend', endDrag);

  // Auto-scroll sutil cuando no se está arrastrando
  let autoScrollId = null;
  let autoScrollSpeed = 0.3;

  function autoScroll() {
    if (!isDragging && !momentumRafId) {
      currentTranslate -= autoScrollSpeed;
      setTranslate(currentTranslate);
      checkLoop();
    }
    autoScrollId = requestAnimationFrame(autoScroll);
  }

  // Pausar auto-scroll cuando el mouse está sobre el carrusel
  carousel.addEventListener('mouseenter', () => {
    if (autoScrollId) {
      cancelAnimationFrame(autoScrollId);
      autoScrollId = null;
    }
  });

  carousel.addEventListener('mouseleave', () => {
    if (!autoScrollId && !isDragging && !momentumRafId) {
      autoScrollId = requestAnimationFrame(autoScroll);
    }
  });

  // Inicializar
  function init() {
    // Esperar a que las fuentes y estilos carguen
    setTimeout(() => {
      centerCarousel();
      // Iniciar auto-scroll
      autoScrollId = requestAnimationFrame(autoScroll);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-centrar en resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      centerCarousel();
    }, 250);
  });
})();

// Text scramble effect - versión ligera
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/';
    this.frame = 0;
  }

  setText(newText) {
    const length = newText.length;
    let iterations = 0;
    const maxIterations = 10;

    const interval = setInterval(() => {
      this.el.innerText = newText
        .split('')
        .map((char, i) => {
          if (i < iterations) return newText[i];
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');

      iterations += 1/2;
      if (iterations >= length) {
        clearInterval(interval);
        this.el.innerText = newText;
      }
    }, 30);
  }
}

// Apply scramble effect on project row hover
document.querySelectorAll('.project-row').forEach(row => {
  const nameEl = row.querySelector('.proj-name');
  const originalText = nameEl.textContent;
  const scrambler = new TextScramble(nameEl);

  row.addEventListener('mouseenter', () => {
    scrambler.setText(originalText);
  });
});
