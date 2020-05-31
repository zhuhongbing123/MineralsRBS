import { DataAnalyzeComponent } from '../green-mining/data-analyze/data-analyze.component';
import { DataImportExportComponent } from '../green-mining/data-import-export/data-import-export.component';
import { MiningStatisticsComponent } from '../green-mining/mining-statistics/mining-statistics.component';



export const GreenMiningRoutes = [
    {
        path: 'dataAnalyze',
        component: DataAnalyzeComponent
    },
    {
        path: 'dataImportExport',
        component: DataImportExportComponent
    },
    {
        path: 'miningStatistics',
        component: MiningStatisticsComponent
    }
]