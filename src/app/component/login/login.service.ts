import {Injectable} from '@angular/core';

import * as CryptoJS from 'crypto-js';
import {HttpParams} from '@angular/common/http';
import { HttpUtil } from '../../common/util/http-util';
import { HttpUrl } from '../../common/util/http-url';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
    private baseUrl: string;//通用的URL地址
  constructor(private httpUtil: HttpUtil,
              private confirmationService: ConfirmationService,
              private router: Router) {
    this.baseUrl = HttpUrl.apiBaseUrl;
  }

  getTokenKey() {
    const url =this.baseUrl +  'account/login?tokenKey=get';
    // 先向后台申请加密tokenKey tokenKey=get
    return this.httpUtil.getLogin(url);
  }

  login(appId: string, password: string, tokenKey: string, userKey: string) {
    const url = this.baseUrl + 'account/login';
    tokenKey = CryptoJS.enc.Utf8.parse(tokenKey);
    password = CryptoJS.enc.Utf8.parse(password);
    // AES CBC加密模式
    password = CryptoJS.AES.encrypt(password, tokenKey, {iv: tokenKey, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString();
    console.log(password);
    const param = new HttpParams().append('appId', appId)
      .append('password', password)
      .append('methodName', 'login')
      .append('userKey', userKey)
      .append('timestamp', new Date().toUTCString());

    const body = {
      'appId': appId,
      'password': password,
      'methodName': 'login',
      'userKey': userKey,
      'timestamp': new Date().toUTCString()
    };

    return this.httpUtil.postLogin(url, body);
  }

  logout() {
    this.confirmationService.confirm({
      message: "注销后，需要重新登录，是否继续?",
      header: "注销",
      icon: "pi pi-info-circle",

      accept: () => {
        localStorage.clear();
        this.logOut().subscribe(value=>{
          if (value.meta.code === 6666) {
            // 本地消除存储用户信息
            
            this.router.navigateByUrl('/login');
          
          }
        })
      },
      reject: () => {
      
      }
      });

  }
  logOut() {
    const url = this.baseUrl + 'user/exit';
    return this.httpUtil.postLogin(url);
  }
  
}