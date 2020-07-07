Router.route("/mineswiper", function () {
  //   console.log("mineswiper");
  setTitle("Mine Swiper");
  $("#start").addEventListener("click", (e) => {
    const mode = modeChosen();
    const map = renderMineSwiper(mode);
    e.target.disabled = true;
  });
  $("#reset").addEventListener("click", (e) => {
    $("#start").disabled = false;
  });
});
Router.route("/hitblocks", function () {
  setTitle("Hit Blocks");
  console.log("hitblocks");
});
Router.route("/pushbox", function () {
  setTitle("Push Boxes");
  console.log("pushbox");
});

function modeChosen() {
  const v = parseInt($("#mode").value);
  const mode = v === 3 ? "expert" : v === 2 ? "hard" : "easy";
  return mode;
}

function setTitle(title) {
  $(".gametitle").innerHTML = title;
}
// console.log(location);
function createElement(name, props, children) {
  const node = document.createElement(name);
}
function renderMineSwiper(mode) {
  // clear all mines before setting mines
  const map = $(".mine-map");
  map.innerHTML = "";
  let size = mode === "hard" ? 9 * 16 : mode === "expert" ? 16 * 30 : 6 * 9;
  let n = mode === "hard" ? 16 : mode === "expert" ? 30 : 9;
  // 去除先前模式，渲染当前模式
  map.classList.remove("expert-map", "hard-map", "easy-map");
  map.classList.add(mode + "-map");
  // 生成雷区
  for (let i = 0; i < size; i++) {
    const mineSeat = document.createElement("div");
    mineSeat.classList.add("mine-seat");
    mineSeat.id = `xy${i}`;
    map.appendChild(mineSeat);
  }
  // 随机布雷
  const minedMap = setMines(mode, n);
  // 添加交互事件并统计数据
  let markedmines = 0;
  for (let i = 0; i < size; i++) {
    map.childNodes[i].addEventListener("mousedown", (e) => {
      // e.preventDefault();
      const clicked = e.target;
      document.oncontextmenu = () => false;
      if (e.which === 1 && !clicked.classList.contains("marked"))
        swipe(e, minedMap, mode);
      else if (e.which === 3) {
        e.target.innerHTML = "&times;";
        e.target.classList.toggle("marked");
        markedmines += 1;
      }
      const blocks = $(".mine-seat", true);
      let noMines = 0;
      for (let block of blocks) {
        noMines += block.classList.contains("swiped") ? 1 : 0;
      }
      $("#markedmines").innerHTML = markedmines;
      $("#unknown").innerHTML = size - noMines;
      if (noMines === size - n) {
        alert("You win!");
      }
      console.log("noMines:", noMines);
    });
  }
  return map;
}

function setMines(mode, n) {
  let coordinates = [];
  let mines = [];
  let i = 0,
    j = 0,
    width = mode === "hard" ? 16 : mode === "expert" ? 30 : 9,
    height = mode === "hard" ? 9 : mode === "expert" ? 16 : 6;

  $("#totalmines").innerHTML = n;

  while (i < height * width) {
    coordinates.push(i);
    i++;
  }
  // console.log(coordinates);
  // 随机生成不重复的地雷坐标
  for (let p = 0; p < n; p++) {
    let temp = p + Math.floor(Math.random() * (height * width - p));
    mines[p] = coordinates[temp];
    coordinates[temp] = coordinates[p];
    coordinates[p] = mines[p];
  }
  // console.log("mines:", mines);
  // 按照随机生产的坐标进行布雷
  while (j++ < mines.length) {
    let xy = mines[j - 1];
    // xy = xy > 9 ? xy : `0${xy}`;
    // console.log(`#xy${xy}`);
    $(`#xy${xy}`).innerHTML =
      "<img class='mine mine-hide' src='../images/mine-black.png' ></img>";
  }
  // 未放置雷的格子写上周围雷数
  const safeBlocks = coordinates;
  coordinates = [];
  j = 0;
  while (j < mines.length) {
    let index = safeBlocks.indexOf(mines[j]);
    safeBlocks.splice(index, 1);
    coordinates[mines[j]] = 9;
    j++;
  }
  // console.log(
  //   "safeBlocks:",
  //   safeBlocks.sort((a, b) => a - b)
  // );
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
    $(`#xy${s}`).innerHTML = mineNum;
    coordinates[s] = mineNum;
    mineNum = 0;
    j++;
  }
  console.log("mindedMap", coordinates);
  return coordinates;
}

function swipe(e, minesMap, mode) {
  const id = e.target.id.slice(2);
  const minesId = document.querySelectorAll(".mine");
  // console.log("id:", id, "\nminedMap:", mines);

  if (minesMap[id] == 9) {
    alert("Game over");
    for (let e of minesId) {
      e.classList.remove("mine-hide");
      e.classList.add("mine-boom");
      // console.log($(`#mine`).classList);
    }
    return 0;
  } else {
    swipeSuccess(minesMap, id, mode);
  }
}

function swipeSuccess(minesMap, id, mode) {
  const width = mode === "hard" ? 16 : mode === "expert" ? 30 : 9;
  id = parseInt(id);
  const mID = minesMap[id];
  if (mID > 0) {
    $(`#xy${id}`).classList.add("swiped");
    return;
  }
  const mod = id % width;
  if (0 < mod && mod < width - 1) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        cxy = id + (i - 1) * width + j - 1;
        showMinesAround(minesMap, cxy);
      }
    }
  } else if (mod === 0) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        cxy = id + (i - 1) * width + j;
        showMinesAround(minesMap, cxy);
      }
    }
  } else if (mod === width - 1) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        cxy = id + (i - 1) * width + j - 1;
        showMinesAround(minesMap, cxy);
      }
    }
  }
}

function showMinesAround(minesMap, cxy) {
  const safeSeat = $(`#xy${cxy}`) ? $(`#xy${cxy}`) : null;
  if (
    minesMap[cxy] === 0 &&
    safeSeat != null &&
    !safeSeat.classList.contains("swiped")
  ) {
    safeSeat.classList.add("swiped");
    swipeSuccess(minesMap, cxy, mode);
    // console.log(cxy);
  } else {
    if (safeSeat) safeSeat.classList.add("swiped");
  }
}

function $(selector, mode = false) {
  return mode
    ? document.querySelectorAll(selector)
    : document.querySelector(selector);
}
