import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from '../shared/login-page/login-page.component';

import { PainterComponent } from './painter/painter.component';

/**
 * Routes list.
 */
const routes = [
  { path: '', pathMatch: 'full', component: PainterComponent },
  { path: 'login/:returnUrl', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
];

/**
 * Client routing module.
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ClientRoutingModule {
}
