import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/primeng';
// import { LocalStorage } from '../../common/local.storage';
import { ToastModule } from 'primeng/toast';
import { RegisterComponent } from './register.component';
import { RegisterService } from './register.service';

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
  providers: [RegisterService],
  declarations: [RegisterComponent]
})
export class RegisterModule { }