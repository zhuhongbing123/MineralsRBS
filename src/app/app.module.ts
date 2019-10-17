import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MenuModule } from 'primeng/menu';

import {AppComponent} from './app.component';
import { LoginModule } from './component/login/login.module';
import { RoutingModule } from './component/routers/routing.module';
import { LayoutModule } from './component/layout/layout.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuSelectModule } from './component/menu-select/menu-select.module';
import {HashLocationStrategy,LocationStrategy} from '@angular/common';
import { CountryService } from './demo/service/countryservice';
import { HttpUtil } from './common/util/http-util';
import { RegisterModule } from './component/register/register.module';
import { HttpInterceptorProviders } from './component/interceptor/http-interceptor-providers';

@NgModule({
    imports: [
        BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RoutingModule,
    LayoutModule,
    LoginModule,
    MenuSelectModule,
    RegisterModule
        
        
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        HttpUtil,
        CountryService,
        MessageService,
        ConfirmationService,
        HttpInterceptorProviders
        
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }