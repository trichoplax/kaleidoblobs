"use strict";

import { Scene } from "./scene.js";

const globals = {
  animationTimeOutId: null,
  ctx: null,
  canvas: null,
  scene: null,
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialise);
} else {
  initialise();
}

function initialise() {
  globals.canvas = document.getElementById("canvas");
  globals.ctx = globals.canvas.getContext("2d");
  document.onfullscreenchange = function (event) {
    adjustCanvas();
    restart();
  };
  document.getElementById("restart").addEventListener("click", restart);
  document
    .getElementById("full_screen")
    .addEventListener("click", () => globals.canvas.requestFullscreen());
  restart();
}

function adjustCanvas() {
  if (document.fullscreenElement) {
    globals.canvas.width = window.screen.width;
    globals.canvas.height = window.screen.height;
  } else {
    globals.canvas.width = window.innerWidth;
    globals.canvas.height = window.innerHeight;
  }
}

function restart() {
  clearTimeout(globals.animationTimeOutId);
  const numberOfBlobs = parseInt(document.getElementById("blobs").value, 10);
  const minComponentsPerBlob = parseInt(
    document.getElementById("min_components").value,
    10,
  );
  const maxComponentsPerBlob = parseInt(
    document.getElementById("max_components").value,
    10,
  );
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
  const compositeOperation = document.getElementById(
    "composite_operation",
  ).value;
  adjustCanvas();
  globals.scene = new Scene(
    globals.canvas,
    globals.ctx,
    numberOfBlobs,
    minPoints,
    maxPoints,
    minSymmetry,
    maxSymmetry,
    minComponentsPerBlob,
    maxComponentsPerBlob,
    compositeOperation,
  );
  animate();
}

function animate() {
  globals.scene.move();
  globals.scene.display();
  globals.animationTimeOutId = setTimeout(animate, 32);
}
