import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MineralManageService {
    private addAreaCommon = new Subject<any>();
    public  addAreaCommon$ = this.addAreaCommon.asObservable();// 触发新增项目区域


    getAddArea(value){
        this.addAreaCommon.next(value);
    }

}