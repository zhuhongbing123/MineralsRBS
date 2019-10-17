import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorationRightComponent } from './exploration-right.component';
import { RouterModule } from '@angular/router';
import { ExplorationRightRoutes } from '../routers/exploration-right.route';

import { CheckboxModule, InputTextModule, ButtonModule, BreadcrumbModule, DialogModule, SidebarModule, TabMenuModule, PaginatorModule, CalendarModule, InputTextareaModule, DropdownModule, FileUploadModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';
import { ExplorationFileComponent } from './exploration-file/exploration-file.component';
import { ExplorationInfoComponent } from './exploration-info/exploration-info.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ExplorationRightRoutes),
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
    FileUploadModule
  ],
  providers: [CarService],
  declarations: [
    ExplorationRightComponent, 
    ExplorationFileComponent, 
    ExplorationInfoComponent
  ],
  exports:[ExplorationFileComponent]
})
export class ExplorationRightModule { }