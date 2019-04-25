import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BusinessCard } from '../models/business-card';

import { BusinessCardDto, BusinessCardMapper } from './dto/business-card-dto';
import { ProvidersConfig } from './providers-config';

/**
 * Business cards service.
 */
@Injectable()
export class BusinessCardsService {
  private readonly url;
  private cardMapper = new BusinessCardMapper();

  /**
   * .ctor
   */
  public constructor(private http: HttpClient, private config: ProvidersConfig) {
    this.url = `${config.apiRootEndpoint}/api/businesscards`;
  }

  /**
   * Get all business cards.
   */
  public getAll(): Observable<BusinessCard[]> {
    return this.http.get<BusinessCardDto[]>(this.url)
      .pipe(
        map(cardsDto => cardsDto.map(dto => this.cardMapper.toModel(dto))),
      );
  }

  /**
   * Get business card by id.
   * @param id Business card Id.
   */
  public get(id: number): Observable<BusinessCard> {
    return this.http.get<BusinessCardDto>(`${this.url}?id=${id}`)
      .pipe(
        map(cardDto => this.cardMapper.toModel(cardDto)),
      );
  }

  /**
   * Save business card.
   * @param card Business card.
   */
  public save(card: BusinessCard): Observable<void> {
    const body = this.cardMapper.toDto(card);
    return this.http.post<BusinessCardDto>(this.url, body)
      .pipe(map(() => null));
  }
}
