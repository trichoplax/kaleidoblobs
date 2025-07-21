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
    const maxRadius = Math.sqrt(
      (canvas.width * canvas.height) / numberOfShapes / 4,
    );
    const maxRadiusSquared = maxRadius * maxRadius;
    this.allBlobs = [];
    for (let s = 0; s < numberOfShapes; s++) {
      const componentsPerBlob = randomBetween(
        minComponentsPerBlob,
        maxComponentsPerBlob,
      );
      const symmetry = randomBetween(minSymmetry, maxSymmetry);
      const shortSide = Math.min(canvas.width, canvas.height);
      const canvasCentre = { x: canvas.width / 2, y: canvas.height / 2 };
      const radius = (Math.sqrt(s / numberOfShapes) * shortSide) / 2;
      const angle = s * Math.PI * (Math.sqrt(5) - 1);
      const centre = {
        x: canvasCentre.x + radius * Math.cos(angle),
        y: canvasCentre.y + radius * Math.sin(angle),
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
