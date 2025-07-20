"use strict";

const globals = {
  animationTimeOutId: null,
  numberOfShapes: null,
  ctx: null,
  drawingCanvas: null,
  allShapes: null,
  maxRadius: null,
  maxRadiusSquared: null,
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialise);
} else {
  initialise();
}

function initialise() {
  globals.drawingCanvas = document.getElementById("canvas");
  globals.ctx = document.getElementById("canvas").getContext("2d");
  const fullScreenDiv = document.getElementById("full_screen_div");
  document.onfullscreenchange = function (event) {
    adjustCanvas();
    restart();
  };
  document.getElementById("restart").addEventListener("click", restart);

  document
    .getElementById("full_screen")
    .addEventListener("click", () => fullScreenDiv.requestFullscreen());

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
  globals.numberOfShapes = parseInt(
    document.getElementById("shapes").value,
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
  adjustCanvas();
  globals.allShapes = [];
  const horizontalSpacing =
    globals.drawingCanvas.width / (globals.numberOfShapes + 1);
  const verticalExtent = globals.drawingCanvas.height / 4;
  globals.maxRadius = Math.min(horizontalSpacing / 2, verticalExtent * 2);
  globals.maxRadiusSquared = globals.maxRadius * globals.maxRadius;
  const initialRadius = globals.maxRadius / 4;
  for (let s = 0; s < globals.numberOfShapes; s++) {
    const shape = {};
    shape.symmetry = random(maxSymmetry - minSymmetry + 1) + minSymmetry;
    shape.centre = {
      x: (s + 1) * horizontalSpacing,
      y: globals.drawingCanvas.height / 2,
    };
    shape.drift = { x: 0, y: 0 };
    shape.numberOfPoints = random(maxPoints - minPoints + 1) + minPoints;
    const angleStep = (2 * Math.PI) / shape.symmetry / shape.numberOfPoints;
    shape.points = [];
    for (let p = 0; p < shape.numberOfPoints; p++) {
      const x = Math.cos(angleStep * p) * initialRadius;
      const y = Math.sin(angleStep * p) * initialRadius;
      const drift = { x: 0, y: 0 };
      shape.points.push({ x: x, y: y, drift: drift });
    }
    globals.allShapes.push(shape);
  }

  animate();
}

function animate() {
  globals.animationTimeOutId = setTimeout(animate, 32);
  movePoints();
  displayPoints();
}

function movePoints() {
  for (let s = 0; s < globals.numberOfShapes; s++) {
    const angle = Math.random() * 2 * Math.PI;
    const shape = globals.allShapes[s];
    const points = shape.points;
    const centre = shape.centre;
    const drift = shape.drift;
    drift.x += Math.cos(angle) / 30;
    drift.y += Math.sin(angle) / 30;
    const lengthSquared = drift.x * drift.x + drift.y * drift.y;
    if (lengthSquared > 1) {
      drift.x /= Math.sqrt(lengthSquared);
      drift.y /= Math.sqrt(lengthSquared);
    }
    centre.x += drift.x / 10;
    centre.y += drift.y / 10;
    if (centre.x < 0) {
      centre.x += globals.drawingCanvas.width;
    } else if (centre.x > globals.drawingCanvas.width) {
      centre.x -= globals.drawingCanvas.width;
    }
    if (centre.y < 0) {
      centre.y += globals.drawingCanvas.height;
    } else if (centre.y > globals.drawingCanvas.height) {
      centre.y -= globals.drawingCanvas.height;
    }
    for (let p = 0; p < shape.numberOfPoints; p++) {
      const angle = Math.random() * 2 * Math.PI;
      const point = points[p];
      const drift = point.drift;
      drift.x += Math.cos(angle) / 30;
      drift.y += Math.sin(angle) / 30;
      const driftLengthSquared = drift.x * drift.x + drift.y * drift.y;
      if (driftLengthSquared > 1) {
        drift.x /= Math.sqrt(driftLengthSquared);
        drift.y /= Math.sqrt(driftLengthSquared);
      }
      point.x += drift.x / 10;
      point.y += drift.y / 10;
      const lengthSquared = point.x * point.x + point.y * point.y;
      if (lengthSquared > globals.maxRadiusSquared) {
        point.x *= globals.maxRadius / Math.sqrt(lengthSquared);
        point.y *= globals.maxRadius / Math.sqrt(lengthSquared);
        const angle = Math.random() * 2 * Math.PI;
        drift.x = Math.cos(angle) / 20;
        drift.y = Math.sin(angle) / 20;
      }
    }
  }
}

function displayPoints() {
  globals.ctx.fillStyle = "rgba(255, 255, 255, 255)";
  globals.ctx.fillRect(
    0,
    0,
    globals.drawingCanvas.width,
    globals.drawingCanvas.height,
  );
  for (let s = 0; s < globals.numberOfShapes; s++) {
    const shape = globals.allShapes[s];
    const symmetry = shape.symmetry;
    const mainCentre = shape.centre;
    const points = shape.points;
    const horizontalStart =
      mainCentre.x > globals.drawingCanvas.width - globals.maxRadius ? -1 : 0;
    const horizontalEnd = mainCentre.x < globals.maxRadius ? 1 : 0;
    const verticalStart =
      mainCentre.y > globals.drawingCanvas.height - globals.maxRadius ? -1 : 0;
    const verticalEnd = mainCentre.y < globals.maxRadius ? 1 : 0;
    for (
      let horizontal = horizontalStart;
      horizontal <= horizontalEnd;
      horizontal++
    ) {
      for (let vertical = verticalStart; vertical <= verticalEnd; vertical++) {
        const centre = {
          x: mainCentre.x + horizontal * globals.drawingCanvas.width,
          y: mainCentre.y + vertical * globals.drawingCanvas.height,
        };
        globals.ctx.beginPath();
        globals.ctx.moveTo(centre.x + points[0].x, centre.y + points[0].y);
        for (let rotation = 0; rotation < symmetry; rotation++) {
          for (let p = 0; p < shape.numberOfPoints; p++) {
            const rotatedCoords = rotated(points[p], rotation, symmetry);
            const x = rotatedCoords.x;
            const y = rotatedCoords.y;
            globals.ctx.lineTo(centre.x + x, centre.y + y);
          }
        }
        globals.ctx.closePath();
        globals.ctx.fillStyle = "rgba(0, 0, 0, 255)";
        globals.ctx.fill("evenodd");
      }
    }
  }
}

function rotated(point, rotation, symmetry) {
  const angle = ((2 * Math.PI) / symmetry) * rotation;
  const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
  const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
  return { x: x, y: y };
}

function random(n) {
  return Math.floor(Math.random() * n);
}
