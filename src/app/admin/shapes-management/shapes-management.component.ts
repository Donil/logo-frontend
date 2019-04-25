import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, NEVER } from 'rxjs';
import { map, mergeMap, share, merge, switchMapTo, withLatestFrom } from 'rxjs/operators';

import { Category } from '../../core/models/category';
import { CategoriesService } from '../../core/services/categories.service';

/**
 * Shapes management component.
 */
@Component({
  selector: 'ad-shapes-management-component',
  templateUrl: './shapes-management.component.html',
  styleUrls: [
    './shapes-management.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapesManagementComponent {
  private createCategory$ = new Subject<string>();

  /**
   * .ctor
   * @param categoriesService Categories service.
   */
  public constructor(private categoriesService: CategoriesService) {
    this.categories$ = this.createCategoriesStream();
  }

  /**
   * Shapes categories.
   */
  public categories$: Observable<Category[]>;

  /**
   * Selected category.
   */
  public selectedCategory$ = new BehaviorSubject<Category>(null);

  private createCategoriesStream(): Observable<Category[]> {
    // For handle categories creating.
    // Does not produce any data after creating.
    const createCategory$ = this.createCategory$
      .pipe(
        mergeMap(categoryName => this.categoriesService.create(categoryName)),
        switchMapTo(NEVER),
      );

    return this.categoriesService.getAll().pipe(
        merge(createCategory$),
        withLatestFrom(this.selectedCategory$),
        map(([categories, selectedCategory]) => {
          if (selectedCategory == null && categories.length > 0) {
            this.setSelectedCategory(categories[0]);
          }
          return categories;
        }),
        share(),
      );
  }

  /**
   * On category click event handler.
   * @param category Clicked category.
   */
  public onCategoryClick(category: Category): void {
    this.setSelectedCategory(category);
  }

  /**
   * Set selected category.
   * @param category New selected category.
   */
  private setSelectedCategory(category: Category): void {
    this.selectedCategory$.next(category);
  }

  /**
   * On "add category" form submit event handler.
   * @param form Form.
   */
  public onAddCategoryFormSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const categoryNameControl = form.controls['categoryName'];
    form.reset();
    this.createCategory$.next(categoryNameControl.value);
  }
}
