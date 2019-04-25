import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatSidenavModule,
  MatMenuModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatIconRegistry,
} from '@angular/material';

import { CoreModule } from '../core/core.module';

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

/**
 * Shared module.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    MatButtonModule,
    MatSelectModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
  ],
  declarations: [
    LoginComponent,
    LoginPageComponent,
    ConfirmDialogComponent,
    LoginDialogComponent,
    RegistrationComponent,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    LoginDialogComponent,
  ],
  exports: [
    FormsModule,
    CommonModule,
    CoreModule,
    LoginComponent,
    LoginPageComponent,
    MatSelectModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
  ],
})
export class SharedModule {
  public constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
