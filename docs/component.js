import { Point } from "./point.js";

export class Component {
  constructor(
    centre,
    symmetry,
    numberOfPoints,
    maxRadius,
    canvas,
    ctx,
    reds,
    greens,
    blues,
    compositeOperation,
  ) {
    this.centre = centre;
    this.symmetry = symmetry;
    this.points = [];
    this.maxRadius = maxRadius;
    this.canvas = canvas;
    this.ctx = ctx;
    this.reds = reds;
    this.greens = greens;
    this.blues = blues;
    this.numberOfColourSamples = reds.length;
    console.assert(
      reds.length == greens.length && greens.length == blues.length,
    );
    this.compositeOperation = compositeOperation;
    if (this.compositeOperation === "random") {
      let operations = ["xor", "lighter", "multiply", "source-over"];
      this.compositeOperation =
        operations[Math.floor(Math.random() * operations.length)];
    }
    const initialRadius = maxRadius / 16;
    const angleStep = (2 * Math.PI) / symmetry / numberOfPoints;
    for (let p = 0; p < numberOfPoints; p++) {
      const x = Math.cos(angleStep * p) * initialRadius;
      const y = Math.sin(angleStep * p) * initialRadius;
      this.points.push(new Point(x, y, maxRadius));
    }
  }

  move() {
    for (const point of this.points) {
      point.move();
    }
    for (let i = 0; i < this.numberOfColourSamples; i++) {
      this.reds[i] = Math.min(
        255,
        Math.max(
          0,
          this.reds[i] +
            Math.floor(Math.random() * 2) -
            Math.floor(Math.random() * 2),
        ),
      );
      this.greens[i] = Math.min(
        255,
        Math.max(
          0,
          this.greens[i] +
            Math.floor(Math.random() * 2) -
            Math.floor(Math.random() * 2),
        ),
      );
      this.blues[i] = Math.min(
        255,
        Math.max(
          0,
          this.blues[i] +
            Math.floor(Math.random() * 2) -
            Math.floor(Math.random() * 2),
        ),
      );
    }
  }

  display() {
    const symmetry = this.symmetry;
    const mainCentre = this.centre;
    const points = this.points;

    const horizontalStart =
      mainCentre.x >= this.canvas.width - this.maxRadius ? -1 : 0;
    const horizontalEnd = mainCentre.x < this.maxRadius ? 1 : 0;
    const verticalStart =
      mainCentre.y >= this.canvas.height - this.maxRadius ? -1 : 0;
    const verticalEnd = mainCentre.y < this.maxRadius ? 1 : 0;
    for (
      let horizontal = horizontalStart;
      horizontal <= horizontalEnd;
      horizontal++
    ) {
      for (let vertical = verticalStart; vertical <= verticalEnd; vertical++) {
        const centre = {
          x: mainCentre.x + horizontal * this.canvas.width,
          y: mainCentre.y + vertical * this.canvas.height,
        };
        this.ctx.globalCompositeOperation = this.compositeOperation;
        this.ctx.beginPath();
        this.ctx.moveTo(centre.x + points[0].x, centre.y + points[0].y);
        for (let rotation = 0; rotation < symmetry; rotation++) {
          for (const point of this.points) {
            const rotatedCoords = rotated(point, rotation, symmetry);
            this.ctx.lineTo(
              centre.x + rotatedCoords.x,
              centre.y + rotatedCoords.y,
            );
          }
        }
        this.ctx.closePath();
        const red = Math.round(
          this.reds.reduce((a, b) => a + b) / this.numberOfColourSamples,
        );
        const green = Math.round(
          this.greens.reduce((a, b) => a + b) / this.numberOfColourSamples,
        );
        const blue = Math.round(
          this.blues.reduce((a, b) => a + b) / this.numberOfColourSamples,
        );
        this.ctx.fillStyle = `rgba(${red},${green},${blue})`;
        this.ctx.fill("evenodd");
      }
    }
  }
}

function rotated(point, rotation, symmetry) {
  const angle = ((2 * Math.PI) / symmetry) * rotation;
  const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
  const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
  return { x, y };
}
