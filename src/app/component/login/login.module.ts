import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/primeng';
// import { LocalStorage } from '../../common/local.storage';
import { ToastModule } from 'primeng/toast';
import { LoginService } from './login.service';

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
  providers: [LoginService],
  declarations: [LoginComponent]
})
export class LoginModule { }