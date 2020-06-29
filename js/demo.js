Router.route("/mineswiper", function () {
  //   console.log("mineswiper");
  const map = renderMineSwiper();
  $("#start").addEventListener("click", () => {
    setMines("easy");
  });
});
Router.route("/hitblocks", function () {
  console.log("hitblocks");
});
Router.route("/pushbox", function () {
  console.log("pushbox");
});
// console.log(location);
function createElement(name, props, children) {
  const node = document.createElement(name);
}
function renderMineSwiper() {
  const title = document.querySelector(".gametitle");
  const map = document.querySelector(".mine-map");
  title.innerHTML = "MinSwiper";
  for (let i = 0; i < 6 * 9; i++) {
    const mineSeat = document.createElement("div");
    mineSeat.classList.add("mine-seat");
    mineSeat.id = `xy${i}`;
    console.log(mineSeat.id);
    map.appendChild(mineSeat);
  }
  return map;
}

function setMines(mode) {
  let coordinates = [];
  let mines = [];
  let i = 0,
    j = 0,
    n = 6;

  if (mode === "easy") {
    while (i++ < 6 * 9) coordinates[i - 1] = i - 1;

    for (let p = 0; p < n; p++) {
      let temp = p + Math.round(Math.random() * (6 * 9 - p));
      mines[p] = coordinates[temp];
      coordinates[temp] = coordinates[p];
    }
  }
  while (j++ < mines.length) {
    let xy = mines[j - 1];
    // xy = xy > 9 ? xy : `0${xy}`;
    // console.log(`#xy${xy}`);
    $(`#xy${xy}`).innerHTML = "*";
  }
  if (mode === "hard") {
  }
}

function $(selector) {
  return document.querySelector(selector)
    ? document.querySelector(selector)
    : null;
}
