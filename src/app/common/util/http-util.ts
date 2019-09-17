import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResponseVO } from '../../component/pojo/ResponseVO';
import { HttpUrl } from './http-url';

@Injectable()
export class HttpUtil {
    private baseUrl: string;
    constructor( private http: HttpClient,private router: Router) {
        this.baseUrl = HttpUrl.apiBaseUrl;
    }
    public get(url: string): Observable<ResponseVO> {
        const uri = url;
        return this.http.get<ResponseVO>(uri).pipe(
          //catchError(this.handleError())
        );
    }
    public post(url: string, body?: any | null): Observable<ResponseVO> {
        const uri =  url;
        return this.http.post<ResponseVO>(uri, body).pipe(
            //catchError(this.handleError)
        );

    }
    public getID(url){
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