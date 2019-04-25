import { isPlatformBrowser, NgStyle } from '@angular/common';
import {
  Component,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatMenuTrigger, MatMenu } from '@angular/material';
import { fabric } from 'fabric';
import { BehaviorSubject } from 'rxjs';

import { ChangesHistory } from '../../core/models/changes-history';
import { ImageFormat } from '../../core/models/image-format';
import { Shape } from '../../core/models/shape';

const CANVAS_BG_COLOR = 'white';
const CANVAS_SELECTION_COLOR = 'rgba(0,255,0,0.3)';
const CANVAS_SELECTION_BORDER_COLOR = 'red';
const CANVAS_SELECTION_LINE_WIDTH = 5;

/**
 * Painter canvas component.
 */
@Component({
  selector: 'cl-painter-canvas',
  templateUrl: './painter-canvas.component.html',
  styleUrls: [
    './painter-canvas.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainterCanvasComponent implements AfterViewInit, OnDestroy {
  private fabricCanvas: fabric.Canvas;
  private lastestAddedElement: fabric.Object;
  private wasChanges: boolean;
  private changesHistory: ChangesHistory<string>;

  /**
   * .ctor
   * @param platformId Platform Id.
   * @param element Element reference.
   */
  public constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private element: ElementRef) {
      this.changesHistory = new ChangesHistory<string>();
      this.updateCanvasSize = this.updateCanvasSize.bind(this);
  }

  /**
   * Context menu trigger.
   */
  @ViewChild(MatMenuTrigger)
  public contextMenuTrigger: MatMenuTrigger;

  /**
   * Context menu trigger element.
   */
  @ViewChild('contextMenuTriggerElement')
  public contextMenuTriggerElement: ElementRef;

  /**
   * Context menu.
   */
  @ViewChild(MatMenu)
  public contextMenu: MatMenu;

  /**
   * Html canvas element.
   */
  @ViewChild('canvas')
  public canvasElementRef: ElementRef;

  /**
   * Selected painter item.
   */
  public selectedItem: fabric.Object;

  public contextMenuStyle$ = new BehaviorSubject<Partial<CSSStyleDeclaration>>({});

  /**
   * @inheritDoc
   */
  public ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Configure canvas
    const canvas = this.canvasElementRef.nativeElement as HTMLCanvasElement;
    this.fabricCanvas = new fabric.Canvas(canvas, {
      backgroundColor: CANVAS_BG_COLOR,
      selectionColor: CANVAS_SELECTION_COLOR,
      selectionBorderColor: CANVAS_SELECTION_BORDER_COLOR,
      selectionLineWidth: CANVAS_SELECTION_LINE_WIDTH,
    });

    this.changesHistory.push(this.fabricCanvas.toDatalessJSON());

    this.updateCanvasSize();

    // Resize canvas when window resized.
    // TODO: Use approach without `window`.
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.updateCanvasSize);
    }

    // Subscribe to fabric events.
    this.fabricCanvas.on({
      'object:selected': (event: fabric.IEvent ) => {
        this.selectedItem = event.target;
        this.showContextMenuTrigger(this.selectedItem);
      },
      'selection:cleared': (e: fabric.IEvent ) => {
        this.hideContextMenu();
        this.selectedItem = null;
      },
      'object:added': () => this.initFabricChanges(),
      'object:modified': () => this.initFabricChanges(),
      'object:rotating': () => this.initFabricChanges(),
      'object:scaling': () => this.initFabricChanges(),
      'object:moving': () => {
        this.hideContextMenu();
        this.initFabricChanges();
      },
      'mouse:up': (event: fabric.IEvent ) => {
        if (event.target != null) {
          this.showContextMenuTrigger(event.target);
        }
        this.saveState();
      },
    });
  }

  /**
   * @inheritDoc
   */
  public ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.updateCanvasSize);
    }
  }

  /**
   * Set `was changes` flag to true.
   */
  private initFabricChanges(): void {
    this.wasChanges = true;
  }

  /**
   * Save current state to history.
   */
  private saveState(): void {
    if (!this.wasChanges) {
      return;
    }
    this.changesHistory.push(this.fabricCanvas.toDatalessJSON());
    this.wasChanges = false;
  }

  /**
   * Show context menu trigger element.
   * @param target Fabric element which for need show context menu trigger.
   */
  private showContextMenuTrigger(target: fabric.Object): void {
    const scaleX = target.scaleX || 0;
    const targetWidth = target.width * scaleX;
    let left = target.left + targetWidth;
    if (left + this.contextMenuTriggerElement.nativeElement.clientWidth > this.fabricCanvas.getWidth()) {
      left = left - targetWidth - this.contextMenuTriggerElement.nativeElement.clientWidth;
    }
    // Display contet menu trigger button.
    this.contextMenuStyle$.next({
      display: 'block',
      top: `${target.top}px`,
      left: `${left}px`,
      bottom: 'initial',
      right: 'initial',
    });
  }

  /**
   * Hide context menu.
   */
  private hideContextMenu(): void {
    this.contextMenuStyle$.next({
      display: 'none',
    });
  }

  /**
   * Add fabric element.
   * @param element Fabric element.
   */
  private addFabricElement(element: fabric.Object): void {
    this.wasChanges = true;
    if (this.lastestAddedElement) {
      element.setTop(this.lastestAddedElement.top + 20);
      element.setLeft(this.lastestAddedElement.left + 20);
    }

    this.fabricCanvas.add(element);
    this.fabricCanvas.setActiveObject(element);
    this.selectedItem = element;

    this.lastestAddedElement = element;
    this.saveState();
  }

  /**
   * Add text element.
   */
  public addText(text: string = 'New Text'): void {
    const textEl = new fabric.Text(text, {
      top: 100,
      left: 100,
    });
    this.addFabricElement(textEl);
  }

  /**
   * Add image to canvas.
   * @param imageUrl Image url.
   */
  public addImage(imageUrl: string): void {
    fabric.Image.fromURL(imageUrl, image => {
      if (image.getHeight() > this.fabricCanvas.getHeight() / 2) {
        const scaleX = this.fabricCanvas.getHeight() / image.getHeight();
        const scaleY = this.fabricCanvas.getWidth() / image.getWidth();
        const scale = Math.min(scaleX, scaleY);
        image.scale(scale);
      }
      this.addFabricElement(image);
    });
  }

  /**
   * Add shape to canvas.
   */
  public addShape(shape: Shape): void {
    fabric.loadSVGFromURL(shape.url,
      (results: fabric.Object[], options: any) => {
        const group = fabric.util.groupSVGElements(results, options);
        this.addFabricElement(group);
      });
  }

  /**
   * On "remove item" click event handler.
   */
  public onRemoveItemClick(): void {
    this.removeSelectedItem();
  }

  /**
   * Delete selected item.
   */
  public removeSelectedItem(): void {
    this.fabricCanvas.remove(this.selectedItem);
    this.selectedItem = null;
    this.saveState();
  }

  /**
   * On "duplicate item" click event handler.
   */
  public onDuplicateItemClick(): void {
    this.duplicateSelectedItem();
  }

  /**
   * Duplicate selected item.
   */
  public duplicateSelectedItem(): void {
    const clonedObject = fabric.util.object.clone(this.selectedItem);
    this.addFabricElement(clonedObject);
  }

  /**
   * Convert current state of canvas to data url.
   * @param imageFormat Image format.
   */
  public toDataURL(imageFormat: ImageFormat): string {
    return this.fabricCanvas.toDataURL({ format: imageFormat });
  }

  /**
   * Convert current state of canvas to JSON object.
   */
  public toJSON(): any {
    return (this.fabricCanvas as any).toJSON();
  }

  /**
   * Convert current state of canvas to SVG.
   */
  public toSVG(): string {
    return this.fabricCanvas.toSVG(null);
  }

  /**
   * Load state form JSON.
   * @param data Data for load.
   */
  public loadFromJSON(data: string): void {
    this.fabricCanvas.loadFromJSON(data, () => {
      this.fabricCanvas.renderAll();
      this.changesHistory = new ChangesHistory<string>(this.fabricCanvas.toDatalessJSON());
    });
  }

  /**
   * Can undo current state,
   */
  public get canUndo(): boolean {
    return this.changesHistory.canUndo;
  }

  /**
   * Undo current state.
   */
  public undo(): void {
    const state = this.changesHistory.undo();
    (this.fabricCanvas as any).loadFromDatalessJSON(state);
    this.wasChanges = false;
  }

  /**
   * Can redo.
   */
  public get canRedo(): boolean {
    return this.changesHistory.canRedo;
  }

  /**
   * Redo state.
   */
  public redo(): void {
    const state = this.changesHistory.redo();
    (this.fabricCanvas as any).loadFromDatalessJSON(state);
    this.wasChanges = false;
  }

  /**
   * Init new canvas,
   */
  public newCanvas(): void {
    this.fabricCanvas.clear();
    this.fabricCanvas.backgroundColor = CANVAS_BG_COLOR;
    this.fabricCanvas.selectionBorderColor = CANVAS_SELECTION_BORDER_COLOR;
    this.fabricCanvas.selectionColor = CANVAS_SELECTION_COLOR;
    this.fabricCanvas.selectionLineWidth = CANVAS_SELECTION_LINE_WIDTH;
    this.fabricCanvas.renderAll();
  }

  /**
   * On elemenet property changed callback.
   * @param element Fabric element.
   */
  public onEementPropertyChange(element: fabric.Object): void {
    this.fabricCanvas.renderAll();
  }

  /**
   * Update size of canvas according size of container.
   */
  public updateCanvasSize(): void {
    this.fabricCanvas.setWidth(this.element.nativeElement.clientWidth);
    this.fabricCanvas.setHeight(this.element.nativeElement.clientHeight);
  }
}
