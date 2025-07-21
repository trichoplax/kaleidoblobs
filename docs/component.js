import { Point } from "./point.js";

export class Component {
  constructor(
    centre,
    symmetry,
    numberOfPoints,
    maxRadius,
    canvas,
    ctx,
    colour,
    compositeOperation,
  ) {
    this.centre = centre;
    this.symmetry = symmetry;
    this.drift = { x: 0, y: 0 };
    this.points = [];
    this.maxRadius = maxRadius;
    this.canvas = canvas;
    this.ctx = ctx;
    this.colour = colour;
    this.compositeOperation = compositeOperation;
    if (this.compositeOperation === "random") {
      let operations = ["xor", "lighter", "multiply", "source-over"];
      this.compositeOperation =
        operations[Math.floor(Math.random() * operations.length)];
    }
    const initialRadius = maxRadius / 4;
    const angleStep = (2 * Math.PI) / symmetry / numberOfPoints;
    for (let p = 0; p < numberOfPoints; p++) {
      const x = Math.cos(angleStep * p) * initialRadius;
      const y = Math.sin(angleStep * p) * initialRadius;
      this.points.push(new Point(x, y, maxRadius));
    }
  }

  move() {
    const angle = Math.random() * 2 * Math.PI;
    const points = this.points;
    const centre = this.centre;
    const drift = this.drift;
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
      centre.x += this.canvas.width;
    } else if (centre.x >= this.canvas.width) {
      centre.x -= this.canvas.width;
    }
    if (centre.y < 0) {
      centre.y += this.canvas.height;
    } else if (centre.y >= this.canvas.height) {
      centre.y -= this.canvas.height;
    }
    for (const point of points) {
      point.move();
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
        this.ctx.fillStyle = this.colour;
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
