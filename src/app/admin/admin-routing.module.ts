import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShapesManagementComponent } from './shapes-management/shapes-management.component';

/**
 * Routes for admin module.
 */
const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'shapes',
  }, {
    path: 'shapes',
    component: ShapesManagementComponent,
}];

/**
 * Admin routing module.
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AdminRoutingModule {
}
