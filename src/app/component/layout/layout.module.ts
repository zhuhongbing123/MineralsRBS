import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { MenuComponent, SubMenuComponent } from './menu.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { TopBarComponent } from './topbar.component';
import { ConfirmDialogModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast'
import { ProfileComponent } from './profile.component';

// import { RoutingModule } from 'src/app/component/routers/routing.module';


@NgModule({
  imports: [
    CommonModule,
    // RoutingModule,
    RouterModule,
    ScrollPanelModule,
    ConfirmDialogModule,
    ToastModule
  ],
  declarations: [
    LayoutComponent,
    MenuComponent,
    SubMenuComponent,
    ProfileComponent,
    TopBarComponent
  ],
  providers: [
  ]
})
export class LayoutModule { }
