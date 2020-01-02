import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MineralManageRoutes } from '../routers/mineral-manage.route';
import { MineralProjectComponent } from '../mineral-manage/mineral-project/mineral-project.component';
import { TableModule } from 'primeng/table';
import { ButtonModule, PaginatorModule, DialogModule, InputTextareaModule, CalendarModule, AutoCompleteModule, SidebarModule, ColorPickerModule, SpinnerModule, DialogService } from 'primeng/primeng';
import { MapCommonModule } from '../../common/map/map.module';
import { Map2dService } from '../../common/map/map2-d/map2-d.service';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { ElModule  } from 'element-angular';
import { ProjectMapComponent } from './project-map/project-map.component'
import { MineralManageService } from './mineral-manage.service';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      RouterModule.forChild(MineralManageRoutes),
      TableModule,
      ButtonModule,
      PaginatorModule,
      DialogModule,
      InputTextareaModule,
      CalendarModule,
      AutoCompleteModule,
      SidebarModule,
      DynamicDialogModule,
      ColorPickerModule,
      SpinnerModule,
      ElModule.forRoot()
    ],
    declarations:[MineralProjectComponent, ProjectMapComponent],
    providers:[Map2dService,DialogService,MineralManageService],
    entryComponents: [
      ProjectMapComponent
    ]
})
export class MineralManageModule { }