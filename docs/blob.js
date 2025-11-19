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
    compositeOperation,
  ) {
    this.centre = centre;
    this.symmetry = symmetry;
    this.maxRadius = maxRadius;
    this.canvas = canvas;
    this.ctx = ctx;
    this.components = [];
    for (let c = 0; c < numberOfComponents; c++) {
      const red = 128;
      const green = 128;
      const blue = 128;
      this.components.push(
        new Component(
          centre,
          symmetry,
          numberOfPoints,
          maxRadius,
          canvas,
          ctx,
          red,
          green,
          blue,
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
