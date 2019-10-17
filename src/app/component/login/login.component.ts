import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';


import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // 姓名,密码 
  public username:string;
  public password:string;
  // Token:any;
  constructor(
  
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private loginService: LoginService) {

  }

  onSubmit(type) {
    if(type ==='register'){
      this.router.navigate(['/register']);
    }else{
      if (!this.check()) {
        return;
      }
    // 获取tokenKey秘钥
    const getToken$ = this.loginService.getTokenKey().subscribe(
      data => {
        if (data.data.tokenKey !== undefined) {
          const tokenKey = data.data.tokenKey;
          const userKey = data.data.userKey;
          getToken$.unsubscribe();
          const login$ = this.loginService.login(this.username, this.password, tokenKey, userKey).subscribe(
            data2 => {
              // 认证成功返回jwt
              if (data2.meta.code === 1003 && data2.data.jwt != null) {
                localStorage.setItem('token', data2.data.jwt);
                localStorage.setItem('uid', this.username);
                login$.unsubscribe();
                this.router.navigate(['/menu']);
              } else {
                this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '用户名密码错误'});
                login$.unsubscribe();
              }
            },
            error => {
              console.error(error);
              login$.unsubscribe();
              this.messageService.add({key: 'tc', severity:'error', summary: '警告', detail: '服务器开小差啦'});
            }
          );
        }
      }
    );
    }
  }
  keyUpSearch() {
    this.onSubmit('');
  }

  ngOnInit() {
    window.sessionStorage.setItem('HTTP', window.location.hostname)
  }
  check() {
    if (!this.username) {
      this.messageService.add({key: 'tc', severity:'error', summary: '警告', detail: '用户名不能为空'});
      return false;
    }
    if (!this.password) {
      this.messageService.add({key: 'tc', severity:'error', summary: '警告', detail: '密码不能为空'});
      return false;
    }
    return true;
  }

}
