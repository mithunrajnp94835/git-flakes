const params = new URLSearchParams(location.search);
const asked = params.get("day");
const day = ORDER.includes(asked) ? asked : "monday";

const title = document.getElementById("dayTitle");
const dateText = document.getElementById("dateText");
const list = document.getElementById("list");
const nameInput = document.getElementById("newName");
const addBtn = document.getElementById("addBtn");

// most recent occurrence of this weekday (today if it is that day)
function dateOfDay(dayName) {
  const d = new Date();
  const diff = (d.getDay() - JS_DAY[dayName] + 7) % 7;
  d.setDate(d.getDate() - diff);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + dd;
}

const date = dateOfDay(day);
title.textContent = day[0].toUpperCase() + day.slice(1);
dateText.textContent = date;

function setMark(key, subject, status) {
  if (marks[key] && marks[key].status === status) {
    delete marks[key];            // same button again = undo
  } else {
    marks[key] = { subject: subject, status: status };
  }
  save("marks", marks);
}

function render() {
  list.innerHTML = "";
  const classes = timetable[day] || [];

  if (classes.length === 0) {
    list.textContent = "No classes on this day. Add one below.";
    return;
  }

  classes.forEach(function (name, i) {
    const key = date + "|" + i;
    const mark = marks[key];

    const card = document.createElement("div");
    card.className = "subject";

    const t = document.createElement("div");
    t.className = "title";
    t.textContent = (i + 1) + ". " + name;

    const presentBtn = document.createElement("button");
    presentBtn.className = "present";
    presentBtn.textContent = "Present";
    if (mark && mark.status === "a") presentBtn.classList.add("dim");
    presentBtn.addEventListener("click", function () {
      setMark(key, name, "p");
      render();
    });

    const absentBtn = document.createElement("button");
    absentBtn.className = "absent";
    absentBtn.textContent = "Absent";
    if (mark && mark.status === "p") absentBtn.classList.add("dim");
    absentBtn.addEventListener("click", function () {
      setMark(key, name, "a");
      render();
    });

    card.append(t, presentBtn, absentBtn);
    list.appendChild(card);
  });
}

function addClass() {
  const name = nameInput.value.trim();
  if (name === "") return;
  if (!timetable[day]) timetable[day] = [];
  timetable[day].push(name);
  save(TT_KEY, timetable);
  nameInput.value = "";
  render();
}

addBtn.addEventListener("click", addClass);
nameInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addClass();
});

render();
