import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { BusinessCardsListComponent } from './business-cards-list/business-cards-list.component';
import { ClientRoutingModule } from './client-routing.module';
import { ObjectOptionsComponent } from './object-options/object-options.component';
import { PainterCanvasComponent } from './painter-canvas/painter-canvas.component';
import { PainterMenuComponent } from './painter-menu/painter-menu.component';
import { PainterComponent } from './painter/painter.component';
import { SelectBusinessCardDialogComponent } from './select-business-card-dialog/select-business-card-dialog.component';
import { SelectShapeDialogComponent } from './select-shape-dialog/select-shape-dialog.component';
import { ShapesGridComponent } from './shapes-grid/shapes-grid.component';

/**
 * Client module.
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule,
  ],
  declarations: [
    ObjectOptionsComponent,
    PainterComponent,
    ShapesGridComponent,
    PainterMenuComponent,
    PainterCanvasComponent,
    SelectShapeDialogComponent,
    BusinessCardsListComponent,
    SelectBusinessCardDialogComponent,
  ],
  entryComponents: [
    SelectShapeDialogComponent,
    SelectBusinessCardDialogComponent,
  ],
})
export class ClientModule {
}
