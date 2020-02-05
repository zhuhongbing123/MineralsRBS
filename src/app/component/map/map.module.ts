import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CheckboxModule, InputTextModule, ButtonModule, BreadcrumbModule, DialogModule, SidebarModule, TabMenuModule, PaginatorModule, CalendarModule, InputTextareaModule, DropdownModule, FileUploadModule, TreeModule, AutoCompleteModule, TooltipModule, SelectButtonModule, ColorPickerModule, SpinnerModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';
import { OutdoorComponent } from './outdoor/outdoor.component';
import { MapRoutes } from '../routers/map.route';
import { MapCommonModule } from '../../common/map/map.module';
import { ThreeMapComponent } from './three-map/three-map.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(MapRoutes),
    CheckboxModule, 
    InputTextModule,
    TableModule,
    MapCommonModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    SelectButtonModule,
    DialogModule,
    PaginatorModule,
    ColorPickerModule,
    SpinnerModule
  ],
  providers: [CarService],
  declarations: [OutdoorComponent, ThreeMapComponent],
  exports:[]
})
export class MapModule { }