import { LoginLogComponent } from '../system-config/login-log/login-log.component';
import { OperationLogComponent } from '../system-config/operation-log/operation-log.component';
import { RoleManagementComponent } from '../system-config/role-management/role-management.component';
import { ApiManageComponent } from '../system-config/api-manage/api-manage.component';
import { UserManagementComponent } from '../system-config/user-management/user-management.component';
import { MenuManagementComponent } from '../system-config/menu-management/menu-management.component';
import { MineralOwnerComponent } from '../system-config/mineral-owner/mineral-owner.component';


export const SystemConfigRoutes = [
    {
        path: 'loginLog',
        component: LoginLogComponent
    },
    {
        path: 'operationLog',
        component: OperationLogComponent
    },
    {
        path: 'mineralOwner',
        component: MineralOwnerComponent
    },
    {
        path: 'roleManage',
        component: RoleManagementComponent
    },
    {
        path: 'apiManage',
        component: ApiManageComponent
    },
    {
        path: 'userManage',
        component: UserManagementComponent
    },
    {
        path: 'menuManage',
        component: MenuManagementComponent
    }
  ]