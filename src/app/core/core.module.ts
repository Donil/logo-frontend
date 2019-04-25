import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AdminGuardService } from './services/admin-guard.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { BusinessCardsService } from './services/business-cards.service';
import { CategoriesService } from './services/categories.service';
import { FilesService } from './services/files.service';
import { FontsService } from './services/fonts.service';
import { ShapesService } from './services/shapes.service';
import { UserService } from './services/user.service';

const interceptorsProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];

/**
 * Core module.
 */
@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    AuthGuardService,
    AdminGuardService,
    AuthService,
    BusinessCardsService,
    FilesService,
    FontsService,
    ShapesService,
    CategoriesService,
    UserService,
    interceptorsProviders,
  ],
  declarations: [],
})
export class CoreModule {
}
