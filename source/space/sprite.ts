import { Mesh, Object3D } from 'three';
import { ColorPlane } from './colorPlane';
import { MaterialManager } from './materialManager';

export class Sprite extends Mesh {
  declare parent: Object3D & {
    dispose?: (obj: Object3D) => void;
  };

  private texture: string;
  private index: number;
  constructor(texture: string, index = 0) {
    super(new ColorPlane(1, 1), MaterialManager.getMaterial(texture, index));

    this.texture = texture;
    this.index = index;
  }

  /**
   * dispose
   */
  public dispose(): void {
    if (this.parent.dispose) {
      this.parent.dispose(this);
    }
  }

  public setIndex(index: number): this {
    if (index !== this.index) {
      this.material = MaterialManager.getMaterial(this.texture, index);
      this.index = index;
    }

    return this;
  }

  public get currentIndex(): number {
    return this.index;
  }
}
