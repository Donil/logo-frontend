import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuardService } from './core/services/admin-guard.service';
import { AuthGuardService } from './core/services/auth-guard.service';

const routes: Routes = [{
    path: 'admin',
    canActivate: [
      AuthGuardService,
      AdminGuardService,
    ],
    loadChildren: './admin/admin.module#AdminModule',
}];

/**
 * App routing module.
 */
@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {
}
