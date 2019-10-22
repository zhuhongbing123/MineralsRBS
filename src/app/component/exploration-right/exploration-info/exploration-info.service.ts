import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ExplorationInfoService {
    private reportFileCommon = new Subject<any>();
    public  reportFileCommon$ = this.reportFileCommon.asObservable();// 触发平面视图的方法


    constructor(){}
    getReportFile(value){
        this.reportFileCommon.next(value);
    }

}