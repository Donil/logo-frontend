import { Category } from '../../models/category';

/**
 * Categoty DTO.
 */
export interface CategoryDto {
  id?: number;

  name: string;
}

/**
 * Categoty mapper.
 */
export class CategoryMapper {
  /**
   * Convert categoy to DTO.
   * @param category Categoty.
   */
   public toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
    };
  }

  /**
   * Convert DTO to model.
   * @param categoryDto Category DTO.
   */
  public toModel(categoryDto: CategoryDto): Category {
    const category = new Category();
    category.id = categoryDto.id;
    category.name = categoryDto.name;
    return category;
  }
}
