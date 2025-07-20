import { Kaleidopoint } from "./kaleidopoint.js";

export class Kaleidoblob {
  constructor(centre, numberOfPoints, symmetry, maxRadius, canvas, ctx) {
    this.drift = { x: 0, y: 0 };
    this.centre = centre;
    this.symmetry = symmetry;
    this.maxRadius = maxRadius;
    this.canvas = canvas;
    this.ctx = ctx;
    const initialRadius = maxRadius / 4;
    const angleStep = (2 * Math.PI) / symmetry / numberOfPoints;
    this.points = [];

    for (let p = 0; p < numberOfPoints; p++) {
      const x = Math.cos(angleStep * p) * initialRadius;
      const y = Math.sin(angleStep * p) * initialRadius;
      this.points.push(new Kaleidopoint(x, y, maxRadius));
    }
  }

  display() {
    const symmetry = this.symmetry;
    const mainCentre = this.centre;
    const points = this.points;

    const horizontalStart =
      mainCentre.x > this.canvas.width - this.maxRadius ? -1 : 0;
    const horizontalEnd = mainCentre.x < this.maxRadius ? 1 : 0;
    const verticalStart =
      mainCentre.y > this.canvas.height - this.maxRadius ? -1 : 0;
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
        this.ctx.beginPath();
        this.ctx.moveTo(centre.x + points[0].x, centre.y + points[0].y);
        for (let rotation = 0; rotation < symmetry; rotation++) {
          for (const point of this.points) {
            const rotatedCoords = rotated(point, rotation, symmetry);
            const x = rotatedCoords.x;
            const y = rotatedCoords.y;
            this.ctx.lineTo(centre.x + x, centre.y + y);
          }
        }
        this.ctx.closePath();
        this.ctx.fillStyle = "rgba(0, 0, 0, 255)";
        this.ctx.fill("evenodd");
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
