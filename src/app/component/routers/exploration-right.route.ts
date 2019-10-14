
import { ExplorationFileComponent } from '../exploration-right/exploration-file/exploration-file.component';
import { ExplorationInfoComponent } from 'src/app/component/exploration-right/exploration-info/exploration-info.component';


export const ExplorationRightRoutes = [
    {
        path: 'explorationFile',
        component: ExplorationFileComponent
    },
    {
        path: 'explorationInfo',
        component: ExplorationInfoComponent
    }
  ]