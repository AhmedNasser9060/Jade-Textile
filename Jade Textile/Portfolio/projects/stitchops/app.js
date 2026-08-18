const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const departments = ["Sewing", "Cutting", "Finishing", "Packing"];
const lines = ["Line A", "Line B", "Line C", "Line D", "Line E"];
const weeks = Array.from({ length: 26 }, (_, i) => i + 1);

// Deterministic synthetic factory data. Kept in-browser so every filter is fully interactive.
const records = [];
weeks.forEach((week) => {
  const month = months[Math.min(5, Math.floor((week - 1) / 4.34))];
  departments.forEach((department, d) => {
    lines.forEach((line, l) => {
      const season = Math.sin((week / 26) * Math.PI) * 0.12;
      const deptFactor = [1, 1.18, .92, 1.28][d];
      const lineFactor = [.98, 1.09, .91, 1.03, .86][l];
      const hours = Math.round(315 + d * 23 + l * 12 + (week % 4) * 9);
      const overtime = Math.round(Math.max(8, 22 + (week % 6) * 5 + (l === 4 ? 13 : 0) - d * 2));
      const productivity = (4.48 + season + d * .16) * deptFactor * lineFactor;
      const units = Math.round(hours * productivity);
      const defectRate = 1.55 + l * .18 + overtime * .018 + (d === 0 ? .18 : 0) - season * 2;
      const defects = Math.round(units * defectRate / 100);
      const target = Math.round(hours * 4.82 * deptFactor * (1 + d * .018));
      const efficiency = Math.min(98, 76 + productivity * 2.25 - overtime * .09 + season * 20);
      records.push({ week, month, department, line, hours, overtime, units, defects, target, efficiency: +efficiency.toFixed(1) });
    });
  });
});

const fmt = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const icons = {
  grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  chart:'<svg viewBox="0 0 24 24"><path d="M4 19V9m6 10V5m6 14v-7m5 7H2"/></svg>',
  users:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6M16 5.5a3 3 0 0 1 0 5.8M17 14c2.7.4 4 2.1 4 5"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>',
  download:'<svg viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/></svg>',
  book:'<svg viewBox="0 0 24 24"><path d="M4 5c4-1 6 0 8 2v13c-2-2-4-3-8-2V5Zm16 0c-4-1-6 0-8 2v13c2-2 4-3 8-2V5Z"/></svg>',
  bell:'<svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8ZM10 21h4"/></svg>',
  clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  box:'<svg viewBox="0 0 24 24"><path d="m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10"/></svg>',
  bolt:'<svg viewBox="0 0 24 24"><path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/></svg>',
  alert:'<svg viewBox="0 0 24 24"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5m0 3v.1"/></svg>'
};
document.querySelectorAll("[data-icon]").forEach(el => el.innerHTML = icons[el.dataset.icon] || "");

months.forEach(m => document.querySelector("#monthFilter").insertAdjacentHTML("beforeend", `<option value="${m}">${m} 2026</option>`));
document.querySelector("#refreshDate").textContent = new Intl.DateTimeFormat("en", { month:"short", day:"numeric" }).format(new Date());

const sum = (arr, key) => arr.reduce((a, x) => a + x[key], 0);
const avg = (arr, key) => arr.length ? sum(arr, key) / arr.length : 0;
const selectedData = () => records.filter(r =>
  (monthFilter.value === "all" || r.month === monthFilter.value) &&
  (departmentFilter.value === "all" || r.department === departmentFilter.value)
);

function aggregate(data) {
  const hours = sum(data, "hours"), units = sum(data, "units"), defects = sum(data, "defects");
  return { hours, units, defects, overtime: sum(data,"overtime"), target: sum(data,"target"), productivity: (units - defects) / hours, defectRate: defects / units * 100, efficiency: avg(data,"efficiency") };
}

function renderKpis(data) {
  const a = aggregate(data);
  const cards = [
    ["Paid labor hours", fmt.format(a.hours), "+4.2%", "vs prior period", "clock", "up"],
    ["Good units produced", compact.format(a.units - a.defects), "+7.8%", "vs prior period", "box", "up"],
    ["Units per labor hour", a.productivity.toFixed(2), "+3.4%", "productivity gain", "bolt", "up"],
    ["Defect rate", a.defectRate.toFixed(2) + "%", "−0.3pp", "quality improvement", "alert", "up"]
  ];
  kpiGrid.innerHTML = cards.map(c => `<article class="kpi-card"><div class="kpi-top"><span>${c[0]}</span><i class="kpi-icon">${icons[c[4]]}</i></div><div class="kpi-value">${c[1]}</div><div class="kpi-foot"><span class="delta ${c[5]}">${c[2]}</span>${c[3]}</div></article>`).join("");
}

function group(data, key) {
  return Object.values(data.reduce((acc, r) => { const k=r[key]; if(!acc[k]) acc[k]={ name:k, rows:[] }; acc[k].rows.push(r); return acc; }, {}));
}

function renderTrend(data) {
  const grouped = group(data,"week").sort((a,b)=>+a.name-+b.name);
  const points = grouped.map(g => ({ week:+g.name, ...aggregate(g.rows) }));
  const W=760,H=220,p={l:38,r:35,t:12,b:24};
  const maxU=Math.max(...points.map(x=>x.units))*1.12, maxH=Math.max(...points.map(x=>x.hours))*1.12;
  const x=i=>p.l+i*(W-p.l-p.r)/Math.max(1,points.length-1), yu=v=>p.t+(H-p.t-p.b)*(1-v/maxU), yh=v=>p.t+(H-p.t-p.b)*(1-v/maxH);
  const outPts=points.map((d,i)=>`${x(i)},${yu(d.units)}`).join(" "), hourPts=points.map((d,i)=>`${x(i)},${yh(d.hours)}`).join(" ");
  const area=`M ${x(0)} ${H-p.b} L ${outPts.replaceAll(" "," L ")} L ${x(points.length-1)} ${H-p.b} Z`;
  const ticks=[0,.25,.5,.75,1];
  trendChart.innerHTML=`<svg class="chart-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#80d6b2" stop-opacity=".28"/><stop offset="1" stop-color="#80d6b2" stop-opacity="0"/></linearGradient></defs>${ticks.map(t=>`<line class="grid" x1="${p.l}" y1="${p.t+(H-p.t-p.b)*t}" x2="${W-p.r}" y2="${p.t+(H-p.t-p.b)*t}"/><text x="0" y="${p.t+(H-p.t-p.b)*t+3}">${compact.format(maxU*(1-t))}</text>`).join("")}<path class="area" d="${area}"/><polyline class="output-line" points="${outPts}"/><polyline class="hours-line" points="${hourPts}"/>${points.map((d,i)=>i%Math.max(1,Math.ceil(points.length/7))===0?`<circle class="point-mint" cx="${x(i)}" cy="${yu(d.units)}" r="3"/><text text-anchor="middle" x="${x(i)}" y="${H-5}">W${d.week}</text>`:"").join("")}</svg>`;
}

function renderInsights(data) {
  const a=aggregate(data), byLine=group(data,"line").map(g=>({line:g.name,...aggregate(g.rows)})).sort((a,b)=>b.productivity-a.productivity);
  const score=Math.round(Math.min(96,a.efficiency));
  insightContent.innerHTML=`<div class="insight-score"><strong>${score}</strong><span>/ 100 operational health</span></div><div class="score-track"><i style="width:${score}%"></i></div><div class="insight-list"><div class="insight-row"><i>↗</i><span><b>${byLine[0].line}</b> leads productivity at ${byLine[0].productivity.toFixed(2)} units/hour.</span></div><div class="insight-row"><i>!</i><span><b>${byLine.at(-1).line}</b> trails the leader by ${((1-byLine.at(-1).productivity/byLine[0].productivity)*100).toFixed(0)}%; review balancing and downtime.</span></div><div class="insight-row"><i>✓</i><span>Quality remains controlled at <b>${a.defectRate.toFixed(2)}%</b>, despite ${fmt.format(a.overtime)} overtime hours.</span></div></div>`;
}

function renderLines(data) {
  const rows=group(data,"line").map(g=>({name:g.name,value:aggregate(g.rows).productivity})).sort((a,b)=>b.value-a.value), max=Math.max(...rows.map(r=>r.value));
  lineChart.innerHTML=rows.map(r=>`<div class="bar-row"><label>${r.name}</label><div class="bar-track"><div class="bar-fill" style="width:${r.value/max*100}%"></div></div><strong>${r.value.toFixed(2)} <small>u/h</small></strong></div>`).join("");
}

function renderHeatmap(data) {
  const days=["Mon","Tue","Wed","Thu","Fri","Sat"], shifts=["Morning","Evening","Night"];
  const base=aggregate(data).efficiency;
  const vals=shifts.map((_,s)=>days.map((_,d)=>Math.max(58,Math.min(98,base + [4,-1,-7][s] + [1,3,2,0,-2,-5][d] + ((d+s)%3-1)*1.7))));
  const color=v=>{const t=Math.max(0,Math.min(1,(v-58)/40));return `rgb(${Math.round(221-181*t)},${Math.round(240-126*t)},${Math.round(233-140*t)})`};
  heatmap.innerHTML=`<div class="heatmap"><span></span>${days.map(d=>`<span class="day">${d}</span>`).join("")}${shifts.map((s,si)=>`<span class="shift">${s}</span>${vals[si].map(v=>`<div class="heat-cell ${v>82?'dark':''}" style="background:${color(v)}">${Math.round(v)}%</div>`).join("")}`).join("")}</div>`;
}

function renderScatter(data) {
  const pts=group(data,"week").map(g=>aggregate(g.rows)); const W=440,H=145,p={l:29,r:8,t:8,b:20};
  const minX=Math.min(...pts.map(x=>x.overtime))*.9,maxX=Math.max(...pts.map(x=>x.overtime))*1.08,minY=Math.min(...pts.map(x=>x.defectRate))*.92,maxY=Math.max(...pts.map(x=>x.defectRate))*1.07;
  const x=v=>p.l+(v-minX)/(maxX-minX)*(W-p.l-p.r),y=v=>p.t+(maxY-v)/(maxY-minY)*(H-p.t-p.b);
  const meanX=pts.reduce((a,b)=>a+b.overtime,0)/pts.length,meanY=pts.reduce((a,b)=>a+b.defectRate,0)/pts.length;
  const slope=pts.reduce((a,b)=>a+(b.overtime-meanX)*(b.defectRate-meanY),0)/pts.reduce((a,b)=>a+(b.overtime-meanX)**2,0);
  const corr=pts.reduce((a,b)=>a+(b.overtime-meanX)*(b.defectRate-meanY),0)/Math.sqrt(pts.reduce((a,b)=>a+(b.overtime-meanX)**2,0)*pts.reduce((a,b)=>a+(b.defectRate-meanY)**2,0));
  const pred=v=>meanY+slope*(v-meanX);
  scatterChart.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${[0,.5,1].map(t=>`<line class="grid" x1="${p.l}" y1="${p.t+(H-p.t-p.b)*t}" x2="${W-p.r}" y2="${p.t+(H-p.t-p.b)*t}"/><text x="0" y="${p.t+(H-p.t-p.b)*t+3}">${(maxY-(maxY-minY)*t).toFixed(1)}%</text>`).join("")}<line class="regression" x1="${x(minX)}" y1="${y(pred(minX))}" x2="${x(maxX)}" y2="${y(pred(maxX))}"/>${pts.map(q=>`<circle cx="${x(q.overtime)}" cy="${y(q.defectRate)}" r="4"/>`).join("")}<text x="${p.l}" y="${H-2}">${Math.round(minX)}h</text><text text-anchor="end" x="${W-p.r}" y="${H-2}">${Math.round(maxX)}h overtime</text></svg>`;
  correlationBadge.textContent=`r = ${corr.toFixed(2)}`;
  qualityCallout.innerHTML=`<strong>+${(slope*100).toFixed(2)} pp</strong><span>estimated defect-rate increase per <b>100 overtime hours</b>. Overtime is a risk signal, not proof of causation.</span>`;
}

function renderTarget(data) {
  const a=aggregate(data), pct=a.units/a.target*100, good=a.units-a.defects;
  targetPct.textContent=pct.toFixed(1)+"%"; targetGauge.style.setProperty("--value",Math.min(100,pct)*3.6+"deg");
  targetDetail.innerHTML=`<span>Planned <b>${compact.format(a.target)}</b></span><span>Produced <b>${compact.format(a.units)}</b></span><span>Good units <b>${compact.format(good)}</b></span>`;
}

function render() { const data=selectedData(); renderKpis(data);renderTrend(data);renderInsights(data);renderLines(data);renderHeatmap(data);renderScatter(data);renderTarget(data); }
monthFilter.addEventListener("change",render); departmentFilter.addEventListener("change",render);
menuBtn.addEventListener("click",()=>document.querySelector(".sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-item[href]").forEach(a=>a.addEventListener("click",()=>document.querySelector(".sidebar").classList.remove("open")));

methodologyBtn.addEventListener("click",()=>methodologyModal.hidden=false); modalClose.addEventListener("click",()=>methodologyModal.hidden=true); methodologyModal.addEventListener("click",e=>{if(e.target===methodologyModal)methodologyModal.hidden=true});
downloadCsv.addEventListener("click",()=>{
  const rows=selectedData(), keys=["week","month","department","line","hours","overtime","units","defects","target","efficiency"];
  const csv=[keys.join(","),...rows.map(r=>keys.map(k=>r[k]).join(","))].join("\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); const a=document.createElement("a");a.href=url;a.download="stitchops_factory_data.csv";a.click();URL.revokeObjectURL(url);
});
render();
