import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { LoginGuard } from '../../common/loginguard';
import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from '../login/login.component';
import { MenuSelectComponent } from '../menu-select/menu-select.component';
import { RegisterComponent } from '../register/register.component';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'menu',
        component: MenuSelectComponent
    },
    {
    path: 'layout',
    component: LayoutComponent,  // 页面内容入口
    canActivate: [LoginGuard],
    children: [
        { path: '', redirectTo: 'explorationRight', pathMatch: 'full' },
        { path: 'explorationRight', loadChildren: '../exploration-right/exploration-right.module#ExplorationRightModule' },// 懒加载模块
        { path: 'miningRight', loadChildren: '../mining-right/mining-right.module#MiningRightModule' },
        { path: 'systemConfig', loadChildren: '../system-config/system-config.module#SystemConfigModule' }
    ]
    },
    { path: '**', component: LoginComponent }
   
];

