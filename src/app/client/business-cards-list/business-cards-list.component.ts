import { Component, Output, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

import { BusinessCard } from '../../core/models/business-card';
import { BusinessCardsService } from '../../core/services/business-cards.service';

/**
 * Business cards list component.
 */
@Component({
  selector: 'cl-business-cards-list',
  templateUrl: './business-cards-list.component.html',
  styleUrls: [
    './business-cards-list.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessCardsListComponent {
  private selectedCard$ = new BehaviorSubject<BusinessCard>(null);

  /**
   * .ctor
   * @param businessCardsService Besiness cards service.
   */
  public constructor(private businessCardsService: BusinessCardsService) {
    this.businessCards$ = this.createBusinessCardsSream();
  }

  /**
   * Selected card.
   */
  @Input()
  public set selectedCard(value: BusinessCard) {
    this.selectedCard$.next(value);
  }

  /**
   * Selected card change event.
   */
  @Output()
  public selectedCardChange = new EventEmitter<BusinessCard>();

  /**
   * Business cards list.
   */
  public businessCards$: Observable<BusinessCard[]>;

  /**
   * Set selected card.
   * @param card New selected card.
   */
  public setSetlectedCard(card: BusinessCard): void {
    this.selectedCard$.next(card);
    this.selectedCardChange.emit(card);
  }

  private createBusinessCardsSream(): Observable<BusinessCard[]> {
    return this.businessCardsService.getAll().pipe(
      publishReplay(1),
      refCount(),
    );
  }

  /**
   * Business card track function.
   * @param index Index.
   * @param card Business card.
   */
  public trackCardById(index: number, card: BusinessCard): number {
    return card.id;
  }
}
