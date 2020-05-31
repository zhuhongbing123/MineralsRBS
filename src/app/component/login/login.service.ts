import {Injectable} from '@angular/core';

import * as CryptoJS from 'crypto-js';
import {HttpParams, HttpClient} from '@angular/common/http';
import { HttpUtil } from '../../common/util/http-util';
import { HttpUrl } from '../../common/util/http-url';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
    private baseUrl: string;//通用的URL地址
  constructor(private httpUtil: HttpUtil,
              private confirmationService: ConfirmationService,
              private router: Router,
              private messageService: MessageService,
              private http: HttpClient) {
    this.baseUrl = sessionStorage.getItem('IP');
    
    
  }
  getIP(){
    return this.http.get<any>('assets/server.json')
                  .toPromise()
                  .then(res => res.data)
                  
    
  }
  getTokenKey() {
    this.baseUrl = sessionStorage.getItem('IP');
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
        this.logOut().then(value=>{
          if (value['meta'].code === 6666) {
            // 本地消除存储用户信息
            sessionStorage.clear();
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
    return this.httpUtil.postLogout(url);
  }
  
  /* jwt过期退出 */
  exit(){
    this.logOut().then(value=>{
      if (value['meta'].code === 6666 || value['meta'].code === 2004) {
        // 本地消除存储用户信息
        sessionStorage.clear();
        this.router.navigateByUrl('/login');
        return;
      
      }
    }).catch(()=>{
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
    }).finally();
  }
  

}
