/* ================================================
   DIZLOVED — script.js
   Interactive functionality for the website
   ================================================ */

// ── Utility: run when DOM is ready ──
document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────
  // 1. NAVBAR — scroll effect + active link
  // ─────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Add 'scrolled' class for solid background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load

  // ─────────────────────────────────────────────
  // 2. HAMBURGER MENU (mobile)
  // ─────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksMenu = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksMenu.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinksMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinksMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─────────────────────────────────────────────
  // 3. PORTFOLIO FILTER TABS
  // ─────────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const matches = filter === 'all' || category === filter;

        if (matches) {
          item.classList.remove('hidden');
          // Stagger animation
          item.style.animationDelay = `${index * 0.07}s`;
          item.style.animation = 'none';
          // Force reflow
          void item.offsetWidth;
          item.style.animation = 'fadeUp 0.45s ease both';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ─────────────────────────────────────────────
  // 4. VIDEO AUTOPLAY (IntersectionObserver)
  //    Videos autoplay when visible, pause when not
  // ─────────────────────────────────────────────
  const videos = document.querySelectorAll('.port-video');

  if (videos.length > 0) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          // Try to play the video; handle browsers that block autoplay
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay was prevented — video stays paused (already has muted)
            });
          }
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.3 });

    videos.forEach(video => {
      video.muted = true;       // Ensure muted for autoplay policy
      video.playsInline = true; // Mobile compatibility
      videoObserver.observe(video);
    });
  }

  // ─────────────────────────────────────────────
  // 5. SCROLL REVEAL ANIMATION
  //    Adds .visible class when element enters viewport
  // ─────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.service-card, .portfolio-item, .about-grid, .contact-grid, .footer-top');

  // Add reveal class to elements
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─────────────────────────────────────────────
  // 6. CONTACT FORM — submission handler
  //    Simulates submission; replace with real API call
  // ─────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather form data (replace this block with your actual API call)
      const formData = {
        name:    document.getElementById('name').value,
        email:   document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
      };
      console.log('Form submitted:', formData); // ← Replace with API call

      // Show success message
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Simulate a short delay (remove in production)
      setTimeout(() => {
        formSuccess.style.display = 'block';
        submitBtn.textContent = 'Message Sent ✅';
        contactForm.reset();

        // Reset button after a delay
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message ✦';
          formSuccess.style.display = 'none';
        }, 5000);
      }, 1000);
    });
  }

  // ─────────────────────────────────────────────
  // 7. SMOOTH SCROLL for anchor links
  // ─────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height offset
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─────────────────────────────────────────────
  // 8. MODAL — SERVICE DETAILS
  // ─────────────────────────────────────────────

  // Service data — edit these to update modal content
  const serviceData = {
    graphic: {
      icon: '🎨',
      title: 'Graphic Designing',
      desc: 'We create visual identities that communicate, inspire, and resonate. From logos to full brand systems, our design work is purposeful and distinctive.',
      features: [
        'Logo & Brand Identity',
        'Marketing Collateral (flyers, brochures, banners)',
        'Social Media Graphics',
        'Packaging & Label Design',
        'UI/UX Design & Style Guides',
      ],
    },
    video: {
      icon: '🎬',
      title: 'Video Editing',
      desc: 'Cinematic video production and editing that tells your brand story. We handle everything from raw footage to color-graded, music-synced final cuts.',
      features: [
        'Brand Films & Commercials',
        'Explainer & Product Videos',
        'Short-form Social Reels (Insta, TikTok)',
        'Motion Graphics & Animation',
        'Color Grading & Sound Design',
      ],
    },
    social: {
      icon: '📣',
      title: 'Social Media Advertisement',
      desc: 'Performance-driven ad campaigns designed to grow your audience, generate leads, and maximize return on ad spend across all platforms.',
      features: [
        'Facebook & Instagram Ads',
        'TikTok & YouTube Campaigns',
        'Audience Research & Targeting',
        'Ad Creative Design & Copywriting',
        'Campaign Analytics & Reporting',
      ],
    },
    webdev: {
      icon: '💻',
      title: 'Web Development',
      desc: 'Fast, scalable, and secure web applications built with modern technologies. Whether it's a landing page or a complex SaaS product, we deliver.',
      features: [
        'React / Next.js Applications',
        'Node.js / Python Backends',
        'E-commerce & CMS Integration',
        'API Development & Integration',
        'Performance & Security Optimization',
      ],
    },
    webdesign: {
      icon: '🖥️',
      title: 'Web Design',
      desc: 'Conversion-focused web design that looks stunning on every device. We blend aesthetics with usability to create memorable digital experiences.',
      features: [
        'Wireframing & Prototyping',
        'Responsive UI/UX Design',
        'Landing Page Design',
        'Figma / Adobe XD Handoffs',
        'Accessibility-First Design',
      ],
    },
    seo: {
      icon: '🔍',
      title: 'SEO Optimization',
      desc: 'Data-driven SEO strategies that improve your search rankings, increase organic traffic, and build long-term authority in your niche.',
      features: [
        'Technical SEO Audit & Fixes',
        'Keyword Research & Strategy',
        'On-Page & Off-Page Optimization',
        'Content Strategy & Blogging',
        'Monthly Reporting & Analytics',
      ],
    },
  };

  // Open modal
  window.openModal = function (serviceKey) {
    const data = serviceData[serviceKey];
    if (!data) return;

    document.getElementById('modalIcon').textContent = data.icon;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.desc;

    const featureList = document.getElementById('modalFeatures');
    featureList.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      featureList.appendChild(li);
    });

    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  window.closeModal = function () {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
  };

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ─────────────────────────────────────────────
  // 9. HERO ORBS — subtle mouse parallax effect
  // ─────────────────────────────────────────────
  const orbs = document.querySelectorAll('.hero-orb');

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 18;
      orb.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
  });

  // ─────────────────────────────────────────────
  // 10. STAGGER REVEAL for service cards
  // ─────────────────────────────────────────────
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        serviceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.35s ease, box-shadow 0.35s ease';
    serviceObserver.observe(card);
  });

});
