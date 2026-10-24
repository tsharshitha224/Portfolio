/**
 * ==========================================================================
 * HARSHITHA SURESH — BESPOKE CREATIVE DEVELOPER & DESIGNER JAVASCRIPT
 * Engines:
 * 1. Meet Vora Preloader (0-100% counter & kinetic typography)
 * 2. Tim Quirino Hero Interactive Particle Celestial Canvas
 * 3. Dual Cursors: Tim Quirino (Hero) & Meet Vora Morphing (Other sections)
 * 4. Zhenya Rynzhuk Color Collision Transition
 * 5. Creative Works (Canva & Figma) Filter & Lightbox Modal
 * 6. Meet Vora Tactile Orbit Wheel Experience
 * 7. Filterable Achievements System
 * 8. Meet Vora Email Copy Tool & Thibaut Crépelle Mechanical Keyboard
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Web Audio Tactile Synthesizer ---
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playKeyClickSound(pitchFactor = 1.0) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 * pitchFactor, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  function playWhooshSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (e) {}
  }

  // --- 1. Meet Vora Preloader ---
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-count');
    const barEl = document.getElementById('preloader-bar');
    if (!preloader || !counterEl || !barEl) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        counterEl.textContent = '100';
        barEl.style.width = '100%';

        setTimeout(() => {
          if (window.gsap) {
            gsap.to(preloader, {
              yPercent: -100,
              duration: 1.1,
              ease: 'power4.inOut',
              onComplete: () => {
                preloader.style.display = 'none';
                initHeroAnimations();
              }
            });
          } else {
            preloader.style.transform = 'translateY(-100%)';
            preloader.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => { preloader.style.display = 'none'; }, 900);
          }
        }, 320);
      } else {
        counterEl.textContent = progress < 10 ? '0' + progress : progress;
        barEl.style.width = progress + '%';
      }
    }, 25);
  }

  function initHeroAnimations() {
    if (!window.gsap) return;
    gsap.from('.hero-meta-top', { opacity: 0, y: -20, duration: 0.8, ease: 'power2.out' });
    gsap.from('.hero-title-main', { opacity: 0, y: 50, duration: 1.2, delay: 0.2, ease: 'power3.out' });
    gsap.from('.hero-tagline-motto', { opacity: 0, y: 30, duration: 1, delay: 0.4, ease: 'power2.out' });
    gsap.from('.hero-statement-grid', { opacity: 0, y: 40, duration: 1, delay: 0.6, ease: 'power2.out' });
  }

  // --- 2. Tim Quirino Hero Celestial Particle Canvas ---
  function initHeroParticles() {
    const canvas = document.getElementById('hero-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const totalParticles = 45;
    let mouse = { x: width / 2, y: height / 2 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for (let i = 0; i < totalParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(125, 38, 58, ' : 'rgba(37, 34, 31, ',
        alpha: Math.random() * 0.4 + 0.15,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle attraction to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 0.3;
          p.y += (dy / dist) * 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();

        // Connect nearby particles with delicate faint lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d2 < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(125, 38, 58, ${0.12 * (1 - d2 / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // --- 3. Custom Cursors ---
  function initCursors() {
    const dot = document.getElementById('cursor-dot');
    const follower = document.getElementById('cursor-follower');
    const cursorText = document.getElementById('cursor-text');
    const heroSection = document.getElementById('hero');

    if (!dot || !follower || !cursorText) return;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderFollower() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;

      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const isInHero = heroRect.top <= 0 && heroRect.bottom >= 100;

        if (isInHero) {
          if (!follower.classList.contains('hover-override')) {
           follower.classList.remove('cursor-meetvora','cursor-meetvora-charcoal');
            cursorText.textContent = '';
            dot.style.opacity = '1';
          }
        } else {
          if (!follower.classList.contains('hover-override')) {
           follower.classList.add('cursor-meetvora');
          follower.classList.remove('cursor-meetvora-charcoal');
            if (!cursorText.textContent) {
              cursorText.textContent = 'EXPLORE';
            }
          }
        }
      }

      requestAnimationFrame(renderFollower);
    }
    requestAnimationFrame(renderFollower);

    // Contextual Hover triggers
    const hoverElements = document.querySelectorAll('[data-cursor]');
    hoverElements.forEach((el) => {
    el.addEventListener('mouseleave', () => {
    follower.classList.remove(
        'cursor-meetvora',
        'cursor-meetvora-charcoal',
        'hover-override'
    );

    cursorText.textContent = '';
    dot.style.opacity = '1';
    });

      el.addEventListener('mouseleave', () => {
        follower.classList.remove('cursor-meetvora', 'hover-override');
        cursorText.textContent = '';
        dot.style.opacity = '1';
      });
    });

    // Magnetic buttons
    const magnetics = document.querySelectorAll('[data-magnetic]');
    magnetics.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnX = e.clientX - rect.left - rect.width / 2;
        const btnY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${btnX * 0.3}px, ${btnY * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // --- 4. Zhenya Rynzhuk Color Collision Transition ---
  function initCollisionTransitions() {
    const overlay = document.getElementById('collision-overlay');
    const sphereBurgundy = document.querySelector('.sphere-burgundy');
    const sphereCharcoal = document.querySelector('.sphere-charcoal');
    const veil = document.querySelector('.collision-veil');

    if (!overlay || !sphereBurgundy || !sphereCharcoal || !veil) return;

    window.triggerCollisionTransition = function (targetUrlOrSection, callback) {
      overlay.style.display = 'flex';
      playWhooshSound();

      if (window.gsap) {
        const tl = gsap.timeline({
          onComplete: () => {
            if (typeof callback === 'function') callback();
            if (typeof targetUrlOrSection === 'string') {
              if (targetUrlOrSection.startsWith('#')) {
                const targetEl = document.querySelector(targetUrlOrSection);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
              } else if (targetUrlOrSection) {
                window.location.href = targetUrlOrSection;
              }
            }

            gsap.to([sphereBurgundy, sphereCharcoal], {
              scale: 0,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.in'
            });
            gsap.to(veil, {
              opacity: 0,
              duration: 0.45,
              delay: 0.15,
              onComplete: () => {
                overlay.style.display = 'none';
                gsap.set([sphereBurgundy, sphereCharcoal], {
                  scale: 1,
                  opacity: 1,
                  left: -200,
                  right: -200
                });
              }
            });
          }
        });

        tl.set(veil, { opacity: 0 })
          .to(sphereBurgundy, { left: 'calc(50% - 100px)', duration: 0.55, ease: 'back.in(1.2)' }, 0)
          .to(sphereCharcoal, { right: 'calc(50% - 100px)', duration: 0.55, ease: 'back.in(1.2)' }, 0)
          .to([sphereBurgundy, sphereCharcoal], { scaleX: 1.6, scaleY: 0.6, duration: 0.15 })
          .to(veil, { opacity: 1, duration: 0.35 }, '-=0.1')
          .to([sphereBurgundy, sphereCharcoal], { scale: 6, duration: 0.45 });
      } else {
        overlay.style.display = 'none';
        if (typeof targetUrlOrSection === 'string' && targetUrlOrSection.startsWith('#')) {
          const el = document.querySelector(targetUrlOrSection);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const navAnchors = document.querySelectorAll('a.nav-link');
    navAnchors.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          navAnchors.forEach(n => n.classList.remove('active'));
          link.classList.add('active');
          window.triggerCollisionTransition(href);
        }
      });
    });
  }

  // --- 5. Creative Works (Canva & Figma) Filter & Lightbox Modal ---
  function initCreativeWorks() {
    const filterTabs = document.querySelectorAll('.creative-tab-btn');
    const cards = document.querySelectorAll('.creative-card');
    const modal = document.getElementById('creative-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');

    if (!filterTabs.length || !cards.length) return;

    // Filter logic
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        playKeyClickSound(1.2);
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.getAttribute('data-tab') || 'all';

        cards.forEach((card) => {
          const itemCat = card.getAttribute('data-creative-cat') || '';
          if (cat === 'all' || itemCat === cat) {
            card.style.display = 'flex';
            if (window.gsap) {
              gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Lightbox modal logic
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        // If clicking external figma link, allow normal navigation
        if (e.target.closest('.creative-figma-link')) return;

        const img = card.querySelector('img');
        const title = card.querySelector('.creative-title');
        const desc = card.querySelector('.creative-desc');

        if (img && modal && modalImg) {
          playKeyClickSound(1.4);
          modalImg.src = img.src;
          if (modalTitle && title) modalTitle.textContent = title.textContent;
          if (modalDesc && desc) modalDesc.textContent = desc.textContent;
          modal.style.display = 'flex';
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  }

  // --- 6. Meet Vora Tactile Orbit Wheel ---
  function initOrbitWheel() {
    const track = document.getElementById('orbit-nodes-track');
    const nodes = document.querySelectorAll('.tactile-node');
    const coreBtn = document.getElementById('orbit-core');
    const detailTitle = document.getElementById('orbit-detail-title');
    const detailDesc = document.getElementById('orbit-detail-desc');
    const detailBadge = document.getElementById('orbit-detail-badge');

    if (!track || nodes.length === 0) return;

    let currentAngle = 0;
    let isDragging = false;
    let startX = 0;
    let autoRotateSpeed = 0.15;

    const totalNodes = nodes.length;
    const radius = 230;

    function positionNodes() {
      const isMobile = window.innerWidth <= 768;
      const currentRadius = isMobile ? 125 : radius;

      nodes.forEach((node, index) => {
        const angleDeg = (index / totalNodes) * 360 + currentAngle;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = Math.cos(angleRad) * currentRadius;
        const y = Math.sin(angleRad) * currentRadius;
        node.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      });
    }

    function autoSpin() {
      if (!isDragging) {
        currentAngle = (currentAngle + autoRotateSpeed) % 360;
        positionNodes();
      }
      requestAnimationFrame(autoSpin);
    }
    requestAnimationFrame(autoSpin);

    const arena = document.getElementById('orbit-arena');
    if (arena) {
      arena.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        startX = e.clientX;
        currentAngle += deltaX * 0.4;
        positionNodes();
      });

      window.addEventListener('mouseup', () => { isDragging = false; });

      arena.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
      });

      window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        startX = e.touches[0].clientX;
        currentAngle += deltaX * 0.4;
        positionNodes();
      });

      window.addEventListener('touchend', () => { isDragging = false; });
    }

    nodes.forEach((node) => {
      node.addEventListener('click', () => {
        playKeyClickSound(1.4);
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        const role = node.getAttribute('data-role') || '';
        const company = node.getAttribute('data-company') || '';
        const details = node.getAttribute('data-details') || '';
        const badge = node.getAttribute('data-badge') || 'VERIFIED EXPERIENCE';

        if (detailTitle) detailTitle.textContent = `${role} — ${company}`;
        if (detailDesc) detailDesc.textContent = details;
        if (detailBadge) detailBadge.textContent = badge;
      });
    });

    if (coreBtn) {
      coreBtn.addEventListener('click', () => {
        playKeyClickSound(1.6);
        currentAngle = 0;
        positionNodes();
      });
    }

    window.addEventListener('resize', positionNodes);
  }

  // --- 6b. Meet Vora 3D Tilted Ribbon Playground Experience ---
  function initPlaygroundRibbon() {
    const track = document.getElementById('internships-ribbon-track');
    const stage = document.querySelector('.playground-3d-stage');
    const cards = document.querySelectorAll('.playground-card');
    const modal = document.getElementById('internship-modal');
    const btnCloseModal = document.getElementById('btn-close-intern-modal');
    const modalRoleBadge = document.getElementById('modal-role-badge');
    const modalCompanyTitle = document.getElementById('modal-company-title');
    const modalRoleSubtitle = document.getElementById('modal-role-subtitle');
    const modalRoleDesc = document.getElementById('modal-role-desc');
    const modalSkillsCluster = document.getElementById('modal-skills-cluster');

    const internshipData = {
      oasis: {
        badge: 'UI/UX DESIGN INTERNSHIP',
        company: 'Oasis Infobyte',
        subtitle: 'UI/UX Designing Intern • Verified Industry Role',
        desc: 'Engineered comprehensive UI/UX wireframes, intuitive user journeys, full atomic design systems, and responsive glassmorphic web interfaces in Figma. Conducted heuristic evaluations and user testing to minimize cognitive load.',
        skills: ['UI/UX Design', 'Figma Wireframing', 'Design Systems', 'User Journeys', 'Interactive Prototyping', 'Glassmorphism']
      },
      codsoft: {
        badge: 'VISUAL CRAFT & BRANDING INTERNSHIP',
        company: 'Codsoft',
        subtitle: 'Graphic Designing Intern • Verified Industry Role',
        desc: 'Crafted vector visual branding, brand communication assets, and digital marketing collateral with refined color palettes, modern typography standards, and high-impact visual hierarchy across multi-channel campaigns.',
        skills: ['Graphic Design', 'Vector Visuals', 'Brand Identity', 'Adobe Photoshop', 'Canva Systems', 'Visual Hierarchy']
      },
      pyroferus: {
        badge: 'QUALITY ENGINEERING & TESTING INTERNSHIP',
        company: 'Pyroferus Pvt Ltd',
        subtitle: 'Software Testing Intern • Verified Industry Role',
        desc: 'Executed rigorous automated and manual test suites, regression testing, API validation, and bug lifecycles ensuring enterprise production code reliability, software robustness, and zero-defect deployments.',
        skills: ['Manual & Automated QA', 'Regression Testing', 'API Validation', 'Defect Lifecycles', 'Test Automation', 'Test Case Design']
      },
      altrai: {
        badge: 'FULL-STACK APPLICATION DEV INTERNSHIP',
        company: 'Altrai Technologies Pvt Ltd',
        subtitle: 'Application Development Intern • Verified Industry Role',
        desc: 'Developed full-stack application modules, implemented responsive user interface components, and integrated backend RESTful endpoints to ensure scalable data flow and seamless client performance.',
        skills: ['Full-Stack Development', 'RESTful APIs', 'Responsive UI', 'Client Architecture', 'JavaScript (ES6+)', 'Node.js']
      },
      smarted: {
        badge: 'CAMPUS AMBASSADOR & TECH LEADERSHIP',
        company: 'SmartED',
        subtitle: 'Campus Ambassador • University Leadership Role',
        desc: 'Represented SmartED on campus, spearheading student developer outreach, organizing hands-on technical seminars, and driving skill-acceleration programs across engineering batches.',
        skills: ['Campus Ambassador', 'Tech Community Outreach', 'Public Speaking', 'Event Organizing', 'Skill Acceleration']
      },
      tedx: {
        badge: 'MARKETING LEAD & BRAND DIRECTION',
        company: 'TEDx',
        subtitle: 'Marketing Lead • Global Brand Colloquium',
        desc: 'Spearheaded promotional campaigns, digital storytelling, audience acquisition, and creative direction for flagship TEDx events, engaging hundreds of attendees and university delegates.',
        skills: ['Marketing Lead', 'Creative Direction', 'Audience Acquisition', 'Digital Storytelling', 'Brand Campaigns']
      }
    };

    if (!track) return;

    let currentX = 0;
    let targetX = 0;
    let isDragging = false;
    let startX = 0;
    let dragStartX = 0;
    let autoSpeed = 0.65;
    let isHovered = false;

    // Smooth auto-scroll loop
    function animateRibbon() {
      if (!isDragging && !isHovered) {
        targetX -= autoSpeed;
      }
      
      const trackWidth = track.scrollWidth / 2;
      if (trackWidth > 0) {
        if (Math.abs(targetX) >= trackWidth) {
          targetX += trackWidth;
          currentX += trackWidth;
        } else if (targetX > 0) {
          targetX -= trackWidth;
          currentX -= trackWidth;
        }
      }

      currentX += (targetX - currentX) * 0.1;
      track.style.transform = `rotateX(22deg) translate3d(${currentX.toFixed(2)}px, 0, 0)`;

      requestAnimationFrame(animateRibbon);
    }
    requestAnimationFrame(animateRibbon);

    if (stage) {
      stage.addEventListener('mouseenter', () => { isHovered = true; });
      stage.addEventListener('mouseleave', () => {
        isHovered = false;
        isDragging = false;
        stage.style.cursor = '';
      });

      stage.addEventListener('mousedown', (e) => {
        if (e.target.closest('#internship-modal')) return;
        isDragging = true;
        startX = e.clientX;
        dragStartX = targetX;
        stage.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        targetX = dragStartX + deltaX * 1.5;
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          if (stage) stage.style.cursor = '';
        }
      });

      // Touch events for mobile
      stage.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        dragStartX = targetX;
      }, { passive: true });

      stage.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        targetX = dragStartX + deltaX * 1.5;
      }, { passive: true });

      stage.addEventListener('touchend', () => {
        isDragging = false;
      });
    }

    // Card Click -> Open Detail Modal
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-internship');
        const data = internshipData[key];
        if (!data || !modal) return;

        playKeyClickSound(1.4);
        if (modalRoleBadge) modalRoleBadge.textContent = data.badge;
        if (modalCompanyTitle) modalCompanyTitle.textContent = data.company;
        if (modalRoleSubtitle) modalRoleSubtitle.textContent = data.subtitle;
        if (modalRoleDesc) modalRoleDesc.textContent = data.desc;

        if (modalSkillsCluster) {
          modalSkillsCluster.innerHTML = data.skills
            .map(s => `<span class="modal-tag">${s}</span>`)
            .join('');
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      if (!modal) return;
      playKeyClickSound(1.1);
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- 7. 3D Fan Turning Slides Achievements System (Meet Vora Framer Inspired) ---
  function init3DFanAchievements() {
    const stage = document.getElementById('achievements-fan-stage');
    const deck = document.getElementById('fan-deck');
    const prevBtn = document.getElementById('fan-btn-prev');
    const nextBtn = document.getElementById('fan-btn-next');
    const currentNumEl = document.getElementById('fan-current-num');
    const totalNumEl = document.getElementById('fan-total-num');
    const activeLabelEl = document.getElementById('fan-active-label');
    const progressBar = document.getElementById('fan-progress-bar');
    const filterBtns = document.querySelectorAll('.achievements-filter-tabs .filter-btn');
    const btnViewFan = document.getElementById('btn-view-fan');
    const btnViewGrid = document.getElementById('btn-view-grid');
    const gridContainer = document.getElementById('achievements-grid-container');
    const rawCards = gridContainer ? gridContainer.querySelectorAll('.achievement-card') : [];

    if (!deck || !rawCards.length) return;

    // Parse achievement card data from the semantic markup
    const achievementsData = Array.from(rawCards).map((card, idx) => {
      const cat = card.getAttribute('data-category') || 'hackathon';
      const catEl = card.querySelector('.achievement-cat');
      const rankEl = card.querySelector('.achievement-rank-pill');
      const titleEl = card.querySelector('h4');
      const descEl = card.querySelector('p');
      const footerSpans = card.querySelectorAll('.achievement-footer span');
      const titleText = titleEl ? titleEl.textContent.trim() : '';
      const rankText = rankEl ? rankEl.textContent.trim() : '';
      const isPatent = titleText.toLowerCase().includes('patent') || rankText.toLowerCase().includes('patent');

      let icon = '⚡';
      let theme = `theme-${cat}`;
      if (isPatent) {
        icon = '📜';
        theme = 'theme-patent';
      } else if (cat === 'bis') {
        icon = '🏛️';
      } else if (cat === 'hackathon') {
        icon = '🏆';
      } else if (cat === 'nptel') {
        icon = '🎓';
      } else if (cat === 'leadership') {
        icon = '🌟';
      }

      return {
        id: idx,
        category: cat,
        theme: theme,
        icon: icon,
        isPatent: isPatent,
        catName: catEl ? catEl.textContent.trim() : 'Honors',
        rank: rankText || 'Distinction',
        title: titleText,
        desc: descEl ? descEl.textContent.trim() : '',
        footerLeft: footerSpans[0] ? footerSpans[0].textContent.trim() : 'Verified',
        footerRight: footerSpans[1] ? footerSpans[1].textContent.trim() : 'Honors'
      };
    });

    let activeFilter = 'all';
    let currentCategoryItems = [...achievementsData];
    let currentIndex = 0;
    let cardElements = [];

    // Build DOM elements inside the fan deck
    function renderFanSlides() {
      deck.innerHTML = '';
      cardElements = currentCategoryItems.map((item, idx) => {
        const card = document.createElement('article');
        card.className = `fan-slide-card ${item.theme}`;
        card.setAttribute('data-fan-index', idx);
        card.setAttribute('data-cursor', 'TURN');

        let subtitle = item.rank;
        if (item.catName && item.catName !== item.rank) {
          subtitle += ` — ${item.catName}`;
        } else if (item.footerLeft) {
          subtitle += ` — ${item.footerLeft}`;
        }

        card.innerHTML = `
          <div class="fan-card-pill"></div>
          <div class="fan-card-body">
            <p class="fan-card-desc">${item.desc}</p>
          </div>
          <div class="fan-card-bottom">
            <h3 class="fan-card-title">${item.title}</h3>
            <div class="fan-card-subtitle">${subtitle}</div>
          </div>
        `;

        card.addEventListener('click', (e) => {
          e.stopPropagation();
          if (idx !== currentIndex) {
            playWhooshSound();
            currentIndex = idx;
            updateFanPositions(true);
          } else {
            playKeyClickSound(1.4);
          }
        });

        deck.appendChild(card);
        return card;
      });

      updateFanPositions(false);
    }

    // Apply Meet Vora 3D fan perspective positioning
    function updateFanPositions(animate = true) {
      if (!currentCategoryItems.length) return;

      const total = currentCategoryItems.length;
      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex >= total) currentIndex = total - 1;

      const isMobile = window.innerWidth < 768;
      const stepX = isMobile ? 180 : 255;
      const step2X = isMobile ? 320 : 460;

      cardElements.forEach((card, idx) => {
        const diff = idx - currentIndex;

        if (animate) {
          card.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, filter 0.5s ease, box-shadow 0.5s ease';
        } else {
          card.style.transition = 'none';
        }

        if (diff === 0) {
          card.classList.add('active');
          card.setAttribute('data-cursor', 'HONOR');
          card.style.transform = 'translate3d(0, 0, 80px) rotateY(0deg) scale(1)';
          card.style.opacity = '1';
          card.style.filter = 'brightness(1)';
          card.style.zIndex = '50';
          card.style.pointerEvents = 'auto';
        } else if (diff === 1) {
          card.classList.remove('active');
          card.setAttribute('data-cursor', 'TURN');
          card.style.transform = `translate3d(${stepX}px, 0, -40px) rotateY(-18deg) scale(0.92)`;
          card.style.opacity = '0.78';
          card.style.filter = 'brightness(0.85)';
          card.style.zIndex = '40';
          card.style.pointerEvents = 'auto';
        } else if (diff === -1) {
          card.classList.remove('active');
          card.setAttribute('data-cursor', 'TURN');
          card.style.transform = `translate3d(-${stepX}px, 0, -40px) rotateY(18deg) scale(0.92)`;
          card.style.opacity = '0.78';
          card.style.filter = 'brightness(0.85)';
          card.style.zIndex = '40';
          card.style.pointerEvents = 'auto';
        } else if (diff === 2) {
          card.classList.remove('active');
          card.setAttribute('data-cursor', 'TURN');
          card.style.transform = `translate3d(${step2X}px, 0, -140px) rotateY(-32deg) scale(0.82)`;
          card.style.opacity = '0.42';
          card.style.filter = 'brightness(0.65)';
          card.style.zIndex = '30';
          card.style.pointerEvents = 'auto';
        } else if (diff === -2) {
          card.classList.remove('active');
          card.setAttribute('data-cursor', 'TURN');
          card.style.transform = `translate3d(-${step2X}px, 0, -140px) rotateY(32deg) scale(0.82)`;
          card.style.opacity = '0.42';
          card.style.filter = 'brightness(0.65)';
          card.style.zIndex = '30';
          card.style.pointerEvents = 'auto';
        } else {
          const farDir = diff > 0 ? 1 : -1;
          card.classList.remove('active');
          card.style.transform = `translate3d(${farDir * (step2X + 160)}px, 0, -260px) rotateY(${-farDir * 45}deg) scale(0.7)`;
          card.style.opacity = '0';
          card.style.filter = 'brightness(0.3)';
          card.style.zIndex = '10';
          card.style.pointerEvents = 'none';
        }
      });

      // Update HUD elements
      if (currentNumEl) currentNumEl.textContent = String(currentIndex + 1).padStart(2, '0');
      if (totalNumEl) totalNumEl.textContent = String(total).padStart(2, '0');
      if (activeLabelEl && currentCategoryItems[currentIndex]) {
        activeLabelEl.textContent = currentCategoryItems[currentIndex].title;
      }
      if (progressBar) {
        const pct = ((currentIndex + 1) / total) * 100;
        progressBar.style.width = `${pct}%`;
      }
    }

    function goToNext() {
      if (!currentCategoryItems.length) return;
      playWhooshSound();
      currentIndex = (currentIndex + 1) % currentCategoryItems.length;
      updateFanPositions(true);
    }

    function goToPrev() {
      if (!currentCategoryItems.length) return;
      playWhooshSound();
      currentIndex = (currentIndex - 1 + currentCategoryItems.length) % currentCategoryItems.length;
      updateFanPositions(true);
    }

    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);

    // Drag / Swipe Interaction
    if (stage) {
      let isDragging = false;
      let startX = 0;
      let currentX = 0;
      let dragStartTime = 0;

      function onDragStart(clientX) {
        isDragging = true;
        startX = clientX;
        currentX = clientX;
        dragStartTime = Date.now();
      }

      function onDragMove(clientX) {
        if (!isDragging) return;
        currentX = clientX;
        const deltaX = currentX - startX;
        const isMobile = window.innerWidth < 768;
        const stepX = isMobile ? 180 : 255;
        const dragFactor = deltaX * 0.75;

        cardElements.forEach((card, idx) => {
          const diff = idx - currentIndex;
          card.style.transition = 'none';

          if (diff === 0) {
            const rotY = Math.max(-16, Math.min(16, deltaX * 0.05));
            card.style.transform = `translate3d(${dragFactor}px, 0, 80px) rotateY(${rotY}deg) scale(1)`;
          } else if (diff === 1) {
            const rotY = Math.max(-26, Math.min(-10, -18 + deltaX * 0.03));
            card.style.transform = `translate3d(${stepX + dragFactor * 0.65}px, 0, -40px) rotateY(${rotY}deg) scale(0.92)`;
          } else if (diff === -1) {
            const rotY = Math.max(10, Math.min(26, 18 + deltaX * 0.03));
            card.style.transform = `translate3d(${-stepX + dragFactor * 0.65}px, 0, -40px) rotateY(${rotY}deg) scale(0.92)`;
          }
        });
      }

      function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        const deltaX = currentX - startX;
        const elapsed = Date.now() - dragStartTime;
        const velocity = Math.abs(deltaX) / (elapsed || 1);

        if (deltaX < -45 || (deltaX < -20 && velocity > 0.35)) {
          goToNext();
        } else if (deltaX > 45 || (deltaX > 20 && velocity > 0.35)) {
          goToPrev();
        } else {
          updateFanPositions(true);
        }
      }

      stage.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        onDragStart(e.clientX);
      });

      window.addEventListener('mousemove', (e) => {
        onDragMove(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        onDragEnd();
      });

      stage.addEventListener('touchstart', (e) => {
        if (e.target.closest('button')) return;
        onDragStart(e.touches[0].clientX);
      }, { passive: true });

      stage.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        onDragMove(e.touches[0].clientX);
      }, { passive: true });

      stage.addEventListener('touchend', () => {
        onDragEnd();
      });

      window.addEventListener('resize', () => {
        updateFanPositions(false);
      });

      // Keyboard navigation when hovering stage
      let isHovered = false;
      stage.addEventListener('mouseenter', () => { isHovered = true; });
      stage.addEventListener('mouseleave', () => { isHovered = false; });

      window.addEventListener('keydown', (e) => {
        if (!isHovered) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          goToPrev();
        }
      });
    }

    // Category Filter Buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        playKeyClickSound(1.2);
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeFilter = btn.getAttribute('data-filter') || 'all';

        // Filter items for 3D Fan
        if (activeFilter === 'all') {
          currentCategoryItems = [...achievementsData];
        } else {
          currentCategoryItems = achievementsData.filter(item => item.category === activeFilter);
        }

        currentIndex = 0;
        renderFanSlides();

        // Also synchronize the semantic grid view
        if (rawCards.length) {
          rawCards.forEach((card) => {
            const cat = card.getAttribute('data-category') || '';
            if (activeFilter === 'all' || cat === activeFilter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });

    // View Mode Toggle (3D Fan Deck vs Grid View)
    if (btnViewFan && btnViewGrid && stage && gridContainer) {
      btnViewFan.addEventListener('click', () => {
        playKeyClickSound(1.3);
        btnViewFan.classList.add('active');
        btnViewGrid.classList.remove('active');
        stage.style.display = 'flex';
        gridContainer.style.display = 'none';
        updateFanPositions(false);
      });

      btnViewGrid.addEventListener('click', () => {
        playKeyClickSound(1.3);
        btnViewGrid.classList.add('active');
        btnViewFan.classList.remove('active');
        stage.style.display = 'none';
        gridContainer.style.display = 'grid';

        // Ensure grid reflects the active category
        rawCards.forEach((card) => {
          const cat = card.getAttribute('data-category') || '';
          if (activeFilter === 'all' || cat === activeFilter) {
            card.style.display = 'flex';
            if (window.gsap) {
              gsap.fromTo(card, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 });
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // Initial render
    renderFanSlides();
  }

  // --- 8. Meet Vora Email Copy Tool & Mechanical Keyboard Console ---
  function initContactAndKeyboard() {
    const btnCopy = document.getElementById('btn-copy-email');
    const toast = document.getElementById('copy-toast');
    const terminalOutput = document.getElementById('terminal-text');
    const keycaps = document.querySelectorAll('.keycap');
    const btnClear = document.getElementById('btn-clear-terminal');
    const btnSend = document.getElementById('btn-send-terminal');

    // 1-Click Copy Email Tool
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        playKeyClickSound(1.3);
        const email = 'tsharshitha22@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
          if (toast) {
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 2500);
          }
        });
      });
    }

    // Keyboard Interactive Console
    if (!terminalOutput) return;

    let message = '';
    terminalOutput.textContent = '(type your message here...)';

    function appendChar(char) {
      if (message.length < 90) {
        message += char;
        terminalOutput.textContent = message;
      }
    }

    function removeChar() {
      message = message.slice(0, -1);
      terminalOutput.textContent = message || '(type your message here...)';
    }

    function pressKeyVisual(keyElement) {
      if (!keyElement) return;
      keyElement.classList.add('pressed');
      playKeyClickSound(Math.random() * 0.4 + 0.8);
      setTimeout(() => { keyElement.classList.remove('pressed'); }, 120);
    }

    keycaps.forEach((key) => {
      key.addEventListener('click', (e) => {
        e.preventDefault();
        pressKeyVisual(key);
        key.blur();

        const val = key.getAttribute('data-key');
        const action = key.getAttribute('data-action');
        const link = key.getAttribute('data-link');

        if (link) {
          window.open(link, '_blank');
          return;
        }

        if (action === 'backspace') {
          removeChar();
        } else if (action === 'space') {
          if (terminalOutput.textContent.startsWith('(')) message = '';
          appendChar(' ');
        } else if (action === 'clear') {
          message = '';
          terminalOutput.textContent = '(screen cleared - type your note)';
        } else if (action === 'enter') {
          triggerSendEmail();
        } else if (val) {
          if (terminalOutput.textContent.startsWith('(')) message = '';
          appendChar(val);
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          if (e.key === ' ' || e.key === 'Backspace' || e.key === 'Enter') {
            e.preventDefault();
          }

          const pressedKeyChar = e.key.toUpperCase();
          const targetKey = document.querySelector(`.keycap[data-key="${pressedKeyChar}"]`);

          if (targetKey) {
            e.preventDefault();
            pressKeyVisual(targetKey);
            targetKey.blur();
            if (terminalOutput.textContent.startsWith('(')) message = '';
            appendChar(e.key);
          } else if (e.key === 'Backspace') {
            const bspKey = document.querySelector('.keycap[data-action="backspace"]');
            pressKeyVisual(bspKey);
            if (bspKey) bspKey.blur();
            removeChar();
          } else if (e.key === ' ') {
            const spaceKey = document.querySelector('.keycap[data-action="space"]');
            pressKeyVisual(spaceKey);
            if (spaceKey) spaceKey.blur();
            if (terminalOutput.textContent.startsWith('(')) message = '';
            appendChar(' ');
          } else if (e.key === 'Enter') {
            const enterKey = document.querySelector('.keycap[data-action="enter"]');
            if (enterKey) {
              pressKeyVisual(enterKey);
              enterKey.blur();
            }
            triggerSendEmail();
          }
        }
      }
    });

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        playKeyClickSound(0.9);
        message = '';
        terminalOutput.textContent = '(screen cleared)';
      });
    }

    function triggerSendEmail() {
      playKeyClickSound(1.5);
      const email = 'tsharshitha22@gmail.com';
      const subject = encodeURIComponent('Design & Engineering Collaboration with Harshitha');
      const noteBody = encodeURIComponent(message || 'Hello Harshitha, let\'s collaborate on design and engineering!');

      // Direct Webmail URL (Opens Gmail compose directly in a new tab)
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${noteBody}`;
      const mailtoUrl = `mailto:${email}?subject=${subject}&body=${noteBody}`;

      // Open new window/tab directly with noopener
      const newTab = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        const fallbackLink = document.createElement('a');
        fallbackLink.href = mailtoUrl;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener noreferrer';
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
      }
    }

    if (btnSend) {
      btnSend.addEventListener('click', triggerSendEmail);
    }
  }

  // --- 9. Header Controls & Live Chennai Clock ---
  function initHeaderControls() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const clockEl = document.getElementById('live-clock');

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
          initAudio();
          audioBtn.classList.add('playing');
          audioBtn.querySelector('.audio-status').textContent = 'AUDIO ON';
          playKeyClickSound(1.2);
        } else {
          audioBtn.classList.remove('playing');
          audioBtn.querySelector('.audio-status').textContent = 'MUTE';
        }
      });
    }

    function updateClock() {
      if (!clockEl) return;
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      clockEl.textContent = new Intl.DateTimeFormat('en-GB', options).format(now) + ' IST';
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // --- Initialize All Systems ---
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initHeroParticles();
    initCursors();
    initCollisionTransitions();
    initCreativeWorks();
    initPlaygroundRibbon();
    initOrbitWheel();
    init3DFanAchievements();
    initContactAndKeyboard();
    initHeaderControls();
  });

})();
