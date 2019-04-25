import { Shape } from './shape';

/**
 * Category.
 */
export class Category {
  /**
   * Id.
   */
  public id: number;

  /**
   * Name.
   */
  public name: string;

  /**
   * Shapes of category.
   */
  public shapes: Shape[];
}
