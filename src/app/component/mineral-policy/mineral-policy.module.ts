import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CheckboxModule, InputTextModule, ButtonModule, DialogModule, SidebarModule, TabMenuModule, PaginatorModule, CalendarModule, InputTextareaModule, DropdownModule, FileUploadModule, TreeModule, AutoCompleteModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';
import { MineralPolicyRoutes } from '../routers/mineral-policy.route';
import { PolicyFileComponent } from './policy-file/policy-file.component';
import { ExplorationRightModule } from '../exploration-right/exploration-right.module';
import { PolicyReportComponent } from './policy-report/policy-report.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(MineralPolicyRoutes),
    CheckboxModule, 
    InputTextModule,
    TableModule,
    ButtonModule,
    DialogModule,
    SidebarModule,
    TabMenuModule,
    PaginatorModule,
    CalendarModule,
    InputTextareaModule,
    DropdownModule,
    FileUploadModule,
    TreeModule,
    AutoCompleteModule,
    ExplorationRightModule
  ],
  providers: [CarService],
  declarations: [PolicyFileComponent, PolicyReportComponent],
  exports:[]
})
export class MineralPolicyModule { }