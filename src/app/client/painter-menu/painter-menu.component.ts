import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';

import { ImageFormat } from '../../core/models/image-format';

/**
 * Painter menu component.
 */
@Component({
  selector: 'cl-painter-menu',
  templateUrl: './painter-menu.component.html',
  styleUrls: [
    './painter-menu.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainterMenuComponent {
  /**
   * .ctor
   */
  public constructor() {
    this.availableFormats = Object.keys(ImageFormat)
      .map(key => ({
        format: ImageFormat[key],
        title: key,
      }));
  }

  /**
   * Available format for save.
   */
  public availableFormats: ImageFormatItem[];

  /**
   * Can undo.
   */
  @Input()
  public canUndo = false;

  /**
   * Can redo.
   */
  @Input()
  public canRedo = false;

  /**
   * Toggle sidebar clicked event.
   */
  @Output()
  public toggleSidebarClick = new EventEmitter();

  /**
   * Undi clicked.
   */
  @Output()
  public undoClick = new EventEmitter();

  /**
   * Redo clicked.
   */
  @Output()
  public redoClick = new EventEmitter();

  /**
   * Create new cicked.
   */
  @Output()
  public createNewClick = new EventEmitter();

  /**
   * Save clicked event.
   */
  @Output()
  public saveClick = new EventEmitter();

  /**
   * Open clicked event.
   */
  @Output()
  public openClick = new EventEmitter();

  /**
   * Download clicked event.
   */
  @Output()
  public downloadClick = new EventEmitter<ImageFormat>();

  /**
   * Toggle sidebar.
   */
  public onToggleSidebarClick(): void {
    this.toggleSidebarClick.emit();
  }

  /**
   * Undo.
   */
  public onUndoClick(): void {
    this.undoClick.emit();
  }

  /**
   * Redo.
   */
  public onRedoClick(): void {
    this.redoClick.emit();
  }

  /**
   * Create new.
   */
  public onCreateNewClick(): void {
    this.createNewClick.emit();
  }

  /**
   * Save.
   */
  public onSaveClick(): void {
    this.saveClick.emit();
  }

  /**
   * Open.
   */
  public onOpenClick(): void {
    this.openClick.emit();
  }

  /**
   * Download.
   * @param format Image format
   */
  public onDownloadClick(format: ImageFormat): void {
    this.downloadClick.emit(format);
  }
}

/**
 * Image format item.
 */
interface ImageFormatItem {
  format: ImageFormat;
  title: string;
}
