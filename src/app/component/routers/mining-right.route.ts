import { MiningInfoComponent } from '../mining-right/mining-info/mining-info.component';
import { MiningFileComponent } from '../mining-right/mining-file/mining-file.component';

export const MiningRightRoutes = [
    {
        path: 'miningFile',
        component: MiningFileComponent
    },
    {
        path: 'miningInfo',
        component: MiningInfoComponent
    }
]