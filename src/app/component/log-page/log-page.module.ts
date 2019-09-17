import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogPageComponent } from './log-page.component';
import { RouterModule } from '@angular/router';
import { LogPageRoutes } from '../routers/log-page.route';
import { LogComponent } from './log/log.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/primeng';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      RouterModule.forChild(LogPageRoutes),
      TableModule,
      PaginatorModule
    ],
    declarations: [LogPageComponent, LogComponent]
  })
  export class LogPageModule { }