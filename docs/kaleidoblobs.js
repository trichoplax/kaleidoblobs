import { Kaleidoblob } from "./kaleidoblob.js";

export class Kaleidoblobs {
  constructor(
    drawingCanvas,
    ctx,
    numberOfShapes,
    minPoints,
    maxPoints,
    minSymmetry,
    maxSymmetry,
  ) {
    this.ctx = ctx;
    this.drawingCanvas = drawingCanvas;
    const horizontalSpacing = drawingCanvas.width / (numberOfShapes + 1);
    const verticalExtent = drawingCanvas.height / 4;
    const maxRadius = Math.min(horizontalSpacing / 2, verticalExtent * 2);
    const maxRadiusSquared = maxRadius * maxRadius;
    this.allShapes = [];
    for (let s = 0; s < numberOfShapes; s++) {
      const symmetry = random(maxSymmetry - minSymmetry + 1) + minSymmetry;
      const centre = {
        x: (s + 1) * horizontalSpacing,
        y: drawingCanvas.height / 2,
      };
      const numberOfPoints = random(maxPoints - minPoints + 1) + minPoints;
      this.allShapes.push(
        new Kaleidoblob(
          centre,
          numberOfPoints,
          symmetry,
          maxRadius,
          drawingCanvas,
          ctx,
        ),
      );
    }
  }

  move() {
    for (const shape of this.allShapes) {
      const angle = Math.random() * 2 * Math.PI;
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
        centre.x += this.drawingCanvas.width;
      } else if (centre.x > this.drawingCanvas.width) {
        centre.x -= this.drawingCanvas.width;
      }
      if (centre.y < 0) {
        centre.y += this.drawingCanvas.height;
      } else if (centre.y > this.drawingCanvas.height) {
        centre.y -= this.drawingCanvas.height;
      }
      for (const point of points) {
        point.move();
      }
    }
  }

  display() {
    this.ctx.fillStyle = "rgba(255, 255, 255, 255)";
    this.ctx.fillRect(
      0,
      0,
      this.drawingCanvas.width,
      this.drawingCanvas.height,
    );
    for (const shape of this.allShapes) {
      shape.display();
    }
  }
}

function random(n) {
  return Math.floor(Math.random() * n);
}
