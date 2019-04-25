import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, publishReplay, refCount, mapTo, tap, startWith, catchError, switchMap } from 'rxjs/operators';

import { Category } from '../models/category';
import { Shape } from '../models/shape';

import { ShapeDto, ShapeMapper } from './dto/shape-dto';
import { ProvidersConfig } from './providers-config';

/**
 * Shapes service.
 */
@Injectable()
export class ShapesService {
  private readonly url;
  private shapesMapper: ShapeMapper;
  private shapesChange$ = new Subject<Shape>();
  // Map of categories shapes observables.
  private categoriesShapesStreams = new Map<number, Observable<Shape[]>>();

  /**
   * .ctor
   */
  public constructor(private http: HttpClient, private config: ProvidersConfig) {
    this.url = `${config.apiRootEndpoint}/api/shapes`;
    this.shapesMapper = new ShapeMapper(config);
  }

  /**
   * Get shapes by category.
   * @param category Category of shape.
   */
  public getByCategory(category: Category): Observable<Shape[]> {
    if (!this.categoriesShapesStreams.has(category.id)) {
      this.categoriesShapesStreams.set(category.id, this.createCategoryShapesStream(category));
    }

    return this.categoriesShapesStreams.get(category.id);
  }

  private createCategoryShapesStream(category: Category): Observable<Shape[]> {
    const url = `${this.config.apiRootEndpoint}/api/categories/${category.id}/shapes`;
    return this.shapesChange$.pipe(
      startWith(null),
      switchMap(() => this.http.get<ShapeDto[]>(url)),
      map(shapesDto => this.shapesMapper.toArrayModels(shapesDto)),
      catchError(error => {
        if (error.status === 404) {
          return of([]);
        }
        return throwError(error);
      }),
      publishReplay(1),
      refCount(),
    );
  }

  /**
   * Create new shape
   * @param shape Shape.
   */
  public create(shape: Shape): Observable<void> {
    const body = this.shapesMapper.toDto(shape);
    return this.http.post<ShapeDto>(`${this.url}`, body)
      .pipe(
        tap(() => this.shapesChange$.next(shape)),
        mapTo(null),
      );
  }

  /**
   * Remove shape.
   * @param shape Shape.
   */
  public remove(shape: Shape): Observable<void> {
    return this.http.delete(`${this.url}/${shape.id}`)
      .pipe(
        tap(() => this.shapesChange$.next(shape)),
        mapTo(null),
      );
  }
}
