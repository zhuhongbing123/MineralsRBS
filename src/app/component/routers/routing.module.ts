/**
 * 路由懒加载实现主路由
 */

import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { CommonModule } from '@angular/common';
import { LoginGuard } from 'src/app/common/loginguard';
@NgModule({
  imports: [
     // 使用 # 类型路由 userHash: true
     RouterModule.forRoot(routes, {useHash: true}),
    //  RouterModule.forRoot(routes),
  ],
  declarations: [

  ],
  exports: [RouterModule],
  providers: [LoginGuard]
})
export class RoutingModule { 
  routes = [];
}

