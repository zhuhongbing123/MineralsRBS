import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CheckboxModule, InputTextModule, ButtonModule, BreadcrumbModule, DialogModule, SidebarModule, TabMenuModule, PaginatorModule, CalendarModule, InputTextareaModule, DropdownModule, FileUploadModule, TreeModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';
import { MiningInfoComponent } from './mining-info/mining-info.component';
import { MiningRightRoutes } from '../routers/mining-right.route';
import { MiningFileComponent } from './mining-file/mining-file.component';
import { ExplorationRightModule } from '../exploration-right/exploration-right.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(MiningRightRoutes),
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
    ExplorationRightModule,
    TreeModule
  ],
  providers: [CarService],
  declarations: [MiningInfoComponent, MiningFileComponent],
  exports:[]
})
export class MiningRightModule { }