import { PowerMonitoringComponent } from '../remote-monitoring/power-monitoring/power-monitoring.component';
import { CameraMonitoringComponent } from '../remote-monitoring/camera-monitoring/camera-monitoring.component';
import { EnvironmentMonitoringComponent } from '../remote-monitoring/environment-monitoring/environment-monitoring.component';
import { DisasterMonitoringComponent } from '../remote-monitoring/disaster-monitoring/disaster-monitoring.component';



export const RemoteMonitoringRoutes = [
    {
        path: 'powerMonitoring',
        component: PowerMonitoringComponent
    },
    {
        path: 'cameraMonitoring',
        component: CameraMonitoringComponent
    },
    {
        path: 'environmentMonitoring',
        component: EnvironmentMonitoringComponent
    },
    {
        path: 'disasterMonitoring',
        component: DisasterMonitoringComponent
    }
]