import { Blob } from "./blob.js";

export class Scene {
  constructor(
    canvas,
    ctx,
    numberOfShapes,
    minPoints,
    maxPoints,
    minSymmetry,
    maxSymmetry,
    minComponentsPerBlob,
    maxComponentsPerBlob,
    compositeOperation,
  ) {
    this.ctx = ctx;
    this.canvas = canvas;
    const horizontalSpacing = canvas.width / (numberOfShapes + 1);
    const verticalExtent = canvas.height / 4;
    const maxRadius = Math.min(horizontalSpacing / 2, verticalExtent * 2);
    const maxRadiusSquared = maxRadius * maxRadius;
    this.allBlobs = [];
    for (let s = 0; s < numberOfShapes; s++) {
      const componentsPerBlob = randomBetween(
        minComponentsPerBlob,
        maxComponentsPerBlob,
      );
      const symmetry = randomBetween(minSymmetry, maxSymmetry);
      const centre = {
        x: (s + 1) * horizontalSpacing,
        y: canvas.height / 2,
      };
      const numberOfPoints = randomBetween(minPoints, maxPoints);
      this.allBlobs.push(
        new Blob(
          centre,
          numberOfPoints,
          symmetry,
          maxRadius,
          canvas,
          ctx,
          componentsPerBlob,
          compositeOperation,
        ),
      );
    }
  }

  move() {
    for (const blob of this.allBlobs) {
      blob.move();
    }
  }

  display() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const blob of this.allBlobs) {
      blob.display();
    }
  }
}

function randomBetween(a, b) {
  [a, b] = [Math.min(a, b), Math.max(a, b)];
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
