import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule, PaginatorModule, ButtonModule, DropdownModule, DialogModule, PanelMenuModule, SidebarModule, AutoCompleteModule, CalendarModule, MenubarModule, ToolbarModule, SplitButtonModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { SystemConfigService } from './system-config.service';
import { RouterModule } from '@angular/router';

import { LoginLogComponent } from './login-log/login-log.component';
import { TableModule } from 'primeng/table';
import { OperationLogComponent } from './operation-log/operation-log.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SystemConfigRoutes } from '../routers/system-config.route';
import { ApiManageComponent } from './api-manage/api-manage.component';
import { MenuManagementComponent } from './menu-management/menu-management.component';
import { MineralOwnerComponent } from './mineral-owner/mineral-owner.component';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    PasswordModule,
    FormsModule,
    RouterModule.forChild(SystemConfigRoutes),
    ReactiveFormsModule,
    ConfirmDialogModule,
    TableModule,
    PaginatorModule,
    ToastModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    PanelMenuModule,
    SidebarModule,
    AutoCompleteModule,
    CalendarModule,
    SplitButtonModule,
    NgxLoadingModule
    
  ],
  providers: [SystemConfigService],
  declarations: [
    LoginLogComponent, 
    OperationLogComponent, 
    RoleManagementComponent, 
    UserManagementComponent,
    ApiManageComponent,
    MenuManagementComponent,
    MineralOwnerComponent
  ]
})
export class SystemConfigModule { }