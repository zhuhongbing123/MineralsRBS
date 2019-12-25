import { Component, OnInit } from '@angular/core';
import { Openlayer } from '../../../common/map/openlayer';
import { Map2dService } from '../../../common/map/map2-d/map2-d.service';
import Map from 'ol/Map';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, DynamicDialogConfig } from 'primeng/api';
import * as ProjectionUtil from 'ol/proj';
import { FALSE } from 'ol/functions';
import { MineralManageService } from '../mineral-manage.service';
@Component({
  selector: 'app-project-map',
  templateUrl: './project-map.component.html',
  styleUrls: ['./project-map.component.css']
})
export class ProjectMapComponent implements OnInit {
  map: Map;
  OlFloorMap: Openlayer;
  drawShaps;//地图形状类型
  selectedDraw;//已选择的形状
  addAreaDisplay = false;//添加区域下拉框

  areaBackground = "#ff0044";//临时区域颜色
  areaOpacity = 1;//临时区域透明度
  areaDialogDisplay = false;//新增区域弹出框
  modifyAreaDisplay = false;//修改地图区域
  mineralAreaDisplay = false;
  mineralProject;//矿权项目数据
  addLocationArea = false;//新增项目区域
  constructor(private map2dService: Map2dService,
              private httpUtil: HttpUtil,
              private messageService: MessageService,
              public config: DynamicDialogConfig,
              private mineralManageService: MineralManageService) { 
    //接受地图画图区域后返回的值
      this.map2dService.areaLocationCommon$.subscribe(value=>{
        let coordinates = {
          'coordinates':value.points.toString(),
          'zoom': this.OlFloorMap.map.getView().getZoom(),
        }
        this.mineralProject.areaCoordinates = JSON.stringify(coordinates);
        this.addAreaDisplay = false;
        this.areaDialogDisplay = true;
    })
  }

  ngOnInit() {
    //this.initMap();
    this.drawShaps = [
      {code: 'Circle', name: '圆形'},
     /*  {code: 'Box', name: '矩形'}, */
      {code: 'Polygon', name: '多边形'}
    ];
    this.mineralProject = this.config.data.mineralProject;
    this.addLocationArea = this.config.data.addLocationArea;
    this.mineralProject.areaCoordinates = this.mineralProject.areaCoordinates.length>0?JSON.parse(this.mineralProject.areaCoordinates):this.mineralProject.areaCoordinates;
    
  }

  ngAfterViewInit(){
    this.OlFloorMap = new Openlayer(this.map2dService);
    this.OlFloorMap.mapDivId = 'projectMaps';
    this.OlFloorMap.initMap();
    
    setTimeout(() => {
      this.viewMap();
    }, 100);

    let that = this;
    this.OlFloorMap.map.on("moveend",function(e){
      let aa = that.OlFloorMap.map.getView().getZoom()
    })
  }

  viewMap(){
    this.OlFloorMap.clickIcon = false;
    this.removeLayer();
    //显示区域
    let area = [];
    let points = [];
    area.push(this.mineralProject)
    this.OlFloorMap.areaPoint(area);
    
    //定位区域
    if(this.mineralProject.areaCoordinates){
      
      let areaCoordinates = this.mineralProject.areaCoordinates.coordinates;
      let point = ProjectionUtil.toLonLat(areaCoordinates.split(',').map(Number));
      points.push(point[0]);
      points.push(point[1]);
      this.OlFloorMap.locatorCard(points,this.mineralProject.areaCoordinates.zoom);
      
    }
  }
   /* 保存地图区域 */
   saveArea(type?){
     if(this.addLocationArea){
       let areaCoordinates = {
          zoom:this.OlFloorMap.map.getView().getZoom(),
          coordinates:JSON.parse(this.mineralProject.areaCoordinates).coordinates
        }
        this.mineralManageService.getAddArea({
          "areaBackground": this.mineralProject.areaBackground,
          "areaCoordinates":JSON.stringify(areaCoordinates),
          "areaOpacity": this.mineralProject.areaOpacity.toString(),
        });
        this.modifyAreaDisplay = false;
        this.areaDialogDisplay = false;
        return;
     }
    if(type=='cancel'){
      if(!this.modifyAreaDisplay){

        //清除区域
        this.mineralProject.areaCoordinates = '';
        this.mineralProject.areaBackground = '';
        this.removeLayer();
        //显示区域
       /*  let area = [];
        area.push(this.mineralProject)
        this.OlFloorMap.areaPoint(area); */
      }
      this.modifyAreaDisplay = false;
      this.areaDialogDisplay = false;
      return;
    }
    let areaCoordinates;
    if(this.modifyAreaDisplay){
      areaCoordinates = {
        zoom:this.mineralProject.areaCoordinates.zoom,
        coordinates:this.mineralProject.areaCoordinates.coordinates.toString()
      }
    }else{
      areaCoordinates = {
        zoom:this.OlFloorMap.map.getView().getZoom(),
        coordinates:JSON.parse(this.mineralProject.areaCoordinates).coordinates
      }
    }
    
    let info ={
      "areaBackground": this.mineralProject.areaBackground,
      "areaCoordinates":JSON.stringify(areaCoordinates),
      "areaOpacity": this.mineralProject.areaOpacity.toString(),
      "projectId": this.mineralProject.id
    }
    this.httpUtil.post('mineral-project/coordinates',info).then(value=>{
      if (value.meta.code === 6666) {
          this.removeLayer();
          if(typeof(this.mineralProject.areaCoordinates)=='string'){
            this.mineralProject.areaCoordinates = JSON.parse(this.mineralProject.areaCoordinates)
          }
          //显示区域
          let area = [];
          area.push(this.mineralProject)
          this.OlFloorMap.areaPoint(area);
          this.areaDialogDisplay = false;
          this.modifyAreaDisplay = false;
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
      }
      
    })
  }
  /* 地图交互 */
  selectDraw(type){
    this.OlFloorMap.addPoint = true;
    this.OlFloorMap.addInteractions(this.selectedDraw.code,type)
    
  }
  /* 地图区域操作 */
  setArea(type){

    if(type=='modify'){
      this.areaDialogDisplay = true;
      this.modifyAreaDisplay = true;
      return;
    }
    if(type=='add'){
      this.addAreaDisplay = true;
      this.mineralProject.areaOpacity = '100';
      this.mineralProject.areaBackground = '#ff0044';
    }else{
      this.httpUtil.post('mineral-project/coordinates',{
        "areaBackground": "",
        "areaCoordinates": "",
        "projectId": this.mineralProject.id
      }).then(value=>{
        if (value.meta.code === 6666) {
          this.mineralProject.areaBackground = '';
          this.mineralProject.areaCoordinates = '';
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
        }
      })

      this.removeLayer();
    }
  }
  /* 清除地图所有图层 */
  removeLayer(){
    //this.OlFloorMap.map.getLayers().get
    let layer = this.OlFloorMap.vectorLayer;
    for(let i in layer){
      let aa = layer[i].getSource().featureChangeKeys_['29'];
      this.OlFloorMap.map.removeLayer(layer[i])
    }
  }

    
 
/* 放大地图 */
fullMap(type){
    
  if(type=='full'){
    document.getElementsByClassName('el-dialog')[0].className = 'dialog-class el-dialog';
    document.getElementById('main_content').style.height =  document.body.clientHeight*0.8+'px';
  }else{
    document.getElementsByClassName('el-dialog')[0].className = 'el-dialog';
    document.getElementById('main_content').style.height = '370px';
    
  }
  document.getElementById('main_content').style.width = (document.getElementsByClassName('el-dialog')[0]['offsetWidth']*0.98).toString()+"px";

 /*  setTimeout(() => {
    this.OlFloorMap.map.updateSize();
    
  }, 5000); */
  
}
}
