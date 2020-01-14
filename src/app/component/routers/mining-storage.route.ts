import { DataImportExportComponent } from '../mining-storage/data-import-export/data-import-export.component';
import { DataAnalyzeComponent } from '../mining-storage/data-analyze/data-analyze.component';



export const MiningStorageRoutes = [
    {
        path: 'dataAnalyze',
        component: DataAnalyzeComponent
    },
    {
        path: 'dataImportExport',
        component: DataImportExportComponent
    }
]