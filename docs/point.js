export class Point {
  constructor(x, y, maxRadius) {
    this.x = x;
    this.y = y;
    this.driftAngle = Math.random() * 2 * Math.PI;
    this.maxRadius = maxRadius;
    this.maxRadiusSquared = maxRadius * maxRadius;
  }

  move() {
    this.driftAngle =
      (this.driftAngle +
        2 * Math.PI +
        (Math.random() +
          Math.random() +
          Math.random() +
          Math.random() -
          Math.random() -
          Math.random() -
          Math.random() -
          Math.random()) /
          10) %
      (2 * Math.PI);
    this.x += Math.cos(this.driftAngle) / 10;
    this.y += Math.sin(this.driftAngle) / 10;
    const lengthSquared = this.x * this.x + this.y * this.y;
    if (lengthSquared > this.maxRadiusSquared) {
      const currentLength = Math.sqrt(lengthSquared);
      this.x *= this.maxRadius / currentLength;
      this.y *= this.maxRadius / currentLength;
      this.driftAngle = Math.random() * 2 * Math.PI;
    }
  }
}
