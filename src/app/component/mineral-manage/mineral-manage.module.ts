import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MineralManageRoutes } from '../routers/mineral-manage.route';
import { MineralProjectComponent } from '../mineral-manage/mineral-project/mineral-project.component';
import { TableModule } from 'primeng/table';
import { ButtonModule, PaginatorModule, DialogModule, InputTextareaModule, CalendarModule } from 'primeng/primeng';

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
      CalendarModule
    ],
    declarations:[MineralProjectComponent]
})
export class MineralManageModule { }