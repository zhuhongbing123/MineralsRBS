import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { CheckboxModule, InputTextModule, ButtonModule, DialogModule, SidebarModule, TabMenuModule, PaginatorModule, CalendarModule, InputTextareaModule, DropdownModule, FileUploadModule, TreeModule, AutoCompleteModule, ProgressSpinnerModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';
import { PowerMonitoringComponent } from './power-monitoring/power-monitoring.component';

import { CameraMonitoringComponent } from './camera-monitoring/camera-monitoring.component';

import { Map2dService } from '../../common/map/map2-d/map2-d.service';
import { EnvironmentMonitoringComponent } from './environment-monitoring/environment-monitoring.component';
import { DisasterMonitoringComponent } from './disaster-monitoring/disaster-monitoring.component';
import { RemoteMonitoringRoutes } from '../routers/remote-monitoring.route';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(RemoteMonitoringRoutes),
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
  declarations: [PowerMonitoringComponent, CameraMonitoringComponent, EnvironmentMonitoringComponent, DisasterMonitoringComponent],
  exports:[]
})
export class RemoteMonitoringModule { }