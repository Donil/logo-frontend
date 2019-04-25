import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { fabric } from 'fabric';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FontsService } from '../../core/services/fonts.service';

const SCALE_STEP = 0.1;
const TEXT_FABRIC_OBJECT_NAME = 'text';
const GROUP_FABRIC_OBJECT_NAME = 'path-group';

/**
 * Fabric object options component.
 */
@Component({
  selector: 'cl-object-options',
  templateUrl: './object-options.component.html',
  styleUrls: [
    './object-options.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectOptionsComponent implements OnInit {
  /**
   * .ctor
   * @param fontsService Fonts service.
   */
  public constructor(private fontsService: FontsService) {
  }

  /**
   * Fabric object.
   */
  @Input()
  public element: fabric.Object;

  /**
   * Object property change event.
   */
  @Output()
  public propertyChange = new EventEmitter<fabric.Object>();

  /**
   * Fonts families list.
   */
  public fontsFamilies$: Observable<string[]>;

  /**
   * @inheritDoc
   */
  public ngOnInit(): void {
    this.fontsFamilies$ = this.fontsService.getFamilies()
      .pipe(
        map(families => families.sort()),
      );
  }

  /**
   * Raise property change event.
   */
  private raisePropertyChange(): void {
    this.propertyChange.emit(this.element);
  }

  /**
   * Current fabric object as text element.
   */
  public get textElement(): fabric.Text {
    return this.element as fabric.Text;
  }

  /**
   * Get text of text element.
   */
  public get text(): string {
    return this.textElement.text;
  }

  /**
   * Set text for text element.
   */
  public set text(value: string) {
    this.textElement.setText(value);
    this.raisePropertyChange();
  }

  /**
   * Get font family of text element.
   */
  public get fontFamily(): string {
    return this.textElement.fontFamily;
  }

  /**
   * Set font family of text element.
   */
  public set fontFamily(value: string) {
    this.textElement.setFontFamily(value);
    setTimeout(() => this.raisePropertyChange(), 500); // Hack for wait while font is loaded
  }

  /**
   * Can change color.
   */
  public canChangeColor(): boolean {
    // TODO: Replace to simple property which will updated after `element` change.
    if (!this.element) {
      return false;
    }
    return !this.element.isType(GROUP_FABRIC_OBJECT_NAME);
  }

  /**
   * Get color of element.
   */
  public get color(): string {
    return this.element.fill;
  }

  /**
   * Set color of element.
   */
  public set color(value: string) {
    this.element.setFill(value);
    this.raisePropertyChange();
  }

  /**
   * Is a specific element is text element.
   */
  public get isTextElement(): boolean {
    return this.element.isType(TEXT_FABRIC_OBJECT_NAME);
  }

  /**
   * Increase scale.
   */
  public incScale(): void {
    this.element.setScaleX(this.element.scaleX + SCALE_STEP);
    this.element.setScaleY(this.element.scaleY + SCALE_STEP);
    this.raisePropertyChange();
  }

  /**
   * Decrease scale.
   */
  public decScale(): void {
    this.element.setScaleX(this.element.scaleX - SCALE_STEP);
    this.element.setScaleY(this.element.scaleY - SCALE_STEP);
    this.raisePropertyChange();
  }

  /**
   * Bring element to forward.
   */
  public bringForward(): void {
    this.element.bringForward();
    this.raisePropertyChange();
  }

  /**
   * Send element to backwards.
   */
  public sendBackwards(): void {
    this.element.sendBackwards();
    this.raisePropertyChange();
  }

  /**
   * Bring element to front.
   */
  public bringToFront(): void {
    this.element.bringToFront();
    this.raisePropertyChange();
  }

  /**
   * Send element to back.
   */
  public sendToBack(): void {
    this.element.sendToBack();
    this.raisePropertyChange();
  }
}
