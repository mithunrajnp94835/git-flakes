const daySelect = document.getElementById("daySelect");
const list = document.getElementById("list");
const nameInput = document.getElementById("newName");
const addBtn = document.getElementById("addBtn");

let day = "monday";

function saveTimetable() {
  save(TT_KEY, timetable);
}

function move(i, dir) {
  const arr = timetable[day];
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
  saveTimetable();
  render();
}

function render() {
  list.innerHTML = "";
  const arr = timetable[day] || [];

  if (arr.length === 0) {
    list.textContent = "No classes on this day. Add one below.";
    return;
  }

  arr.forEach(function (name, i) {
    const row = document.createElement("div");
    row.className = "edit-row";

    const input = document.createElement("input");
    input.value = name;
    input.addEventListener("change", function () {
      const v = input.value.trim();
      if (v === "") {
        input.value = timetable[day][i];   // empty name not allowed, put old one back
        return;
      }
      timetable[day][i] = v;
      saveTimetable();
    });

    const up = document.createElement("button");
    up.textContent = "↑";
    up.disabled = i === 0;
    up.addEventListener("click", function () { move(i, -1); });

    const down = document.createElement("button");
    down.textContent = "↓";
    down.disabled = i === arr.length - 1;
    down.addEventListener("click", function () { move(i, 1); });

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "✕";
    del.addEventListener("click", function () {
      if (confirm('Delete "' + timetable[day][i] + '" from ' + day + '?')) {
        timetable[day].splice(i, 1);
        saveTimetable();
        render();
      }
    });

    row.append(input, up, down, del);
    list.appendChild(row);
  });
}

function addClass() {
  const name = nameInput.value.trim();
  if (name === "") return;
  if (!timetable[day]) timetable[day] = [];
  timetable[day].push(name);
  saveTimetable();
  nameInput.value = "";
  render();
}

daySelect.addEventListener("change", function () {
  day = daySelect.value;
  render();
});

addBtn.addEventListener("click", addClass);
nameInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addClass();
});

render();
