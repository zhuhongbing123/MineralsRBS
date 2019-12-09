import {Injectable} from '@angular/core';

@Injectable()
export class AppConfig {

  public appMenuIcon: any[] = [
    'fa fa-share',
    'fa fa-pie-chart',
    'fa fa-th',
    'fa fa-folder',
    'fa fa-cog',
    'fa fa-heart',
    'fa fa-random',
    'fa-youtube-play',
    'fa fa-table',
    'fa fa-area-chart',
    'fa fa-bar-chart',
    'fa fa-adjust',
    'fa fa-cloud',
    'fa fa-picture-o',
    'fa fa-rss-square',
    'fa fa-send',
    'fa fa-share-alt',
    'fa fa-tag',
    'fa fa-user',
    'fa fa-wrench'
  ];
}
/* 矿权项目参数 */
export class ExplorationProject {

  "areaGeologicBackground": string;//区域地质背景
  "areaCoordinates":string;//矿权定位区域
  "areaBackground":string;//矿权定位区域背景色
  "areaOpacity":string;//矿权定位区域透明度
  "explorationArea": string;//探矿权范围
  "explorationStartTime": any;//探矿权首立时间
  "geophysicalGeochemical": string;//地球物理及地球化学特性
  "investigationFinalStage": string;//勘查阶段/成果报告  
  "majorAchievement": string;//主要成果
  "mineralBeltGeologic": string;//成矿地址背景
  "mineralBeltOwner": string;//成矿带归属
  "mineralCharacteristics": string;//矿(化)体特征
  "mineralGeologicalMagmatite": string;//矿区地质背景：岩浆岩  
  "mineralGeologicalStratum": string;//矿区地质背景：地层
  "mineralGeologicalStructure": string;//矿区地质背景：构造  
  "miningArea": string;//采矿权范围
  "miningStartTime":any;//采矿权首立时间
  "preliminaryUnderstanding": string;//初步认识
  "projectName": string; //项目名称
  "remarks": string; //存在的问题以及下一步工作
  "rockAlteration": string; //围岩及蚀变
  "id":number;//主键ID
}

/*  探矿权勘查阶段详情 */
export class ExplorationStage{
    "id": number;
    "projectId": number;//矿权项目ID，
    "ownerId": any;//矿权人ID
    "investigationStartTime": any;//开始时间
    "investigationEndTime": any;//结束时间
    "projectArea": string;//矿权范围
    "investigationOrganization": string;//勘查单位
    "investigationCategory": string;//类别  
    "investigationArea": number;//勘查面积
    "investigationMineralType": string;//勘查矿种
    "investigationStage": string;//勘查阶段
    "investigationWorkload": string;//勘查工作量
    "investigationInvestment": number;//勘查投入金额
}

/* 探矿权报告 */
export class ExplorationReport{
  "id": number;
  "projectId": number;//项目ID
  "reportCategoryId": any;//报告分类ID
  "reportTime": any;//报告日期
  "reportFilePath": string;//报告文件夹路径
  "reportDescription": string;//文件详情描述
  "reportUploader": string;//文件上传用户
  "creationTime": any;//报告上传日期
  "updateTime": any;//报告更新日期
}

/*  采矿权排查阶段详情 */
export class MiningStage{
  "id": number;
  "projectId": number;//矿权项目ID，
  "ownerId": any;//矿权人ID
  "miningStartTime": any;//开始时间
  "miningEndTime": any;//结束时间
  "projectArea": string;//矿权范围
  "miningMineralType": string;//开采矿种
  "miningProductionScale": string;//生产规模  
  "miningArea": number;//开采面积
  "miningWorkload": string;//开采投入工作量
  "miningInvestment": number;//开采投入金额
}
/* 采矿权年度监测报告 */
export class MiningMonitoring{
  "id": number;
  "projectId": number;//矿权项目ID
  "validationYear":any;//监测报告年份
  "resourceUsed":string;//年度动用资源量
  "resourceMaintained":string;//年末保有资源量
  "executionStatus":String;//执行情况
  "problemFound":string;//监测过程发现的其它问题
}
/* 地图的定位点标注 */
export class MapLocationLabel{
  "description": string; //描述
  "id": number;
  "poiCoordinates": string;//坐标
  "poiIcon": string;//定位图片
  "poiName": string;//名称
}
/* 地图的定位区域 */
export class MapLocationArea{
  "description": string; //描述
  "id": number;
  "areaCoordinates": string;//坐标
  "areaColor": "#ff0044";//区域颜色
  "areaName": string;//名称
  "areaOpacity": number;//区域透明度
}


export class Basic {
  option: string;//坐标点
}
