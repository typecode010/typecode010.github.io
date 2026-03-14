document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const page = body.dataset.page || 'home';
  const navCandidates = document.querySelectorAll('.nav-link');
  const updateActiveLink = () => {
    if (page !== 'home') {
      return;
    }

    const scrollPosition = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) {
        return;
      }

      if (scrollPosition >= top && scrollPosition < top + height) {
        navCandidates.forEach((navLink) => navLink.classList.remove('active'));
        link.classList.add('active');
      }
    });
  };

  if (page === 'home') {
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const typewriterElement = document.querySelector('.typewriter');
  if (typewriterElement) {
    const words = JSON.parse(typewriterElement.dataset.words || '[]');
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const runTypewriter = () => {
      const current = words[wordIndex] || '';
      if (!deleting) {
        charIndex += 1;
      } else {
        charIndex -= 1;
      }

      typewriterElement.textContent = current.slice(0, charIndex);

      let speed = deleting ? 45 : 85;
      if (!deleting && charIndex === current.length) {
        speed = 1200;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 360;
      }

      setTimeout(runTypewriter, speed);
    };

    if (words.length > 0) {
      setTimeout(runTypewriter, 500);
    }
  }

  const codeTarget = document.getElementById('backend-code');
  const codeSource = document.getElementById('backend-code-source');
  if (codeTarget && codeSource) {
    const snippets = [
      codeSource.textContent.trim(),
      `from fastapi import FastAPI\nfrom routes.health import router as health_router\nfrom services.cache import setup_cache\n\napp = FastAPI(title=\"Ali Sher Backend\")\napp.include_router(health_router)\n\n@app.on_event(\"startup\")\nasync def startup():\n    await setup_cache()\n\n@app.get(\"/status\")\nasync def status():\n    return {\"service\": \"ready\", \"uptime\": \"stable\"}`,
      `class Metrics:\n    def __init__(self, client):\n        self.client = client\n\n    async def record_latency(self, endpoint, ms):\n        payload = {\"endpoint\": endpoint, \"latency_ms\": ms}\n        await self.client.write(payload)\n\n# reliability is a feature, not an afterthought`
    ];

    const keywordPattern = /\b(from|import|as|class|def|return|async|await|if|else|for|in|raise|try|except)\b/g;
    const functionPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/g;
    const stringPattern = /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/g;
    const commentPattern = /(#[^\n]*)/g;

    const highlight = (text) =>
      text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(commentPattern, '<span class="cm">$1</span>')
        .replace(stringPattern, '<span class="str">$1</span>')
        .replace(keywordPattern, '<span class="kw">$1</span>')
        .replace(functionPattern, '<span class="fn">$1</span>');

    let snippetIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const runCodeType = () => {
      const activeSnippet = snippets[snippetIndex];

      if (!deleting) {
        charIndex += 1;
      } else {
        charIndex -= 2;
      }

      if (charIndex < 0) {
        charIndex = 0;
      }

      const visible = activeSnippet.slice(0, charIndex);
      codeTarget.innerHTML = highlight(visible);

      let delay = deleting ? 16 : 12;
      if (!deleting && charIndex >= activeSnippet.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        snippetIndex = (snippetIndex + 1) % snippets.length;
        delay = 320;
      }

      setTimeout(runCodeType, delay);
    };

    setTimeout(runCodeType, 600);
  }

  const skillBars = document.querySelectorAll('.skill-level');
  if (skillBars.length) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const level = entry.target.getAttribute('data-level') || '0';
            const delay = Number(entry.target.dataset.delay || 0);
            setTimeout(() => {
              entry.target.style.width = `${level}%`;
            }, delay);
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillBars.forEach((bar, index) => {
      bar.dataset.delay = String((index % 4) * 110);
      skillObserver.observe(bar);
    });
  }

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const handleTopButton = () => {
      if (window.scrollY > 350) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    };

    window.addEventListener('scroll', handleTopButton);
    handleTopButton();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const featuredProjectsData = [
    {
      title: 'Pakistan Traveling Assistant',
      description: 'Recommendation-driven travel backend with itinerary intelligence and robust API design.',
      image: 'assets/images/pak_trv.png',
      alt: 'Pakistan Traveling Assistant',
      tech: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
      status: 'Backend Complete',
      iconClass: 'fas fa-plane',
    },
    {
      title: 'Event Management System',
      description: 'Role-based event backend supporting notifications, scheduling, and operational analytics.',
      image: 'assets/images/image.png',
      alt: 'Event Management System',
      tech: ['Python', 'Django', 'PostgreSQL', 'Celery'],
      status: 'Production Ready',
      iconClass: 'fas fa-calendar-check',
    },
    {
      title: 'Automated Lectures System',
      description: 'Automation-heavy lecture backend with content sequencing and monitoring pipelines.',
      image: 'assets/images/automated_lectures.png',
      alt: 'Automated Lectures System',
      tech: ['Python', 'Flask', 'SQLite', 'ML'],
      status: 'In Development',
      iconClass: 'fas fa-robot',
    },
    {
      title: 'Trace Fake',
      description: 'Data verification backend for fraud detection and duplicate traceability.',
      image: 'assets/images/trace.png',
      alt: 'Trace Fake',
      tech: ['Python', 'FastAPI', 'PostgreSQL'],
      status: 'Backend Complete',
      iconClass: 'fas fa-shield',
    },
  ];

  const featuredContainer = document.getElementById('featured-projects-rotator');
  if (featuredContainer && body.dataset.page === 'home') {
    const slots = featuredContainer.querySelectorAll('[data-slot]');

    const randomSelection = () => {
      const pool = [...featuredProjectsData];
      const result = [];
      const count = Math.min(slots.length, pool.length);
      while (result.length < count) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        result.push(pool.splice(randomIndex, 1)[0]);
      }
      return result;
    };

    const renderSlots = (projects) => {
      slots.forEach((slot, index) => {
        const project = projects[index];
        if (!project) {
          slot.style.display = 'none';
          return;
        }

        const image = slot.querySelector('.project-thumb');
        const icon = slot.querySelector('.project-icon i');
        const title = slot.querySelector('h3');
        const description = slot.querySelector('.project-description');
        const tech = slot.querySelector('.project-tech');
        const status = slot.querySelector('.status-text');

        image.src = project.image;
        image.alt = project.alt;
        icon.className = project.iconClass;
        title.textContent = project.title;
        description.textContent = project.description;
        tech.innerHTML = project.tech.map((item) => `<span>${item}</span>`).join('');
        status.textContent = project.status;
      });
    };

    renderSlots(randomSelection());
    setInterval(() => renderSlots(randomSelection()), 4800);
  }

  if (body.dataset.page === 'vu-projects') {
    const semesterTabs = document.querySelectorAll('.semester-tab');
    const semesterPanels = document.querySelectorAll('[data-semester-panel]');
    const semesterToggle = document.getElementById('semester-toggle');
    const semesterPanelsWrapper = document.getElementById('semester-panels-wrapper');

    const activateSemester = (semester) => {
      semesterTabs.forEach((tab) => {
        const active = tab.dataset.semester === semester;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });

      semesterPanels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.semesterPanel === semester);
      });
    };

    semesterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activateSemester(tab.dataset.semester);
      });
    });

    if (semesterToggle && semesterPanelsWrapper) {
      semesterToggle.addEventListener('click', () => {
        const collapsed = semesterPanelsWrapper.classList.toggle('is-collapsed');
        semesterToggle.setAttribute('aria-expanded', String(!collapsed));
        semesterToggle.innerHTML = collapsed
          ? '<i class="fas fa-chevron-right"></i> Show Semester Projects'
          : '<i class="fas fa-chevron-down"></i> Hide Semester Projects';
      });
    }

    const feedbackCarousel = document.querySelector('[data-feedback-carousel]');
    if (feedbackCarousel) {
      const track = feedbackCarousel.querySelector('.feedback-track');
      const slides = track ? Array.from(track.querySelectorAll('.feedback-slide')) : [];
      const prevButton = document.getElementById('feedback-prev');
      const nextButton = document.getElementById('feedback-next');
      const viewButtons = document.querySelectorAll('.feedback-view-btn');

      let currentIndex = 0;
      let visibleSlides = window.innerWidth < 700 ? 1 : 3;
      const gap = 14;

      const clampIndex = () => {
        const maxIndex = Math.max(0, slides.length - visibleSlides);
        currentIndex = Math.min(currentIndex, maxIndex);
      };

      const renderCarousel = () => {
        if (!slides.length) {
          return;
        }

        const containerWidth = feedbackCarousel.clientWidth;
        const slideWidth = (containerWidth - gap * (visibleSlides - 1)) / visibleSlides;

        slides.forEach((slide) => {
          slide.style.minWidth = `${slideWidth}px`;
          slide.style.maxWidth = `${slideWidth}px`;
        });

        clampIndex();
        track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;

        if (prevButton) {
          prevButton.disabled = currentIndex === 0;
        }
        if (nextButton) {
          nextButton.disabled = currentIndex >= Math.max(0, slides.length - visibleSlides);
        }
      };

      if (prevButton) {
        prevButton.addEventListener('click', () => {
          currentIndex = Math.max(0, currentIndex - 1);
          renderCarousel();
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => {
          currentIndex = Math.min(Math.max(0, slides.length - visibleSlides), currentIndex + 1);
          renderCarousel();
        });
      }

      viewButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const mode = Number(button.dataset.feedbackView || 3);
          visibleSlides = mode;
          viewButtons.forEach((item) => item.classList.remove('is-active'));
          button.classList.add('is-active');
          currentIndex = 0;
          renderCarousel();
        });
      });

      let touchStartX = 0;
      let touchEndX = 0;

      feedbackCarousel.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
      });

      feedbackCarousel.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX;
        const delta = touchEndX - touchStartX;

        if (Math.abs(delta) < 50) {
          return;
        }

        if (delta < 0) {
          currentIndex = Math.min(Math.max(0, slides.length - visibleSlides), currentIndex + 1);
        } else {
          currentIndex = Math.max(0, currentIndex - 1);
        }
        renderCarousel();
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth < 700 && visibleSlides > 1) {
          visibleSlides = 1;
          viewButtons.forEach((item) => item.classList.remove('is-active'));
          const oneByOneButton = document.querySelector('.feedback-view-btn[data-feedback-view="1"]');
          oneByOneButton?.classList.add('is-active');
        }
        renderCarousel();
      });

      renderCarousel();
    }
  }
});
