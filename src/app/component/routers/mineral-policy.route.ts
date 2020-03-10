import { PolicyFileComponent } from '../mineral-policy/policy-file/policy-file.component';
import { PolicyReportComponent } from '../mineral-policy/policy-report/policy-report.component';
import { ViewFileComponent } from '../exploration-right/exploration-info/report-file/view-file/view-file.component';

export const MineralPolicyRoutes = [
    {
        path: 'policyFile',
        component: PolicyFileComponent
    },
    {
        path: 'policyReport',
        component: PolicyReportComponent
    },
    {
        path: 'viewFile',
        component: ViewFileComponent
    }
]