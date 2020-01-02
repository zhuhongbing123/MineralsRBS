import {Injectable} from '@angular/core';

import * as CryptoJS from 'crypto-js';
import {HttpParams} from '@angular/common/http';
import { HttpUtil } from '../../common/util/http-util';
import { HttpUrl } from '../../common/util/http-url';

@Injectable()
export class SystemConfigService {
    private baseUrl: string;//通用的URL地址
  constructor(private httpUtil: HttpUtil) {
    this.baseUrl = localStorage.getItem('IP');
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
    const url = 'user/exit';
    return this.httpUtil.postLogin(url);
  }
}
