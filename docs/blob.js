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
