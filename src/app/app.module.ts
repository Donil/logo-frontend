import { NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientModule } from './client/client.module';
import { ProvidersConfig } from './core/services/providers-config';
import { SharedModule } from './shared/shared.module';

const providersConfig: ProvidersConfig = {
  apiRootEndpoint: environment.apiUrl,
};

/**
 * Application root module.
 */
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'logo' }),
    BrowserAnimationsModule,
    SharedModule,
    ClientModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: ProvidersConfig, useValue: providersConfig },
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
