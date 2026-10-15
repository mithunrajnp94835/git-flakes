const list = document.getElementById("list");
const ovPct = document.getElementById("ovPct");
const ovMeta = document.getElementById("ovMeta");

// 1. build the totals per subject
const totals = {};

function ensure(name) {
  if (!totals[name]) totals[name] = { attended: 0, total: 0 };
}

// every subject in the timetable, even with no marks yet
ORDER.forEach(function (day) {
  (timetable[day] || []).forEach(ensure);
});

// count the marks
Object.values(marks).forEach(function (m) {
  ensure(m.subject);
  totals[m.subject].total++;
  if (m.status === "p") totals[m.subject].attended++;
});

// 2. the calculation
function check(att, tot) {
  if (tot === 0) return { pct: 0, cls: "warn", msg: "No classes marked yet." };

  const pct = att / tot * 100;

  if (pct >= TARGET) {
    const skip = Math.floor(att * 100 / TARGET - tot);
    if (skip > 0) {
      return { pct: pct, cls: "ok", msg: "Safe. You can miss " + skip + " more class" + (skip === 1 ? "" : "es") + "." };
    }
    return { pct: pct, cls: "warn", msg: "On the edge. Don't miss the next class." };
  }

  const need = Math.ceil((TARGET * tot - 100 * att) / (100 - TARGET));
  return { pct: pct, cls: "bad", msg: "Below target. Attend the next " + need + " class" + (need === 1 ? "" : "es") + " in a row." };
}

// 3. overall box
let allAtt = 0, allTot = 0;
Object.values(totals).forEach(function (t) {
  allAtt += t.attended;
  allTot += t.total;
});
const overall = check(allAtt, allTot);
ovPct.textContent = (allTot ? overall.pct.toFixed(1) : "0") + "%";
ovMeta.textContent = allAtt + " of " + allTot + " classes attended";

// 4. subject cards, lowest percentage first, no-data subjects last
const names = Object.keys(totals).sort(function (a, b) {
  const ta = totals[a], tb = totals[b];
  if (ta.total === 0 && tb.total === 0) return 0;
  if (ta.total === 0) return 1;
  if (tb.total === 0) return -1;
  return ta.attended / ta.total - tb.attended / tb.total;
});

if (names.length === 0) {
  list.textContent = "No subjects yet.";
}

names.forEach(function (name) {
  const t = totals[name];
  const r = check(t.attended, t.total);

  const card = document.createElement("div");
  card.className = "subject";

  card.innerHTML =
    '<div class="top"><span class="title">' + name + '</span>' +
    '<span class="pct ' + r.cls + '">' + (t.total ? r.pct.toFixed(1) : "0") + '%</span></div>' +
    '<div class="count">' + t.attended + ' attended of ' + t.total + '</div>' +
    '<div class="bar"><div class="fill bg-' + r.cls + '" style="width:' + Math.min(100, r.pct) + '%"></div>' +
    '<div class="tick" style="left:' + TARGET + '%"></div></div>' +
    '<p class="msg ' + r.cls + '">' + r.msg + '</p>';

  list.appendChild(card);
});
