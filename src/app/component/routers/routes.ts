import {Routes} from '@angular/router';
import { LoginGuard } from '../../common/loginguard';
import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from '../login/login.component';
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
    path: 'layout',
    component: LayoutComponent,  // 页面内容入口
    canActivate: [LoginGuard],
    children: [
        { path: '', redirectTo: 'explorationRight', pathMatch: 'full' },
        { path: 'mineralPolicy', loadChildren: '../mineral-policy/mineral-policy.module#MineralPolicyModule' },
        { path: 'explorationRight', loadChildren: '../exploration-right/exploration-right.module#ExplorationRightModule' },// 懒加载模块
        { path: 'miningRight', loadChildren: '../mining-right/mining-right.module#MiningRightModule' },
        { path: 'mineralManage', loadChildren: '../mineral-manage/mineral-manage.module#MineralManageModule' },
        { path: 'mapManage', loadChildren: '../map/map.module#MapModule' },
        { path: 'systemConfig', loadChildren: '../system-config/system-config.module#SystemConfigModule' },
        { path: 'greenMining', loadChildren: '../green-mining/green-mining.module#GreenMiningModule' },
        { path: 'remoteMonitoring', loadChildren: '../remote-monitoring/remote-monitoring.module#RemoteMonitoringModule' },
        { path: 'miningStorage', loadChildren: '../mining-storage/mining-storage.module#MiningStorageModule' },
        
    ]
    },
    { path: '**', component: LoginComponent }
   
];

