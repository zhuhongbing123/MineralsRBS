import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(
        private router: Router,
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // 返回值 true: 跳转到当前路由 false: 不跳转到当前路由

        // console.log("路由守卫")
        return true;
        // if (HTTP.isToken) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        //     return false;

        // }
    }

}

