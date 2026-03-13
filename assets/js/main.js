// Main JavaScript for Portfolio Interactions

document.addEventListener('DOMContentLoaded', function() {
  // Terminal cursor effect
  const cursor = document.querySelector('.terminal-cursor');
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.innerHTML = navLinks.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Active navigation on scroll + navbar scroll glass effect
  const sections = document.querySelectorAll('section[id]');
  const navbar = document.querySelector('.navbar');
  
  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    // Add scrolled class for enhanced glass effect
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink?.classList.add('active');
      } else {
        navLink?.classList.remove('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);

  // Back to top button
  const backToTopBtn = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Typewriter effect
  const typewriterElement = document.querySelector('.typewriter');
  if (typewriterElement) {
    const words = JSON.parse(typewriterElement.dataset.words);
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }
      
      typewriterElement.textContent = currentWord.substring(0, charIndex);
      
      let typeSpeed = 90;
      
      if (isDeleting) {
        typeSpeed = 50;
      }
      
      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
      }
      
      setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1200);
  }

  // Code typing animation for backend.py window (loop + syntax colors)
  const codeTarget = document.getElementById('backend-code');
  const codeSource = document.getElementById('backend-code-source');

  const normalizeIndent = (text) => {
    const lines = text.replace(/\t/g, '  ').split('\n');
    const nonEmpty = lines.filter((line) => line.trim().length > 0);
    const minIndent = Math.min(
      ...nonEmpty.map((line) => (line.match(/^\s+/) || [''])[0].length)
    );
    return lines.map((line) => line.slice(minIndent)).join('\n').trim();
  };

  const highlightPython = (code) => {
    const escapeHtml = (str) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let html = escapeHtml(code);

    // Strings
    html = html.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, '<span class="string">$1</span>');
    // Decorators
    html = html.replace(/(^|\s)(@[\w\.]+)/g, '$1<span class="decorator">$2</span>');
    // Comments
    html = html.replace(/(#.*?$)/gm, '<span class="comment">$1</span>');
    // Keywords
    html = html.replace(/\b(async|await|def|return|class|from|import|as|if|elif|else|for|while|try|except|with|pass|True|False|None)\b/g, '<span class="keyword">$1</span>');
    // Numbers
    html = html.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

    return html;
  };

  if (codeTarget && codeSource) {
    const fullText = normalizeIndent(codeSource.textContent);
    let index = 0;
    const speed = 14;
    const pause = 1200;

    const typeCode = () => {
      const slice = fullText.slice(0, index);
      codeTarget.innerHTML = highlightPython(slice);
      index += 1;

      if (index <= fullText.length) {
        setTimeout(typeCode, speed);
      } else {
        setTimeout(() => {
          index = 0;
          codeTarget.innerHTML = '';
          setTimeout(typeCode, 400);
        }, pause);
      }
    };

    setTimeout(typeCode, 600);
  }

  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll('.skill-level');
  
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const level = bar.dataset.level;
      const isInViewport = bar.getBoundingClientRect().top < window.innerHeight;
      
      if (isInViewport && !bar.style.width) {
        bar.style.width = level + '%';
      }
    });
  }
  
  // Initial check
  animateSkillBars();
  
  // Check on scroll
  window.addEventListener('scroll', animateSkillBars);

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for fade-in-up scroll animations
  const fadeElements = document.querySelectorAll('.fade-in-up');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve so re-scrolling up then down re-triggers (optional: unobserve for one-shot)
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  const featuredProjectsData = [
    {
      title: 'Pakistan Traveling Assistant',
      description:
        'A comprehensive travel platform with intelligent destination recommendations, trip planning algorithms, and real-time data processing.',
      image: 'assets/images/pak_trv.png',
      alt: 'Pakistan Traveling Assistant',
      tech: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
      status: 'Backend Complete',
      iconClass: 'fas fa-plane',
      highlight: true
    },
    {
      title: 'Event Management System',
      description:
        'Full-featured event management platform with role-based access control, real-time notifications, and automated scheduling.',
      image: 'assets/images/image.png',
      alt: 'Event Management System',
      tech: ['Python', 'Django', 'PostgreSQL', 'Celery'],
      status: 'Production Ready',
      iconClass: 'fas fa-calendar-alt',
      highlight: true
    },
    {
      title: 'Automated Lectures System',
      description:
        'AI-powered lecture automation system with smart scheduling, content distribution, and performance analytics.',
      image: 'assets/images/automated_lectures.png',
      alt: 'Automated Lectures System',
      tech: ['Python', 'Flask', 'SQLite', 'Machine Learning'],
      status: 'In Development',
      iconClass: 'fas fa-chalkboard-teacher',
      highlight: true
    },
    {
      title: 'Kids Coding LMS',
      description:
        'A learning platform for young coders featuring guided lessons, progress tracking, and interactive challenges.',
      image: 'assets/images/kidicode.png',
      alt: 'Kids Coding LMS',
      tech: ['Python', 'Django', 'PostgreSQL'],
      status: 'Backend Complete',
      iconClass: 'fas fa-child',
      highlight: true
    },
    {
      title: 'Lucky Draw System',
      description:
        'A fair draw system handling participants, entries, and randomized winners with complete admin oversight.',
      image: 'assets/images/lucky.png',
      alt: 'Lucky Draw System',
      tech: ['PHP', 'JavaScript', 'MySQL'],
      status: 'Production Ready',
      iconClass: 'fas fa-dice',
      highlight: true
    },
    {
      title: 'Trace Fake',
      description:
        'A verification backend that evaluates submissions against trusted data to highlight duplicates and fake records.',
      image: 'assets/images/trace.png',
      alt: 'Trace Fake',
      tech: ['Python', 'FastAPI', 'PostgreSQL'],
      status: 'Backend Complete',
      iconClass: 'fas fa-shield-alt',
      highlight: true
    }
  ];

  const featuredRotator = document.getElementById('featured-projects-rotator');
  const featuredSlots = featuredRotator ? featuredRotator.querySelectorAll('.project-card') : [];

  const pickRandomProjects = () => {
    const pool = [...featuredProjectsData];
    const targetCount = Math.min(featuredSlots.length, pool.length);
    const selected = [];

    while (selected.length < targetCount && pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      selected.push(pool.splice(index, 1)[0]);
    }

    return selected;
  };

  const renderFeaturedProjects = (projects) => {
    featuredSlots.forEach((slot, index) => {
      const project = projects[index];

      if (!project) {
        slot.style.display = 'none';
        return;
      }

      slot.style.display = '';
      slot.querySelector('.project-thumb').src = project.image;
      slot.querySelector('.project-thumb').alt = project.alt;
      slot.querySelector('.project-icon i').className = project.iconClass;
      slot.querySelector('h3').textContent = project.title;
      slot.querySelector('.project-description').textContent = project.description;
      slot.querySelector('.project-tech').innerHTML = project.tech.map(tech => `<span>${tech}</span>`).join('');
      slot.querySelector('.status-text').textContent = project.status;
      slot.querySelector('.status-dot').classList.toggle('active', !!project.highlight);
    });
  };

  if (featuredSlots.length) {
    renderFeaturedProjects(pickRandomProjects());
    setInterval(() => {
      renderFeaturedProjects(pickRandomProjects());
    }, 3000);
  }

  // Parallax effect for floating shapes
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.1);
      shape.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
  });

  // Project card hover effect enhancement
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '1';
    });
  });

  // Copy email to clipboard
  const emailLink = document.querySelector('a[href^="mailto"]');
  emailLink?.addEventListener('click', (e) => {
    const email = emailLink.href.replace('mailto:', '');
    
    // Create a temporary textarea to copy the email
    const textarea = document.createElement('textarea');
    textarea.value = email;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show a subtle notification
    const originalText = emailLink.textContent;
    emailLink.textContent = 'Email copied!';
    
    setTimeout(() => {
      emailLink.textContent = originalText;
    }, 2000);
  });

  // Initialize skill bars animation on load
  setTimeout(animateSkillBars, 500);
});
