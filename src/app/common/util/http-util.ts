import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {  HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResponseVO } from '../../component/pojo/ResponseVO';
import { HttpUrl } from './http-url';
import { RequestOptions} from '@angular/http'; 
@Injectable()
export class HttpUtil {
    private baseUrl: string;
    headers;
    options;
    constructor( private http: HttpClient,private router: Router) {
        this.baseUrl = HttpUrl.apiBaseUrl;
        this.headers = new HttpHeaders({ 'appId': localStorage.getItem('uid')?localStorage.getItem('uid'):'','token': localStorage.getItem('token')?localStorage.getItem('token'):''});
        this.options = new RequestOptions({ headers: this.headers });
    }
    public getLogin(url: string): Observable<ResponseVO> {
        const uri = url;
        return this.http.get<ResponseVO>(uri).pipe(
          //catchError(this.handleError())
        );
    }
    
    public postLogin(url: string, body?: any | null): Observable<ResponseVO> {
        const uri =  url;
        return this.http.post<ResponseVO>(uri, body).pipe(
            //catchError(this.handleError)
        );

    }

    /* 注销 */
    public postLogout(url: string, body?: any | null) {
      const uri =  url;
      if(!localStorage.getItem('token')){
        this.router.navigateByUrl('/login');
        return;
      }
      return this.http.post(uri, body,this.options).toPromise().then(res => {
          if (res["code"] === 401) {
            this.router.navigateByUrl("");
          } else {
            return res;
          }
        });

  }
    public get(url){
        return this.http
      .get(
        this.baseUrl + url
      )
      .toPromise()
      .then(res => {
        if (res["code"] === 401) {
          this.router.navigateByUrl("");
        } else {
          return res;
        }
      })
      .catch(error => {
        // this.router.navigateByUrl("");
        return error;
      });
    }
    public post(url, body) {
      return this.http
        .post(
          // this.https + url + "?access_token=12312312321313",
          this.baseUrl + url,
          body
        )
        .toPromise()
        .then(res => {
          if (res["code"] === 401) {
            this.router.navigateByUrl("");
          } else {
            return res;
          }
        })
        .catch(error => {
          // this.router.navigateByUrl("");
          return error;
        });
    }

    public delete(url) {
      return this.http
        .delete(
          this.baseUrl + url
        )
        .toPromise()
        .then(res => {
          if (res["code"] === 401) {
            this.router.navigateByUrl("");
          } else {
            return res;
          }
        })
        .catch(error => {
          // this.router.navigateByUrl("");
          return error;
        });
    }
    public put(url, body) {
      return this.http
        .put(
          this.baseUrl + url ,
          body
        )
        .toPromise()
        .then(res => {
          if (res["code"] === 401) {
            this.router.navigateByUrl("");
          } else {
            return res;
          }
        })
        .catch(error => {
          // this.router.navigateByUrl("");
          return error;
        });
    }
    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('http出错:', error.error.message);
        } else {
          console.error( `出错状态码: ${error.status}, ` +
            `出错: ${error.error}`);
        }
        //return new ErrorObservable('亲请检查网络');
    
    }

    
}