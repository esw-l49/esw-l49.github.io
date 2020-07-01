Router.route("/mineswiper", function () {
  //   console.log("mineswiper");
  $("#start").addEventListener("click", () => {
    const map = renderMineSwiper("easy");
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
  $(".mine-map").innerHTML = "";
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
  const minedMap = setMines(mode);
  for (let i = 0; i < size; i++) {
    map.childNodes[i].addEventListener("click", e => {
      swipe(e, minedMap, mode);
    });
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

function swipe(e, mines, mode) {
  const id = e.target.id.slice(2);
  const minesId = document.querySelectorAll(".mine");
  // console.log("id:", id, "\nminedMap:", mines);

  if (mines[id] == 9) {
    for (let e of minesId) {
      e.classList.remove("mine-hide");
      e.classList.add("mine-boom");
      // console.log($(`#mine`).classList);
    }
  } else {
    swipeSuccess(mines, id, mode);
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
    console.log(cxy);
  } else {
    if (safeSeat) safeSeat.classList.add("swiped");
  }
}

function $(selector) {
  return document.querySelector(selector)
    ? document.querySelector(selector)
    : null;
}
