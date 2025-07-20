export class Kaleidopoint {
  constructor(x, y, maxRadius) {
    this.x = x;
    this.y = y;
    this.drift = { x: 0, y: 0 };
    this.maxRadius = maxRadius;
    this.maxRadiusSquared = maxRadius * maxRadius;
  }

  move() {
    const angle = Math.random() * 2 * Math.PI;
    const drift = this.drift;
    drift.x += Math.cos(angle) / 30;
    drift.y += Math.sin(angle) / 30;
    const driftLengthSquared = drift.x * drift.x + drift.y * drift.y;
    if (driftLengthSquared > 1) {
      drift.x /= Math.sqrt(driftLengthSquared);
      drift.y /= Math.sqrt(driftLengthSquared);
    }
    this.x += drift.x / 10;
    this.y += drift.y / 10;
    const lengthSquared = this.x * this.x + this.y * this.y;
    if (lengthSquared > this.maxRadiusSquared) {
      this.x *= this.maxRadius / Math.sqrt(lengthSquared);
      this.y *= this.maxRadius / Math.sqrt(lengthSquared);
      const angle = Math.random() * 2 * Math.PI;
      drift.x = Math.cos(angle) / 20;
      drift.y = Math.sin(angle) / 20;
    }
  }
}
