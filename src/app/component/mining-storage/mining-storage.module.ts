import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CheckboxModule, InputTextModule, ButtonModule, DialogModule, SidebarModule, TabMenuModule, PaginatorModule, CalendarModule, InputTextareaModule, DropdownModule, FileUploadModule, TreeModule, AutoCompleteModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';
import { MiningStorageRoutes } from '../routers/mining-storage.route';
import { DataImportExportComponent } from 'src/app/component/mining-storage/data-import-export/data-import-export.component';
import { DataAnalyzeComponent } from 'src/app/component/mining-storage/data-analyze/data-analyze.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(MiningStorageRoutes),
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
    AutoCompleteModule
  ],
  providers: [CarService],
  declarations: [DataImportExportComponent,DataAnalyzeComponent],
  exports:[]
})
export class MiningStorageModule { }