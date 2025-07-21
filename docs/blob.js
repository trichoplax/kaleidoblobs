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
      const red = Math.floor(Math.random() * 128 + Math.random() * 128);
      const green = Math.floor(Math.random() * 128 + Math.random() * 128);
      const blue = Math.floor(Math.random() * 128 + Math.random() * 128);
      const colour = `rgba(${red}, ${green}, ${blue})`;
      this.components.push(
        new Component(
          centre,
          symmetry,
          numberOfPoints,
          maxRadius,
          canvas,
          ctx,
          colour,
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
