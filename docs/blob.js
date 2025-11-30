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
    const angle = Math.random() * 2 * Math.PI;
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
