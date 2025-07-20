"use strict";

import { Kaleidoblobs } from "./kaleidoblobs.js";

const globals = {
  animationTimeOutId: null,
  ctx: null,
  drawingCanvas: null,
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialise);
} else {
  initialise();
}

function initialise() {
  globals.drawingCanvas = document.getElementById("canvas");
  globals.ctx = document.getElementById("canvas").getContext("2d");
  document.onfullscreenchange = function (event) {
    adjustCanvas();
    restart();
  };
  document.getElementById("restart").addEventListener("click", restart);
  document
    .getElementById("full_screen")
    .addEventListener("click", () => globals.drawingCanvas.requestFullscreen());
  restart();
}

function adjustCanvas() {
  if (document.fullscreenElement) {
    globals.drawingCanvas.height = window.screen.height;
    globals.drawingCanvas.width = window.screen.width;
  } else {
    globals.drawingCanvas.height = window.innerHeight;
    globals.drawingCanvas.width = window.innerWidth;
  }
}

function restart() {
  clearTimeout(globals.animationTimeOutId);
  const numberOfShapes = parseInt(document.getElementById("shapes").value, 10);
  const minPoints = parseInt(document.getElementById("min_points").value, 10);
  const maxPoints = parseInt(document.getElementById("max_points").value, 10);
  const minSymmetry = parseInt(
    document.getElementById("min_symmetry").value,
    10,
  );
  const maxSymmetry = parseInt(
    document.getElementById("max_symmetry").value,
    10,
  );
  adjustCanvas();
  globals.kaleidoblobs = new Kaleidoblobs(
    globals.drawingCanvas,
    globals.ctx,
    numberOfShapes,
    minPoints,
    maxPoints,
    minSymmetry,
    maxSymmetry,
  );
  animate();
}

function animate() {
  globals.animationTimeOutId = setTimeout(animate, 32);
  globals.kaleidoblobs.move();
  globals.kaleidoblobs.display();
}
