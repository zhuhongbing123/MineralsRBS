import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorationRightComponent } from './exploration-right.component';
import { RouterModule } from '@angular/router';
import { ExplorationRightRoutes } from '../routers/exploration-right.route';
import { ExplorationInfoComponent } from './exploration-info/exploration-info.component';
import { CheckboxModule, InputTextModule, ButtonModule, BreadcrumbModule, DialogModule, SidebarModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { CarService } from '../../demo/service/carservice';

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
    SidebarModule

  ],
  providers: [CarService],
  declarations: [ExplorationRightComponent, ExplorationInfoComponent]
})
export class ExplorationRightModule { }