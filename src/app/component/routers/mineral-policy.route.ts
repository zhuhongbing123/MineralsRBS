import { PolicyFileComponent } from '../mineral-policy/policy-file/policy-file.component';
import { PolicyReportComponent } from '../mineral-policy/policy-report/policy-report.component';

export const MineralPolicyRoutes = [
    {
        path: 'policyFile',
        component: PolicyFileComponent
    },
    {
        path: 'policyReport',
        component: PolicyReportComponent
    }
]