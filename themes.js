(function(){
var saved = localStorage.getItem('cb-theme') || 'light';
document.documentElement.setAttribute('data-theme', saved);
var scale = parseFloat(localStorage.getItem('cb-font-scale') || '1');
document.documentElement.style.setProperty('--font-scale', scale);
var fontPref = localStorage.getItem('cb-font-body') || 'Manrope';
if(fontPref !== 'Manrope') {
document.documentElement.style.setProperty('--font-body', fontPref + ', sans-serif');
}
document.addEventListener('DOMContentLoaded', function(){
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
var nav = document.querySelector('.site-nav');
if(nav && !document.querySelector('.font-controls')){
var fc = document.createElement('div');
fc.className = 'font-controls';
fc.innerHTML = '<button class="font-sz-btn" data-dir="-1" title="Smaller text">A\u2212</button>' +
'<button class="font-sz-btn" data-dir="1" title="Larger text">A+</button>' +
'<select class="font-select" title="Font family">' +
'<option value="Manrope"' + (fontPref==='Manrope'?' selected':'') + '>Manrope</option>' +
'<option value="Inter"' + (fontPref==='Inter'?' selected':'') + '>Inter</option>' +
'<option value="Source Sans 3"' + (fontPref==='Source Sans 3'?' selected':'') + '>Source Sans</option>' +
'<option value="Georgia"' + (fontPref==='Georgia'?' selected':'') + '>Georgia</option>' +
'<option value="Atkinson Hyperlegible"' + (fontPref==='Atkinson Hyperlegible'?' selected':'') + '>Atkinson</option>' +
'</select>';
var themeToggle = nav.querySelector('.theme-toggle');
if(themeToggle) nav.insertBefore(fc, themeToggle);
else nav.appendChild(fc);
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=Atkinson+Hyperlegible:wght@400;700&display=swap';
document.head.appendChild(link);
}
document.querySelectorAll('.font-sz-btn').forEach(function(btn){
btn.addEventListener('click', function(){
var dir = parseInt(this.dataset.dir);
scale = Math.max(0.85, Math.min(1.25, scale + dir * 0.05));
document.documentElement.style.setProperty('--font-scale', scale);
localStorage.setItem('cb-font-scale', scale);
});
});
var fontSel = document.querySelector('.font-select');
if(fontSel){
fontSel.addEventListener('change', function(){
var f = this.value;
document.documentElement.style.setProperty('--font-body', f + ', sans-serif');
document.body.style.fontFamily = f + ', sans-serif';
localStorage.setItem('cb-font-body', f);
});
}
window.addEventListener('scroll', function(){
var pct = document.documentElement.scrollTop / ((document.documentElement.scrollHeight - window.innerHeight) || 1);
document.body.style.filter = 'hue-rotate(' + (pct * 8).toFixed(1) + 'deg)';
}, {passive: true});
var io = new IntersectionObserver(function(entries){
entries.forEach(function(e){
if(e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; io.unobserve(e.target); }
});
}, {threshold:.06, rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.ma-item,.rc2,.bl-strip,.card,.feat-card,.review-card,.module-card,.compare-card').forEach(function(el,i){
el.style.opacity='0'; el.style.transform='translateY(12px)';
el.style.transition='opacity .5s ease '+(i%8)*.05+'s,transform .5s ease '+(i%8)*.05+'s,border-color .25s,box-shadow .25s';
io.observe(el);
});
var orb1=document.querySelector('.orb1'),orb2=document.querySelector('.orb2');
if(orb1||orb2){ window.addEventListener('scroll',function(){var s=window.pageYOffset;if(orb1)orb1.style.transform='translate('+s*.08+'px,'+s*.12+'px)';if(orb2)orb2.style.transform='translate(-'+s*.06+'px,-'+s*.1+'px)';},{passive:true}); }
document.querySelectorAll('.chip-nav').forEach(function(cn){
if(cn.parentElement.classList.contains('tab-layout')) return;
var panels = [];
var el = cn.nextElementSibling;
while(el){
if(el.classList.contains('tab-panel') || (el.id && el.id.indexOf('tab-') === 0)){
panels.push(el);
} else if(el.tagName === 'SCRIPT' || el.tagName === 'FOOTER' || el.classList.contains('site-nav')){
break;
} else if(!el.classList.contains('tab-panel') && el.id && el.id.indexOf('tab-') !== 0 && el.tagName !== 'DIV'){
break;
}
el = el.nextElementSibling;
}
if(panels.length === 0) return;
var wrapper = document.createElement('div');
wrapper.className = 'tab-layout';
cn.parentElement.insertBefore(wrapper, cn);
wrapper.appendChild(cn);
panels.forEach(function(p){ wrapper.appendChild(p); });
});
document.querySelectorAll('.ma-tags').forEach(function(tags){
tags.style.display = 'none';
});
});
})();