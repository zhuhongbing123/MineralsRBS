import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CheckboxModule, InputTextModule, ButtonModule, DialogModule, SidebarModule, TabMenuModule, PaginatorModule, CalendarModule, InputTextareaModule, DropdownModule, FileUploadModule, TreeModule, AutoCompleteModule, ProgressSpinnerModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';

import { GreenMiningRoutes } from '../routers/green-mining.route';

import { MapCommonModule } from '../../common/map/map.module';
import { Map2dService } from '../../common/map/map2-d/map2-d.service';
import { DataImportExportComponent } from 'src/app/component/green-mining/data-import-export/data-import-export.component';
import { DataAnalyzeComponent } from 'src/app/component/green-mining/data-analyze/data-analyze.component';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(GreenMiningRoutes),
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
    ProgressSpinnerModule,
    TreeModule,
    AutoCompleteModule,
    
  ],
  providers: [CarService,Map2dService],
  declarations: [DataImportExportComponent,DataAnalyzeComponent],
  exports:[]
})
export class GreenMiningModule { }