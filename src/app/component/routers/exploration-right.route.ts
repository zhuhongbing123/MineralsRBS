
import { ExplorationFileComponent } from '../exploration-right/exploration-file/exploration-file.component';
import { ExplorationInfoComponent } from 'src/app/component/exploration-right/exploration-info/exploration-info.component';
import { ReportFileComponent } from '../exploration-right/exploration-info/report-file/report-file.component';
import { ExplorationDetailsComponent } from '../exploration-right/exploration-info/exploration-details/exploration-details.component';


export const ExplorationRightRoutes = [
    {
        path: 'explorationFile',
        component: ExplorationFileComponent
    },
    {
        path: 'explorationInfo',
        component: ExplorationInfoComponent
    },
    {
        path: 'explorationDetails',
        component: ExplorationDetailsComponent
    },
    {
        path: 'reportFile',
        component: ReportFileComponent
    }
  ]