import { MiningInfoComponent } from '../mining-right/mining-info/mining-info.component';
import { MiningFileComponent } from '../mining-right/mining-file/mining-file.component';
import { MiningDetailsComponent } from '../mining-right/mining-info/mining-details/mining-details.component';



export const MiningRightRoutes = [
    {
        path: 'miningFile',
        component: MiningFileComponent
    },
    {
        path: 'miningInfo',
        component: MiningInfoComponent
    },
    {
        path: 'miningDetails',
        component: MiningDetailsComponent
    }
]