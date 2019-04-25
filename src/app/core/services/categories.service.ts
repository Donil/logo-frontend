import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, publishReplay, refCount, startWith, switchMapTo, tap, switchMap } from 'rxjs/operators';

import { Category } from '../models/category';

import { CategoryDto, CategoryMapper } from './dto/category-dto';
import { ProvidersConfig } from './providers-config';

/**
 * Categoies service.
 */
@Injectable()
export class CategoriesService {
  private readonly url;
  private readonly categoriesChange$ = new Subject<Category>();
  private categoryMapper = new CategoryMapper();
  private allCategories$: Observable<Category[]>;

  /**
   * .ctor
   * @param http Http clinet.
   * @param config Config.
   */
  public constructor(private http: HttpClient, private config: ProvidersConfig) {
    this.url = `${config.apiRootEndpoint}/api/categories`;
    this.allCategories$ = this.createAllCategoriesStream();
  }

  /**
   * Get all categories.
   */
  public getAll(): Observable<Category[]> {
    return this.allCategories$;
  }

  private createAllCategoriesStream(): Observable<Category[]> {
    return this.categoriesChange$.pipe(
        startWith(null),
        switchMap(() => this.http.get<CategoryDto[]>(this.url)),
        map(categories => categories.map(category => this.categoryMapper.toModel(category))),
        publishReplay(1),
        refCount(),
      );
  }

  /**
   * Create category.
   * @param categoryName Category name.
   */
  public create(categoryName: string): Observable<Category> {
    const body: CategoryDto = {
      name: categoryName,
    };
    return this.http.post<CategoryDto>(this.url, body)
      .pipe(
        map(categoryDto => this.categoryMapper.toModel(categoryDto)),
        tap(category => this.categoriesChange$.next(category)),
      );
  }
}
