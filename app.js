/* ============================================================
   Fistball Live — 2026 U18 WC & Women's EFA Championship
   Reads results live from the public Google Sheet (gviz CSV)
   and computes standings client-side.
   ============================================================ */

const CONFIG = {
  // The published/shared Google Sheet that holds the results.
  sheetId: "1IWuv2zOZtIJDZCFnItp_z8p546azRGlD8I052jVe8Mk",
  gid: "0",                 // tab that holds the schedule + scores
  refreshMs: 60000,         // auto-refresh interval
};

// gviz CSV endpoint — works for any sheet shared as "anyone with the link can view".
const DATA_URL = `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/gviz/tq?tqx=out:csv&gid=${CONFIG.gid}&_=`;

// Rounds that form a round-robin group stage (used to compute standings).
const GROUP_ROUNDS = ["Qualification round", "WEC - Vorrunde"];
const STATUS_VALUES = ["Not Started", "Starting", "In progress", "Finished"];

// Map of country -> flag emoji (best effort; falls back to none).
const FLAGS = {
  "Austria": "🇦🇹", "Brazil": "🇧🇷", "Germany": "🇩🇪", "Switzerland": "🇨🇭",
  "Chile": "🇨🇱", "India": "🇮🇳", "Namibia": "🇳🇦", "Kenya": "🇰🇪",
  "New Zealand": "🇳🇿", "Italy": "🇮🇹", "Czech Republic": "🇨🇿", "Denmark": "🇩🇰",
  "Serbia": "🇷🇸",
};

const state = {
  matches: [],
  categories: [],
  activeCategory: localStorage.getItem("fb_category") || null,
  activeView: localStorage.getItem("fb_view") || "standings",
  matchFilter: "all",
  lastUpdated: null,
};

/* ---------------------- CSV parsing ---------------------- */

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* ignore */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/* ---------------------- Match model ---------------------- */

const num = (v) => {
  const n = parseInt(String(v).trim(), 10);
  return Number.isFinite(n) ? n : 0;
};

// Strip the trailing " - <Category>" suffix from a team name.
function cleanTeam(name, category) {
  if (!name) return name;
  let n = name.trim();
  if (category && n.endsWith(" - " + category)) {
    n = n.slice(0, -(" - " + category).length);
  } else {
    // fall back: drop suffix after last " - " if it looks like a category tag
    const m = n.match(/^(.*?) - (U18 .*|WEC)$/);
    if (m) n = m[1];
  }
  return n.trim();
}

// A team is a real entrant (not a bracket placeholder).
// Placeholders are the *cleaned* names like "Gold 3rd", "Winner SF1", "WEC R4",
// "5th Silver", "Loser L1" — all of which contain a digit or "winner"/"loser".
// Real country names never do.
function isRealTeam(name) {
  if (!name) return false;
  return !/\d/.test(name) && !/(winner|loser)/i.test(name);
}

function flagFor(team) {
  return FLAGS[team] || "";
}

// Build a match object from one CSV data row.
function rowToMatch(r) {
  const nr = num(r[2]);
  const teamA = (r[4] || "").trim();
  const teamB = (r[5] || "").trim();
  const category = (r[7] || "").trim();
  if (!nr || !teamA || !teamB || !category) return null;

  const setsA = num(r[9]);
  const setsB = num(r[11]);

  // Status: find a cell matching a known status value.
  let status = "Not Started";
  for (const cell of r) {
    const t = (cell || "").trim();
    if (STATUS_VALUES.includes(t)) { status = t; break; }
  }

  // Total points: located around the "|" separator token.
  let pointsA = 0, pointsB = 0;
  const pipeIdx = r.findIndex((c) => (c || "").trim() === "|");
  if (pipeIdx > 0) { pointsA = num(r[pipeIdx - 1]); pointsB = num(r[pipeIdx + 1]); }

  // Per-set scores: triplets (a, "x", b) sitting between Total Sets (col 11) and the "|".
  const sets = [];
  const setEnd = pipeIdx > 13 ? pipeIdx : r.length;
  for (let i = 12; i + 2 < setEnd; i += 3) {
    if ((r[i + 1] || "").trim() !== "x") break;
    const a = num(r[i]), b = num(r[i + 2]);
    if (a === 0 && b === 0) continue;
    sets.push([a, b]);
  }

  return {
    day: (r[0] || "").trim(),
    time: (r[1] || "").trim(),
    nr,
    court: (r[3] || "").trim(),
    teamARaw: teamA,
    teamBRaw: teamB,
    teamA: cleanTeam(teamA, category),
    teamB: cleanTeam(teamB, category),
    round: (r[6] || "").trim(),
    category,
    bestOf: num(r[8]),
    setsA, setsB,
    pointsA, pointsB,
    sets,
    status,
  };
}

function statusClass(s) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}
function isFinished(m) { return m.status === "Finished"; }
function isLive(m) { return m.status === "In progress" || m.status === "Starting"; }

/* ---------------------- Standings ---------------------- */

function computeStandings(category) {
  const games = state.matches.filter(
    (m) => m.category === category &&
      GROUP_ROUNDS.includes(m.round) &&
      isRealTeam(m.teamA) && isRealTeam(m.teamB)
  );
  if (!games.length) return null;

  const tbl = new Map();
  const ensure = (name) => {
    if (!tbl.has(name)) tbl.set(name, {
      team: name, played: 0, wins: 0, losses: 0,
      setsWon: 0, setsLost: 0, pointsFor: 0, pointsAgainst: 0, pts: 0,
    });
    return tbl.get(name);
  };

  // Register all teams so even those who haven't played yet show up.
  for (const g of games) { ensure(g.teamA); ensure(g.teamB); }

  for (const g of games) {
    if (!isFinished(g)) continue;
    const a = ensure(g.teamA), b = ensure(g.teamB);
    a.played++; b.played++;
    a.setsWon += g.setsA; a.setsLost += g.setsB;
    b.setsWon += g.setsB; b.setsLost += g.setsA;
    a.pointsFor += g.pointsA; a.pointsAgainst += g.pointsB;
    b.pointsFor += g.pointsB; b.pointsAgainst += g.pointsA;
    if (g.setsA > g.setsB) { a.wins++; b.losses++; a.pts += 2; }
    else if (g.setsB > g.setsA) { b.wins++; a.losses++; b.pts += 2; }
  }

  const rows = [...tbl.values()];
  rows.sort((x, y) =>
    y.pts - x.pts ||
    (y.setsWon - y.setsLost) - (x.setsWon - x.setsLost) ||
    (y.pointsFor - y.pointsAgainst) - (x.pointsFor - x.pointsAgainst) ||
    x.team.localeCompare(y.team)
  );
  return rows;
}

/* ---------------------- Rendering ---------------------- */

const $ = (id) => document.getElementById(id);

function renderCategories() {
  const wrap = $("categoryPills");
  wrap.innerHTML = "";
  for (const cat of state.categories) {
    const b = document.createElement("button");
    b.className = "pill" + (cat === state.activeCategory ? " is-active" : "");
    b.textContent = cat;
    b.onclick = () => { setCategory(cat); };
    wrap.appendChild(b);
  }
}

function renderStandings() {
  const host = $("standings");
  const rows = computeStandings(state.activeCategory);
  if (!rows) {
    host.innerHTML = `<div class="empty">This category is a knock-out / placement stage — no group standings.<br>Check the <b>Matches</b> tab for fixtures and results.</div>`;
    return;
  }
  const anyPlayed = rows.some((r) => r.played > 0);
  const totalTeams = rows.length;
  const qualifyCount = Math.min(2, totalTeams); // highlight top 2

  let html = `<p class="section-title">${state.activeCategory} · Group standings</p>`;
  html += `<div class="table-wrap"><table class="standings">
    <thead><tr>
      <th>#</th><th class="team">Team</th><th>P</th><th>W</th><th>L</th>
      <th>Sets</th><th>±</th><th>Pts</th>
    </tr></thead><tbody>`;
  rows.forEach((r, i) => {
    const setDiff = r.setsWon - r.setsLost;
    const qualified = i < qualifyCount;
    html += `<tr class="${qualified ? "qualified" : ""}">
      <td><span class="pos">${i + 1}</span></td>
      <td class="team"><span class="team-name"><span class="flag">${flagFor(r.team)}</span>${esc(r.team)}</span></td>
      <td>${r.played}</td>
      <td>${r.wins}</td>
      <td>${r.losses}</td>
      <td class="dim">${r.setsWon}-${r.setsLost}</td>
      <td class="${setDiff > 0 ? "" : "dim"}">${setDiff > 0 ? "+" : ""}${setDiff}</td>
      <td class="pts-col">${r.pts}</td>
    </tr>`;
  });
  html += `</tbody></table></div>`;
  if (!anyPlayed) {
    html += `<div class="empty">No matches completed yet — standings will fill in as results come in.</div>`;
  }
  host.innerHTML = html;
}

function renderMatchFilter() {
  const host = $("matchFilter");
  const filters = [
    ["all", "All"], ["live", "Live"], ["finished", "Finished"], ["upcoming", "Upcoming"],
  ];
  host.innerHTML = filters.map(([k, label]) =>
    `<button class="chip ${state.matchFilter === k ? "is-active" : ""}" data-f="${k}">${label}</button>`
  ).join("");
  host.querySelectorAll(".chip").forEach((c) => {
    c.onclick = () => { state.matchFilter = c.dataset.f; renderMatches(); };
  });
}

function matchPassesFilter(m) {
  switch (state.matchFilter) {
    case "live": return isLive(m);
    case "finished": return isFinished(m);
    case "upcoming": return m.status === "Not Started";
    default: return true;
  }
}

function renderMatches() {
  renderMatchFilter();
  const host = $("matches");
  const list = state.matches
    .filter((m) => m.category === state.activeCategory && matchPassesFilter(m));
  if (!list.length) {
    host.innerHTML = `<div class="empty">No matches to show for this filter.</div>`;
    return;
  }

  // group by day, preserving sheet order
  const groups = [];
  const idx = new Map();
  for (const m of list) {
    const key = m.day || "—";
    if (!idx.has(key)) { idx.set(key, groups.length); groups.push({ day: key, items: [] }); }
    groups[idx.get(key)].items.push(m);
  }

  host.innerHTML = groups.map((g) => `
    <div class="day-group">
      <div class="day-head">${esc(g.day)}</div>
      ${g.items.map(matchCard).join("")}
    </div>`).join("");
}

function matchCard(m) {
  const aWin = isFinished(m) && m.setsA > m.setsB;
  const bWin = isFinished(m) && m.setsB > m.setsA;
  const live = isLive(m);
  const showSets = (m.setsA + m.setsB > 0) || m.sets.length > 0;

  const setBadges = m.sets.length
    ? `<div class="setline"><div class="set-scores">${m.sets.map(([a, b]) =>
        `<span class="s ${a > b ? "won" : ""}">${a}</span><span class="s dim">:</span><span class="s ${b > a ? "won" : ""}">${b}</span>`
      ).join('<span class="s dim">·</span>')}</div></div>`
    : "";

  return `
  <div class="match ${live ? "live" : ""}">
    <div class="match-top">
      <div class="match-meta">
        <span>${esc(m.time)}</span>
        ${m.court ? `<span class="tag">Court ${esc(m.court)}</span>` : ""}
        <span class="tag">#${m.nr}</span>
        <span class="tag">${esc(m.round)}</span>
      </div>
      <span class="status ${statusClass(m.status)}">${esc(m.status)}</span>
    </div>
    <div class="match-row ${aWin ? "winner" : ""}">
      <div class="side"><span class="flag">${flagFor(m.teamA)}</span><span class="name">${esc(m.teamA)}</span></div>
      ${showSets ? `<div class="big-sets ${aWin ? "win" : ""}">${m.setsA}</div>` : ""}
    </div>
    <div class="match-divider"></div>
    <div class="match-row ${bWin ? "winner" : ""}">
      <div class="side"><span class="flag">${flagFor(m.teamB)}</span><span class="name">${esc(m.teamB)}</span></div>
      ${showSets ? `<div class="big-sets ${bWin ? "win" : ""}">${m.setsB}</div>` : ""}
    </div>
    ${setBadges}
  </div>`;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* ---------------------- View switching ---------------------- */

function setCategory(cat) {
  state.activeCategory = cat;
  localStorage.setItem("fb_category", cat);
  renderCategories();
  renderActiveView();
}

function setView(view) {
  state.activeView = view;
  localStorage.setItem("fb_view", view);
  $("tabStandings").classList.toggle("is-active", view === "standings");
  $("tabMatches").classList.toggle("is-active", view === "matches");
  $("standingsView").hidden = view !== "standings";
  $("matchesView").hidden = view !== "matches";
  renderActiveView();
}

function renderActiveView() {
  if (!state.activeCategory) return;
  if (state.activeView === "standings") renderStandings();
  else renderMatches();
}

/* ---------------------- Data loading ---------------------- */

async function load(showSpin) {
  const btn = $("refreshBtn");
  if (showSpin) btn.classList.add("spin");
  try {
    const res = await fetch(DATA_URL + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    applyData(text);
    cacheData(text);
    $("banner").hidden = true;
  } catch (err) {
    console.warn("Live fetch failed:", err);
    const cached = localStorage.getItem("fb_cache");
    if (cached && !state.matches.length) applyData(cached);
    showBanner("Couldn't reach the live sheet — showing the last data loaded. Pull to refresh when back online.");
  } finally {
    btn.classList.remove("spin");
  }
}

function applyData(csvText) {
  const rows = parseCSV(csvText);
  const matches = rows.map(rowToMatch).filter(Boolean);
  if (!matches.length) return;
  state.matches = matches;

  // Distinct categories in sheet order.
  const seen = new Set();
  const cats = [];
  for (const m of matches) if (!seen.has(m.category)) { seen.add(m.category); cats.push(m.category); }
  // Sort: group-stage categories first, then the rest, alphabetic within.
  cats.sort((a, b) => a.localeCompare(b));
  state.categories = cats;

  if (!state.activeCategory || !cats.includes(state.activeCategory)) {
    state.activeCategory = cats[0];
    localStorage.setItem("fb_category", state.activeCategory);
  }

  state.lastUpdated = new Date();
  $("updated").textContent = "Updated " + state.lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  $("loading").hidden = true;

  renderCategories();
  renderActiveView();
}

function cacheData(text) {
  try { localStorage.setItem("fb_cache", text); } catch (_) {}
}

function showBanner(msg) {
  const b = $("banner");
  b.textContent = msg;
  b.hidden = false;
}

/* ---------------------- PWA install ---------------------- */

let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $("installBtn").hidden = false;
});
$("installBtn").onclick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $("installBtn").hidden = true;
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

/* ---------------------- Boot ---------------------- */

$("tabStandings").onclick = () => setView("standings");
$("tabMatches").onclick = () => setView("matches");
$("refreshBtn").onclick = () => load(true);
setView(state.activeView);

// initial cache paint for instant load, then network
const boot = localStorage.getItem("fb_cache");
if (boot) try { applyData(boot); } catch (_) {}
load(true);
setInterval(() => { if (!document.hidden) load(false); }, CONFIG.refreshMs);
document.addEventListener("visibilitychange", () => { if (!document.hidden) load(false); });
