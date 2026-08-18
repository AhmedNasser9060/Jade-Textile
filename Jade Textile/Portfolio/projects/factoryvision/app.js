const workers = [
  { id:"014", name:"Mahmoud A.", department:"Sewing", checkin:"07:54", active:"6h 31m", status:"Active" },
  { id:"019", name:"Omar S.", department:"Sewing", checkin:"07:57", active:"6h 24m", status:"Active" },
  { id:"021", name:"Hassan M.", department:"Sewing", checkin:"08:06", active:"5h 58m", status:"Review" },
  { id:"032", name:"Youssef K.", department:"Cutting", checkin:"07:49", active:"6h 37m", status:"Active" },
  { id:"035", name:"Ali R.", department:"Cutting", checkin:"07:52", active:"6h 29m", status:"Active" },
  { id:"044", name:"Mostafa E.", department:"Finishing", checkin:"08:01", active:"6h 12m", status:"Active" }
];

const tbody = document.querySelector("[data-workers]");
const filter = document.querySelector("[data-department]");
function renderWorkers(){
  const rows = workers.filter(w => filter.value === "all" || w.department === filter.value);
  tbody.innerHTML = rows.map(w => `<tr><td>${w.name}<br><span class="worker-id">ID ${w.id}</span></td><td>${w.department}</td><td>${w.checkin}</td><td>${w.active}</td><td><span class="status ${w.status === "Review" ? "review" : ""}">${w.status}</span></td></tr>`).join("");
}
filter.addEventListener("change", renderWorkers); renderWorkers();

const privacy = document.querySelector("[data-privacy]");
function updatePrivacy(){ document.querySelectorAll(".feed").forEach(feed => feed.classList.toggle("is-private", privacy.checked)); }
privacy.addEventListener("change", updatePrivacy); updatePrivacy();

document.querySelectorAll(".review-item button").forEach(button => button.addEventListener("click", () => {
  button.textContent = "Resolved"; button.classList.add("resolved");
  const pending = document.querySelectorAll(".review-item button:not(.resolved)").length;
  document.querySelector("[data-review]").textContent = pending;
  document.querySelector(".count").textContent = pending;
}));

document.querySelector("[data-menu]").addEventListener("click", () => document.querySelector("[data-sidebar]").classList.toggle("open"));
document.querySelectorAll(".sidebar nav a").forEach(link => link.addEventListener("click", () => document.querySelector("[data-sidebar]").classList.remove("open")));

function tick(){ document.querySelector("[data-clock]").textContent = new Date().toLocaleTimeString("en-GB"); }
tick(); setInterval(tick, 1000);

document.querySelector("[data-export]").addEventListener("click", () => {
  const header = "Worker ID,Name,Department,Check-in,Active time,Status\n";
  const csv = header + workers.map(w => [w.id,w.name,w.department,w.checkin,w.active,w.status].join(",")).join("\n");
  const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); link.download = "factoryvision-shift-demo.csv"; link.click(); URL.revokeObjectURL(link.href);
});
