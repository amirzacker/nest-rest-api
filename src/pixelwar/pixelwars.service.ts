import { Injectable } from '@nestjs/common';

interface PixelData {
  color: string;
  pseudo: string;
}

@Injectable()
export class PixelWarsService {
  private canvas: PixelData[][] = [];

  constructor() {
    // Initialiser le canvas avec une couleur de fond blanche
    for (let i = 0; i < 500; i++) {
      this.canvas[i] = new Array(500).fill({ color: '#FFFFFF', pseudo: '' });
    }
  }

  updatePixel(x: number, y: number, color: string, pseudo: string): void {
    if (x >= 0 && x < 500 && y >= 0 && y < 500) {
      this.canvas[y][x] = { color, pseudo };
    }
  }

  getCanvas(): PixelData[][] {
    return this.canvas;
  }
}
