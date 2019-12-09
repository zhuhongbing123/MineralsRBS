import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CheckboxModule, InputTextModule, ButtonModule, BreadcrumbModule, DialogModule, SidebarModule, TabMenuModule, PaginatorModule, CalendarModule, InputTextareaModule, DropdownModule, FileUploadModule, TreeModule, AutoCompleteModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';

import { Map2DComponent } from '../../common/map/map2-d/map2-d.component';
import { AppModule } from '../../app.module';
import { MapRoutes } from '../../component/routers/map.route';
import { Map2dService } from './map2-d/map2-d.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(MapRoutes),
    CheckboxModule, 
    InputTextModule,
    TableModule
    
  ],
  providers: [CarService,Map2dService],
  declarations: [Map2DComponent],
  exports:[Map2DComponent]
})
export class MapCommonModule { }