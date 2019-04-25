import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AddShapeDialogComponent } from './add-shape-dialog/add-shape-dialog.component';
import { AddShapeComponent } from './add-shape/add-shape.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ImportShapesDialogComponent } from './import-shapes-dialog/import-shapes-dialog.component';
import { ImportShapesComponent } from './import-shapes/import-shapes.component';
import { ShapesManagementGridComponent } from './shapes-management-grid/shapes-management-grid.component';
import { ShapesManagementComponent } from './shapes-management/shapes-management.component';

/**
 * Admin module.
 */
@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],
  declarations: [
    AddShapeComponent,
    AddShapeDialogComponent,
    ImportShapesComponent,
    ImportShapesDialogComponent,
    ShapesManagementComponent,
    ShapesManagementGridComponent,
  ],
  entryComponents: [
    AddShapeDialogComponent,
    ImportShapesDialogComponent,
  ],
})
export class AdminModule { }
