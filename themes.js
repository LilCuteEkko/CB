// Clinicians Blueprint v3 — Theme Engine
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
    // Scroll chroma
    if(!document.querySelector('.chroma-line')){
      var cl = document.createElement('div');
      cl.className = 'chroma-line';
      document.body.prepend(cl);
    }
    var chroma = document.querySelector('.chroma-line');
    window.addEventListener('scroll', function(){
      var pct = document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight) || 0;
      if(chroma) chroma.style.transform = 'scaleX(' + Math.min(pct,1) + ')';
    }, {passive:true});
    // Scroll reveal
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.style.opacity='1';
          e.target.style.transform='translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, {threshold:.06, rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.ma-item,.rc2,.bl-strip,.card').forEach(function(el,i){
      el.style.opacity='0';
      el.style.transform='translateY(10px)';
      el.style.transition='opacity .45s ease '+(i%8)*.04+'s,transform .45s ease '+(i%8)*.04+'s';
      io.observe(el);
    });
  });
})();
