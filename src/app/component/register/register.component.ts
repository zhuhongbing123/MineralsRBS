import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from './register.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formMoudel: FormGroup;
  // 姓名,密码,用户账号
  public username:string;
  public password: string;
  public uid: string;
  constructor(private fb: FormBuilder,
    private router: Router,
    private registerService:RegisterService,
    private messageService: MessageService) { 
    this.formMoudel = fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  public onSubmit(type){
    if(type=='login'){
      this.router.navigate(['/login']);
      return;
    }
    if (!this.check()) {
      return;
    }

      const getToken$ = this.registerService.getTokenKey().subscribe(
        data => {
          if (data.data.tokenKey !== undefined) {
            const tokenKey = data.data.tokenKey;
            const userKey = data.data.userKey;
            getToken$.unsubscribe();
            const register$ = this.registerService.register('account/register',this.uid, this.username, this.password, tokenKey, userKey).subscribe(
              data2 => {
                // 注册成功返回
                if (data2.meta.code === 2002) {
     
                  this.messageService.add({key: 'tc', severity:'success', summary: '提示', detail: '用户注册成功跳转到登录界面'});
  
                  setTimeout( () => {
                    this.router.navigateByUrl('/login');
                  }, 1800 );
                  register$.unsubscribe();
                } else {
                  this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: data2.meta.msg});
                  register$.unsubscribe();
                }
              },
              () => {
                this.messageService.add({key: 'tc', severity:'error', summary: '警告', detail: '服务器开小差了'});
                register$.unsubscribe();
              }
            );
          }
        })
    
  }
  check() {
    if (!this.uid) {
      this.messageService.add({key: 'tc', severity:'error', summary: '警告', detail: '用户账号不能为空'});
      return false;
    }
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
