

const ORDER = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const JS_DAY = { sunday:0, monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6 };

// REPLACE THESE with your real timetable, in order of the periods
const defaultTimetable = {
  monday:    ["CNS", "TOC", "AI","SE","RM"],
  tuesday:   [ "AI","SE", "CNS", "TOC"],
  wednesday: ["RM", "SE","TOC", "AI","CNS-LAB"],
  thursday:  ["EVS-online"],
  friday:    ["WT-LAB", "TOC","CNS","RM", "SE"],
  saturday:  [],
  sunday:    []
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

const TT_KEY = "timetable";
let timetable = load(TT_KEY, defaultTimetable);
let marks = load("marks", {});
const TARGET = 75;
