import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';


import {catchError, mergeMap, repeat} from 'rxjs/operators';
import {Router} from '@angular/router';
import { Observable , of} from 'rxjs';
import { LoginService } from '../login/login.service';
import { MessageService } from 'primeng/api';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private router: Router,
               private loginService: LoginService,
               private messageService: MessageService,
               ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('token');
    const uid =  localStorage.getItem('uid');
    let authReq: any;
    if (authToken != null && uid != null) {
      authReq = req.clone({
        setHeaders: {
          'authorization': authToken,
          'appId': uid
        }
      });
    } else {
      authReq = req.clone();
    
    }

    return next.handle(authReq).pipe(
      mergeMap(event => {
        
        // 返回response
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            /* if(event.body.serverIP){
              return;
            } */
            // 若返回JWT过期但refresh token未过期,返回新的JWT 状态码为1005
            
            if (event.body.meta && event.body.meta.code === 1005) {
              
              const jwt = event.body.data.jwt;
              // 更新AuthorizationToken
              localStorage.setItem('token',jwt);
              // clone request 重新发起请求
              // retry(1);
              authReq = req.clone({
                setHeaders: {
                  'authorization': jwt,
                  'appId': uid
                }
              });
              return next.handle(authReq);

            }
            // jwt过期  清空本地信息跳转登录界面
            if (event.body.meta &&  event.body.meta.code === 1006) {
              this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '长时间未操作，请重新登录'});
              localStorage.clear();
              this.loginService.exit();
              return;
            }
            // err jwt 情况本地信息跳转登录界面
            if (event.body.meta && event.body.meta.code === 1007) {
              this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '长时间未操作，请重新登录'});
              localStorage.clear();
              this.loginService.exit();
              return;
            }
            //注销之后跳转登录界面
            if (event.body.meta && event.body.meta.code === 2004) {
              this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '长时间未操作，请重新登录'});
              localStorage.clear();
              this.loginService.exit();
              return;
            }
          }
          if (event.body.meta && event.status === 404) {
            // go to 404 html
            this.router.navigateByUrl('/404');
          }
          if (event.body.meta && event.status === 500) {
            // go to 500 html
            this.router.navigateByUrl('/500');
          }
        }
        // 返回正常情况的可观察对象
        return of(event);
      }),
      //catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error( `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    repeat(1);
    //return new ErrorObservable('亲请检查网络');

  }
}
