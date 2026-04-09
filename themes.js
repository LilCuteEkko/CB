// Clinicians Blueprint v4 — Enhanced Theme Engine
(function(){
  var saved = localStorage.getItem('cb-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.addEventListener('DOMContentLoaded', function(){
    // Theme toggle
    var btns = document.querySelectorAll('.theme-btn');
    btns.forEach(function(btn){
      if(btn.dataset.theme === saved) btn.classList.add('active');
      btn.addEventListener('click', function(){
        var t = this.dataset.theme;
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('cb-theme', t);
        btns.forEach(function(b){b.classList.remove('active')});
        this.classList.add('active');
      });
    });

    // Scroll chroma bar
    var chroma = document.querySelector('.chroma-line');
    if(!chroma){
      chroma = document.createElement('div');
      chroma.className = 'chroma-line';
      var nav = document.querySelector('.site-nav');
      if(nav) nav.after(chroma);
      else document.body.prepend(chroma);
    }

    // Scroll handler — chroma + color shift
    var hueShift = 0;
    window.addEventListener('scroll', function(){
      var scrollTop = document.documentElement.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = scrollTop / (scrollHeight || 1);

      // Chroma bar
      if(chroma) chroma.style.transform = 'scaleX(' + Math.min(pct, 1) + ')';

      // Subtle hue shift on body — rotate 0 to 8 degrees as you scroll
      hueShift = pct * 8;
      document.body.style.filter = 'hue-rotate(' + hueShift.toFixed(1) + 'deg)';
    }, {passive: true});

    // Scroll reveal with stagger
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, {threshold: .06, rootMargin: '0px 0px -30px 0px'});

    document.querySelectorAll('.ma-item, .rc2, .bl-strip, .card, .feat-card, .review-card, .module-card, .compare-card').forEach(function(el, i){
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity .5s ease ' + (i % 8) * .05 + 's, transform .5s ease ' + (i % 8) * .05 + 's, border-color .25s, box-shadow .25s';
      io.observe(el);
    });

    // Parallax on hero orbs (if they exist on index)
    var orb1 = document.querySelector('.orb1');
    var orb2 = document.querySelector('.orb2');
    if(orb1 || orb2){
      window.addEventListener('scroll', function(){
        var s = window.pageYOffset;
        if(orb1) orb1.style.transform = 'translate(' + s*.08 + 'px,' + s*.12 + 'px)';
        if(orb2) orb2.style.transform = 'translate(-' + s*.06 + 'px,-' + s*.1 + 'px)';
      }, {passive: true});
    }
  });
})();
