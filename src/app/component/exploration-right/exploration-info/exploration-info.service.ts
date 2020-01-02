import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ExplorationInfoService {
    public explorationProject;//项目信息
    public reportCategory;//报告分类数据
    public mineralOwner;//矿权人信息
    private reportFileCommon = new Subject<any>();
    public  reportFileCommon$ = this.reportFileCommon.asObservable();// 触发矿权报告的方法
    private backCommon = new Subject<any>();
    public  backCommon$ = this.backCommon.asObservable();// 触发返回项目信息的方法
    private goDetailsCommon = new Subject<any>();
    public  goDetailsCommon$ = this.goDetailsCommon.asObservable();// 触发查看项目详情的方法
    private addAreaCommon = new Subject<any>();
    public  addAreaCommon$ = this.addAreaCommon.asObservable();// 触发新增项目区域
    constructor(){}
    getReportFile(value){
        this.reportFileCommon.next(value);
    }

    /* 矿权报告页面返回项目信息列表 */
    goBack(){
        this.backCommon.next();
    }

    goDetails(){
        this.goDetailsCommon.next()
    }




    getAddArea(value){
        this.addAreaCommon.next(value);
    }

}