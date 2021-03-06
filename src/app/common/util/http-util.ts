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
    private baseUrl;
    headers;
    options;
    constructor( private http: HttpClient,private router: Router) {
        /* this.http.get('assets/server.json').subscribe(res=>{
          let aa;
        }) */
        
             
        this.baseUrl = sessionStorage.getItem('IP');
        this.headers = new HttpHeaders({ 'appId': sessionStorage.getItem('uid')?sessionStorage.getItem('uid'):'','token': sessionStorage.getItem('token')?sessionStorage.getItem('token'):''});
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
      if(!sessionStorage.getItem('token')){
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
      this.baseUrl = sessionStorage.getItem('IP');
      return this.http.get(this.baseUrl + url).toPromise()
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
    

    public delete(url,body?) {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body:body
      };
      return this.http
        .delete(
          this.baseUrl + url,options
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