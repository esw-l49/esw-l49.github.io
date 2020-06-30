Router.route("/mineswiper", function () {
  //   console.log("mineswiper");
  const map = renderMineSwiper("easy");
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
function renderMineSwiper(mode) {
  const title = $(".gametitle");
  const map = $(".mine-map");
  let size = mode === "hard" ? 9 * 16 : mode === "expert" ? 16 * 30 : 6 * 9;
  map.classList.add(mode + "-map");
  title.innerHTML = "MinSwiper";
  for (let i = 0; i < size; i++) {
    const mineSeat = document.createElement("div");
    mineSeat.classList.add("mine-seat");
    mineSeat.id = `xy${i}`;
    map.appendChild(mineSeat);
  }
  return map;
}

function setMines(mode) {
  let coordinates = [];
  let mines = [];
  let i = 0,
    j = 0,
    n = mode === "hard" ? 16 : mode === "expert" ? 30 : 9,
    width = mode === "hard" ? 16 : mode === "expert" ? 30 : 9,
    height = mode === "hard" ? 9 : mode === "expert" ? 16 : 6;

  while (i < height * width) {
    coordinates.push(i);
    i++;
  }
  console.log(coordinates);
  // 随机生成不重复的地雷坐标
  for (let p = 0; p < n; p++) {
    let temp = p + Math.floor(Math.random() * (height * width - p));
    mines[p] = coordinates[temp];
    coordinates[temp] = coordinates[p];
    coordinates[p] = mines[p];
  }
  console.log("mines:", mines);
  // 按照随机生产的坐标进行布雷
  while (j++ < mines.length) {
    let xy = mines[j - 1];
    // xy = xy > 9 ? xy : `0${xy}`;
    // console.log(`#xy${xy}`);
    $(`#xy${xy}`).innerHTML =
      "<img src='../images/mine-black.png' width='30' height='30'></img>";
  }
  // 未放置雷的格子放入周围雷数
  const safeBlocks = coordinates;
  j = 0;
  while (j < mines.length) {
    let index = safeBlocks.indexOf(mines[j]);
    safeBlocks.splice(index, 1);
    j++;
  }
  console.log(
    "safeBlocks:",
    safeBlocks.sort((a, b) => a - b)
  );
  let mineNum = 0;
  j = 0;
  while (j < width * height - n) {
    const s = safeBlocks[j];
    const mod = s % width;
    if (0 < mod && mod < width - 1) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          mineNum += mines.indexOf(s - width * (1 - k) - 1 + l) >= 0 ? 1 : 0;
        }
      }
    } else if (mod === 0) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 2; l++) {
          mineNum += mines.indexOf(s - width * (1 - k) + l) >= 0 ? 1 : 0;
        }
      }
    } else if (mod === width - 1) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 2; l++) {
          mineNum += mines.indexOf(s - width * (1 - k) + l - 1) >= 0 ? 1 : 0;
        }
      }
    }
    const safeBlock = s;
    $(`#xy${safeBlock}`).innerHTML = mineNum;
    mineNum = 0;
    j++;
  }
  // console.log(mineNum);
}

function $(selector) {
  return document.querySelector(selector)
    ? document.querySelector(selector)
    : null;
}
