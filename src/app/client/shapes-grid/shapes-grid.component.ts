import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, share, withLatestFrom, switchMap } from 'rxjs/operators';

import { Category } from '../../core/models/category';
import { Shape } from '../../core/models/shape';
import { CategoriesService } from '../../core/services/categories.service';
import { ShapesService } from '../../core/services/shapes.service';

/**
 * Shapes grid component.
 */
@Component({
  selector: 'cl-shapes-grid',
  templateUrl: './shapes-grid.component.html',
  styleUrls: [
    './shapes-grid.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapesGridComponent {
  /**
   * .ctor
   * @param categoriesService Categories component.
   * @param shapesService Shapes service.
   */
  public constructor(
    private categoriesService: CategoriesService,
    private shapesService: ShapesService) {
      this.categories$ = this.createCategoriesStream();
      this.shapes$ = this.createShapesStream();
  }

  /**
   * Selected category.
   */
  @Input()
  public selectedCategory$: BehaviorSubject<Category>;

  /**
   * Selected shape.
   */
  @Input()
  public selectedShape$: BehaviorSubject<Shape>;

  /**
   * Selected shape change event.
   */
  @Output()
  public selectedShapeChange = new EventEmitter<Shape>();

  /**
   * List of categories.
   */
  public categories$: Observable<Category[]>;

  /**
   * Shapes list.
   */
  public shapes$: Observable<Shape[]>;

  /**
   * On shape click event handler.
   * @param shape Shape.
   */
  public onShapeClick(shape: Shape): void {
    this.setSelectedShape(shape);
  }

  /**
   * On category click event handler.
   * @param category Category.
   */
  public onCategoryClick(category: Category): void {
    this.setSelectedCategory(category);
  }

  /**
   * Set selected category value and retrieve shapes of it.
   * @param category New value of selected category.
   */
  public setSelectedCategory(category: Category): void {
    this.selectedCategory$.next(category);
  }

  private createShapesStream(): Observable<Shape[]> {
    return this.selectedCategory$
      .pipe(
        switchMap(category => this.shapesService.getByCategory(category)),
        withLatestFrom(this.selectedShape$),
        map(([shapes, selectedShape]) => {
          if (selectedShape) {
            const shape = shapes.find(s => s.id === selectedShape.id);
            this.setSelectedShape(shape);
          }
          return shapes;
        }),
      );
  }

  /**
   * Set selected shape.
   * @param shape New selected shape.
   */
  public setSelectedShape(shape: Shape): void {
    this.selectedShape$.next(shape);
    this.selectedShapeChange.emit(shape);
  }

  private createCategoriesStream(): Observable<Category[]> {
    return this.categoriesService.getAll()
      .pipe(
        withLatestFrom(this.selectedCategory$),
        map(([categories, selectedCategory]) => {
          // If has selected category, then get latest version of this category.
          if (selectedCategory) {
            selectedCategory = categories.find(category => category.id === selectedCategory.id);
          }
          // If has not selected category, then get first category as selected.
          if (!selectedCategory && categories.length > 0) {
            selectedCategory = categories[0];
          }
          // Update selected category and get shapes of it.
          if (selectedCategory) {
            this.setSelectedCategory(selectedCategory);
          }
          return categories;
        }),
        share(),
      );
  }
}
