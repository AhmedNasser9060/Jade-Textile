const header = document.querySelector("[data-header]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.13 }
);
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const route = document.querySelector("[data-route]");
const stations = [...document.querySelectorAll("[data-station]")];
const routeProgress = document.querySelector(".route-progress");

function selectStation(index) {
  stations.forEach((station, stationIndex) => station.classList.toggle("is-active", stationIndex <= index));
  if (!routeProgress) return;
  const mobile = window.matchMedia("(max-width: 640px)").matches;
  if (mobile) {
    routeProgress.style.width = "100%";
    routeProgress.style.height = `${index * 50}%`;
  } else {
    routeProgress.style.height = "100%";
    routeProgress.style.width = `${index * 50}%`;
  }
}

stations.forEach((station, index) => station.addEventListener("click", () => selectStation(index)));
selectStation(0);

if (route && !reduceMotion) {
  const routeObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    [0, 1, 2].forEach((step) => window.setTimeout(() => selectStation(step), 350 + step * 650));
    routeObserver.disconnect();
  }, { threshold: 0.5 });
  routeObserver.observe(route);
}

if (!reduceMotion) {
  const heroImage = document.querySelector(".hero-media");
  window.addEventListener("scroll", () => {
    if (window.scrollY < window.innerHeight && heroImage) {
      heroImage.style.transform = `scale(1.015) translateY(${window.scrollY * 0.045}px)`;
    }
  }, { passive: true });
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
