const header = document.querySelector("header[data-header]");
function updateHeader(){ header.classList.toggle("scrolled", window.scrollY > 24); }
updateHeader(); window.addEventListener("scroll",updateHeader,{passive:true});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if(entry.isIntersecting){ entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
document.querySelector("[data-year]").textContent = new Date().getFullYear();

if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  const hero = document.querySelector(".hero>img");
  window.addEventListener("scroll",()=>{ if(window.scrollY < innerHeight) hero.style.transform=`translateY(${window.scrollY*.04}px) scale(1.01)`; },{passive:true});
}
