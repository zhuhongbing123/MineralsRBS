import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
// import { LocalStorage } from '../../common/local.storage';
import { ToastModule } from 'primeng/toast';
import { MenuSelectComponent } from './menu-select.component';


@NgModule({
  imports: [
    CommonModule,
    // InputGroupModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [],
  declarations: [MenuSelectComponent]
})
export class MenuSelectModule { }