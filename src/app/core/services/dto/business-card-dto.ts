import { BusinessCard } from '../../models/business-card';

/**
 * Business card DTO.
 */
export interface BusinessCardDto {
  id: number;

  data: string;

  thumbnailUrl: string;
}

/**
 * Business card DTO <=> model mapper.
 */
export class BusinessCardMapper {
  /**
   * Convert DTO to model.
   * @param cardDto Card DTO.
   */
  public toModel(cardDto: BusinessCardDto): BusinessCard {
    const card = new BusinessCard();
    card.id = cardDto.id;
    card.data = cardDto.data;
    card.thumbnailUrl = cardDto.thumbnailUrl;
    return card;
  }

  /**
   * Convert model to DTO.
   * @param card Card model.
   */
  public toDto(card: BusinessCard): BusinessCardDto {
    return {
      id: card.id,
      data: card.data,
      thumbnailUrl: card.thumbnailUrl,
    };
  }
}
