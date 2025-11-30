import { Component } from "./component.js";

export class Blob {
  constructor(
    centre,
    numberOfPoints,
    symmetry,
    maxRadius,
    canvas,
    ctx,
    numberOfComponents,
    numberOfColourSamples,
    compositeOperation,
  ) {
    this.centre = centre;
    this.symmetry = symmetry;
    this.maxRadius = maxRadius;
    this.driftAngle = Math.random() * 2 * Math.PI;
    this.canvas = canvas;
    this.ctx = ctx;
    this.components = [];
    for (let c = 0; c < numberOfComponents; c++) {
      const reds = [];
      const greens = [];
      const blues = [];
      for (let i = 0; i < numberOfColourSamples; i++) {
        reds.push(128);
        greens.push(128);
        blues.push(128);
      }
      this.components.push(
        new Component(
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
        ),
      );
    }
  }

  move() {
    const centre = this.centre;
    this.driftAngle =
      (this.driftAngle + 2 * Math.PI + Math.random() - Math.random()) %
      (2 * Math.PI);
    centre.x += Math.cos(this.driftAngle) / 10;
    centre.y += Math.sin(this.driftAngle) / 10;
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
    for (const component of this.components) {
      component.move();
    }
  }

  display() {
    for (const component of this.components) {
      component.display();
    }
  }
}
