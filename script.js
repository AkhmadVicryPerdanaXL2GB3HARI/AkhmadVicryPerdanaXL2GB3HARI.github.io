var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var mySound;
var myMusic;
var volumeslider = 0.5;
var suara = document.querySelector("#volume input");
var player = document.querySelectorAll("div#pemain img");
var stage;

function UI() {
  document.querySelector("#UI").style.display = "none";
  document.querySelector("#restart").style.display = "none";
}
function memilihLevel() {
  document.getElementById("level").style.display = "";
  UI();
}
function level(parameter) {
  stage = parameter;
  choose();
}
function choose() {
  document.getElementById("level").style.display = "none";
  document.getElementById("pemain").style.display = "";
}
function about() {
  UI();
  document.getElementById("sinopsis").style.display = "";
  document.getElementById("volume").style.display = "";
  document.getElementById("volume1").style.display = "none";
}
for (let i = 0; i < player.length; i++) {
  player[i].addEventListener("mouseenter", function (e) {
    e.target.style.filter = "drop-shadow(0px 0px 15px black)";
  });
  player[i].addEventListener("mouseleave", function (e) {
    e.target.style.filter = "";
  });
  player[i].addEventListener("click", function () {
    iPlayer = i;
    startGame();
  });
}
function pengaturan() {
  UI();
  document.getElementById("volume1").style.display = "";
  document.getElementById("volume").style.display = "";

  suara.addEventListener("input", function () {
    volumeslider = suara.value / 100;
  });
}
document.addEventListener("click", function (e) {
  if (e.target === document.querySelector("#volume .X")) {
    document.querySelector("#UI").style.display = "";
    document.querySelector("#volume").style.display = "none";
    document.getElementById("sinopsis").style.display = "none";
  }
});
function startGame() {
  myGamePiece = new component(
    50,
    30,
    "hantu" + iPlayer + ".png",
    10,
    300,
    "image"
  );
  myBackground = new component(1360, 600, "Frame2.png", 0, 0, "image");
  myGamePiece.gravity = 0.05;
  myScore = new component("30px", "Inter", "antiquewhite", 30, 40, "text");
  myGameArea.start();
  mySound = new sound("tbrak.mp3");
  myMusic = new sound("");

  UI();
  document.querySelector("#pemain").style.display = "none";
  document.querySelector(".border").style.display = "none";
  myObstacles.splice(0, myObstacles.length);
}

var myGameArea = {
  // canvas
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 1360;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
    document.getElementById("restart").style.display = "";
    document.getElementById("skor").innerHTML = this.frameNo;
  },
};

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0.1;
  this.gravitySpeed = 0;
  this.bounce = 0.2;

  this.update = function () {
    ctx = myGameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    if (type == "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function () {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
    this.hitTop();
  };
  this.hitBottom = function () {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = -(this.gravitySpeed * this.bounce);
    }
  };
  this.hitTop = function () {
    var rocktop = 0;
    if (this.y < rocktop) {
      this.y = rocktop;
      this.gravitySpeed = this.bounce;
    }
  };

  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      mySound.play();
      myMusic.stop();
      myGameArea.stop();
      return;
    }
  }

  if (myGameArea.frameNo == 5000) {
    myMusic.stop();
    myGameArea.stop();
    document.querySelector("#restart h1").innerHTML = "SELAMAT";
  }
  myGameArea.clear();
  myBackground.newPos();
  myBackground.update();
  myGameArea.frameNo += 1;
  if (stage == 3) {
    if (myGameArea.frameNo == 1 || everyinterval(40)) {
      x = myGameArea.canvas.width;
      minHeight = 100;
      maxHeight = 200;
      height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );
      minGap = 100;
      maxGap = 200;
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new component(30, height, "obs.png", x, 0, "image"));
      myObstacles.push(
        new component(30, x - height - gap, "obs.png", x, height + gap, "image")
      );
    }
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -13;
      myObstacles[i].update();
    }
  } else if (stage == 2) {
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
      x = myGameArea.canvas.width;
      minHeight = 100;
      maxHeight = 200;
      height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );
      minGap = 100;
      maxGap = 200;
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new component(30, height, "obs.png", x, 0, "image"));
      myObstacles.push(
        new component(30, x - height - gap, "obs.png", x, height + gap, "image")
      );
    }
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -8;
      myObstacles[i].update();
    }
  } else {
    if (myGameArea.frameNo == 1 || everyinterval(120)) {
      x = myGameArea.canvas.width;
      minHeight = 100;
      maxHeight = 200;
      height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );
      minGap = 100;
      maxGap = 200;
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new component(30, height, "obs.png", x, 0, "image"));
      myObstacles.push(
        new component(30, x - height - gap, "obs.png", x, height + gap, "image")
      );
    }
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -5;
      myObstacles[i].update();
    }
  }
  let skor = myGameArea.frameNo;
  myScore.text = "SCORE: " + skor;
  if (skor == 2500) {
    alert("SELAMATTTTTT ANDA MENAMATKAN GAME HANTU KELELAWAR INI");
    window.location.reload();
  }
  myScore.update();
  myGamePiece.newPos();
  myGamePiece.update();
  //   myMusic.play();
}
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.sound.volume = volumeslider;
  document.body.appendChild(this.sound);

  //   this.play = function () {
  //     this.sound.play();
  //   };
  this.stop = function () {
    this.sound.pause();
  };
}
function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}
function accelerate(n) {
  if (!myGameArea.interval) {
    myGameArea.interval = setInterval(updateGameArea, 20);
  }

  myGamePiece.gravity = n;
}
document.addEventListener("keydown", function (e) {
  if (e.which === 32) {
    accelerate(-0.2);
  }
});
document.addEventListener("keyup", function (e) {
  if (e.which === 32) {
    accelerate(0.1);
  }
});
