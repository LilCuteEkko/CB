// Clinicians Blueprint — Theme System v2
// Scroll chroma · Theme persistence · Smooth transitions

(function() {
  // Apply saved theme immediately (before DOM loads to prevent flash)
  var saved = localStorage.getItem('cb-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function() {

    // === THEME TOGGLE ===
    var btns = document.querySelectorAll('.theme-btn');
    btns.forEach(function(btn) {
      if (btn.dataset.theme === saved) btn.classList.add('active');
      btn.addEventListener('click', function() {
        var theme = this.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cb-theme', theme);
        btns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
      });
    });

    // === SCROLL CHROMA LINE ===
    // Add the chroma line element if not present
    if (!document.querySelector('.chroma-line')) {
      var cl = document.createElement('div');
      cl.className = 'chroma-line';
      document.body.prepend(cl);
    }
    var chromaLine = document.querySelector('.chroma-line');

    window.addEventListener('scroll', function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPct = docHeight > 0 ? scrollTop / docHeight : 0;
      
      // Update chroma progress bar
      if (chromaLine) {
        chromaLine.style.transform = 'scaleX(' + Math.min(scrollPct, 1) + ')';
      }
    }, { passive: true });

    // === STAGGER ANIMATION ON SCROLL ===
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    // Observe accordion items for scroll-reveal
    document.querySelectorAll('.ma-item, .rc2, .bl-strip, .card').forEach(function(el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity .5s ease ' + (i % 6) * 0.04 + 's, transform .5s ease ' + (i % 6) * 0.04 + 's';
      observer.observe(el);
    });

  });
})();
