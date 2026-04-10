/* ================================================
   THE VILLAGE CAFÉ & PLAY — Main JavaScript
   ================================================ */

/* ---- SMOOTH SCROLL ---- */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 72; // nav height
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* ---- NAV SCROLL SHADOW ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navMobile.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

function closeMenu() {
  navMobile.classList.remove('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
}

/* ---- SCROLL ANIMATIONS ---- */
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, parseInt(delay));
      animateObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('[data-animate]').forEach(el => {
  animateObserver.observe(el);
});

/* ---- HERO PROGRESS BAR (simulated founding spots) ---- */
// This simulates 12 spots already taken. 
// In production, replace with a real API call to your backend or Mailchimp count.
const TOTAL_SPOTS = 100;
const TAKEN_SPOTS = 12; // Update this number manually or via API

function updateSpotsCounter() {
  const remaining = TOTAL_SPOTS - TAKEN_SPOTS;
  const pct = (TAKEN_SPOTS / TOTAL_SPOTS) * 100;

  const countEl = document.getElementById('spots-count');
  const fillEl = document.getElementById('progress-fill');

  if (countEl) {
    // Animate the count
    let current = TOTAL_SPOTS;
    const step = Math.ceil((TOTAL_SPOTS - remaining) / 30);
    const interval = setInterval(() => {
      current = Math.max(current - step, remaining);
      countEl.textContent = current;
      if (current <= remaining) clearInterval(interval);
    }, 30);
  }

  if (fillEl) {
    setTimeout(() => {
      fillEl.style.width = pct + '%';
    }, 400);
  }
}

// Trigger counter when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    updateSpotsCounter();
    heroObserver.disconnect();
  }
}, { threshold: 0.3 });
const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

/* ---- POLL ---- */
const pollButtons = document.querySelectorAll('.poll-btn');
const pollResult = document.getElementById('poll-result');
const POLL_KEY = 'village_poll_answer';

// Restore previous vote if any
const savedVote = localStorage.getItem(POLL_KEY);
if (savedVote) {
  pollButtons.forEach(btn => {
    if (btn.dataset.answer === savedVote) {
      btn.classList.add('selected');
    }
  });
  if (pollResult) {
    pollResult.textContent = 'Thank you — your answer helps us build the right village. 🌿';
  }
}

pollButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    pollButtons.forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    const answer = this.dataset.answer;
    localStorage.setItem(POLL_KEY, answer);

    if (pollResult) {
      pollResult.style.opacity = '0';
      setTimeout(() => {
        pollResult.textContent = 'Thank you — your answer helps us build the right village. 🌿';
        pollResult.style.opacity = '1';
      }, 200);
    }

    // Optional: Send to a free analytics endpoint
    // You can replace this with Google Analytics, Plausible, or a simple fetch to your backend
    // sendPollResponse(answer);
  });
});

/* 
  OPTIONAL: Send poll answers to a Google Sheet (free!)
  Uncomment and fill in your Google Apps Script URL.
  See README.md for setup instructions.
  
function sendPollResponse(answer) {
  const url = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer, timestamp: new Date().toISOString() })
  }).catch(() => {}); // Silent fail is fine
}
*/

/* ---- MAILCHIMP FORM ENHANCEMENT ---- */
// This adds a nicer UX on top of Mailchimp's standard form submission.
// The form still works even without JavaScript (standard form POST).

const waitlistForm = document.getElementById('waitlist-form');

if (waitlistForm) {
  waitlistForm.addEventListener('submit', function(e) {
    const emailInput = document.getElementById('mce-EMAIL');
    const submitBtn = document.getElementById('mc-embedded-subscribe');

    if (!emailInput || !emailInput.value.trim()) {
      e.preventDefault();
      emailInput.style.borderColor = 'rgba(201,125,96,0.7)';
      emailInput.focus();
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.textContent = 'Joining...';
      submitBtn.disabled = true;
    }

    // The form submits normally to Mailchimp (target="_blank")
    // After 2s we show the local success message as a UX improvement
    setTimeout(() => {
      if (waitlistForm) waitlistForm.style.display = 'none';
      const successBlock = document.getElementById('success-block');
      if (successBlock) successBlock.style.display = 'block';
    }, 2000);
  });

  // Clear error state on input
  const emailInput = document.getElementById('mce-EMAIL');
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      this.style.borderColor = '';
    });
  }
}

/* ---- ACTIVE NAV LINK HIGHLIGHTING ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + id) {
          link.style.color = 'var(--dark)';
        }
      });
    }
  });
}, {
  threshold: 0.4,
  rootMargin: '-64px 0px 0px 0px'
});

sections.forEach(section => sectionObserver.observe(section));

/* ---- URL PARAM SUCCESS STATE ---- */
// Mailchimp redirects back with ?mc_cid=... after successful subscription
// We can use this to show a persistent success message
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('mc_cid') || urlParams.has('subscribed')) {
  const form = document.getElementById('waitlist-form');
  const successBlock = document.getElementById('success-block');
  if (form) form.style.display = 'none';
  if (successBlock) successBlock.style.display = 'block';
  scrollTo('waitlist');
}

/* ---- CONSOLE EASTER EGG ---- */
console.log('%c🏡 The Village', 'font-family: Georgia, serif; font-size: 24px; color: #C97D60;');
console.log('%cA sanctuary for parents, a world of play for children.', 'font-size: 12px; color: #7D8E7E;');
console.log('%cComing to Bonn in 2028.', 'font-size: 12px; color: #6B6560;');
