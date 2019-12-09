import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class Map2dService {
    private areaLocationCommon = new Subject<any>();
    public  areaLocationCommon$ = this.areaLocationCommon.asObservable();// 触发2D地图画图方法，给其他页面传值坐标

    //调用2D地图画区域的方法
    areaLocation(value){
        this.areaLocationCommon.next(value)
    }
}