import { Shape } from '../../models/shape';
import { ProvidersConfig } from '../providers-config';

/**
 * Shape DTO.
 */
export interface ShapeDto {
  id: number;

  name: string;

  url: string;

  categories: string[];
}

/**
 * Shape mapper.
 */
export class ShapeMapper {
  /**
   * .ctor
   * @param config Config.
   */
  public constructor(private config: ProvidersConfig) {
  }

  /**
   * Convert DTO to model.
   * @param shapeDto Shape DTO.
   */
  public toModel(shapeDto: ShapeDto): Shape {
    const shape = new Shape();
    shape.id = shapeDto.id;
    shape.name = shapeDto.name;
    shape.url = shapeDto.url;
    shape.categories = shapeDto.categories;
    return shape;
  }

  /**
   * Convert shapes DTO to models.
   * @param shapesDto Shape DTO.
   */
  public toArrayModels(shapesDto: ShapeDto[]): Shape[] {
    return shapesDto.map(item => this.toModel(item));
  }

  /**
   * Comvert shape to DTO.
   * @param shape Shape.
   */
  public toDto(shape: Shape): ShapeDto {
    return {
      id: shape.id,
      name: shape.name,
      url: shape.url,
      categories: shape.categories,
    };
  }
}
