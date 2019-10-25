import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ExplorationInfoService {
    private reportFileCommon = new Subject<any>();
    public  reportFileCommon$ = this.reportFileCommon.asObservable();// 触发矿权报告的方法
    private backCommon = new Subject<any>();
    public  backCommon$ = this.backCommon.asObservable();// 触发返回项目信息的方法

    constructor(){}
    getReportFile(value){
        this.reportFileCommon.next(value);
    }

    /* 矿权报告页面返回项目信息列表 */
    goBack(){
        this.backCommon.next();
    }
}