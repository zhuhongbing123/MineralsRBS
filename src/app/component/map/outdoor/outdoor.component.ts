import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Openlayer } from '../../../common/map/openlayer';
import { Map2DComponent } from '../../../common/map/map2-d/map2-d.component';
import { FALSE } from 'ol/functions';
import { HttpUtil } from '../../../common/util/http-util';
import { MapLocationLabel,MapLocationArea } from '../../../common/util/app-config';
import * as ProjectionUtil from 'ol/proj';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LocationIcon } from '../../../common/util/default-common';
import { LoginService } from 'src/app/component/login/login.service';
import { transform,transformWithProjections,ProjectionLike} from 'ol/proj';
import { toStringHDMS, toStringXY, createStringXY } from 'ol/coordinate';
@Component({
  selector: 'app-outdoor',
  templateUrl: './outdoor.component.html',
  styleUrls: ['./outdoor.component.scss']
})
export class OutdoorComponent implements OnInit {
  @ViewChildren ('2dMap') twoMap: QueryList<Map2DComponent>
  LIMIT_LOGIN = 10;//;
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数

  drawShaps;//地图形状类型
  selectedDraw;//已选择的形状
  mapDrawDisplay = false;//地图画图选项是否显示
  locationIconDisplay = false;//标记图标显示
  locationIcon;//标记的图标
  selectedIcon = {name:'icon1',flag:'./assets/img/location_icon/icon1.jpg'};//已选择的图标
  selectIconDisplay = false;//选择图片弹出框显示
  locationLabelTitle;//定位图标表格标题
  locationLabelValue;//定位图标表格内容
  labelTotal;//定位图标总数
  locationPointCoordinate;//定位图标坐标
  labelInfoDisplay = false;//图标信息弹出框
  mapLocationLabel: MapLocationLabel = new MapLocationLabel();//图标信息数据初始化
  modifyLabel = false;//是否修改图标信息

  areaLocationTitle;//区域定位列表标题
  areaLocationValue;//区域定位列表数据
  areaInfoDisplay =false;//区域信息弹出框显示
  mapLocationArea: MapLocationArea = new MapLocationArea();//区域信息初始化
  areaCoordinate;//区域坐标
  modifyArea = false;//是否修改区域
  areaTotal;//区域列表总数


  locationMineralDisplay=false;//项目列表是否显示
  mineralLocationTitle;//项目定位列表标题
  mineralLocationValue;//项目定位列表数据
  mineralTotal;//项目总数
  dropdownDisplay = false;//显示选择图形下拉框
  mineralInfoDisplay = false;//项目区域信息弹出框
  projectName;//项目名称
  projectColor = "#ff0044";//项目背景色
  areaOpacity = 1;//区域透明度
  projectInfo;//项目信息
  mineralOwner:any[];//矿权人
  modifyMineral = false;//是否修改项目

  projectDisplay = false;//项目定位按钮显示
  areaDisplay = false;//区域标注按钮显示
  poiDisplay = false;//地点标注按钮显示
  addProjectAreaDisplay = false;//新增项目区域按钮
  addAreaDisplay = false;//新增区域标注下拉框
  modifyAreaDisplay = false;//修改区域标注按钮
  deleteAreaDisplay = false;//删除区域标注按钮
  addPoiDisplay = false;//新增地点标注按钮
  modifyPoiDisplay = false;//修改地点标注按钮
  deletePoiDisplay = false;//删除地点标注按钮
  mapDisplay = false;//地图图标、标注是否显示


  constructor(private httpUtil: HttpUtil,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.setTableValue();

    
  }
  ngAfterViewInit(){

    
  }

   //初始化表格
   public setTableValue(){
    this.drawShaps = [
      {code: 'Circle', name: '圆形'},
     /*  {code: 'Box', name: '矩形'}, */
      {code: 'Polygon', name: '多边形'}
    ];
    this.locationIcon = LocationIcon.icon;
    this.locationLabelTitle = [
      { field: 'poiName', header: '标注名称' },
/*       { field: 'poiIcon', header: '图片' }, */
      { field: 'description', header: '描述' }
    ];
    this.areaLocationTitle = [
      { field: 'areaName', header: '区域名称' },
      { field: 'description', header: '描述' }
    ];
    this.mineralLocationTitle = [
      { field: 'projectName', header: '项目名称' },
      { field: 'owner_id', header: '矿权人' }
    ];
    //获取授权的API资源
    if(!sessionStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(sessionStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/mineral-project/list/*/*' && element.method =='GET'){
        this.projectDisplay =true;
      }
      if(element.uri ==='/mineral-area/list/*/*' && element.method =='GET'){
        this.areaDisplay =true;
    }
      if(element.uri ==='/mineral-poi/list/*/*' && element.method =='GET'){
        this.poiDisplay =true;
      }
      if(element.uri ==='/mineral-project/coordinate' && element.method =='POST'){
        this.addProjectAreaDisplay =true;
      }
      if(element.uri ==='/mineral-area' && element.method =='POST'){
        this.addAreaDisplay =true;
      }
      if(element.uri ==='/mineral-area' && element.method =='PUT'){
        this.modifyAreaDisplay =true;
      }
      if(element.uri ==='/mineral-area/*' && element.method =='DELETE'){
        this.deleteAreaDisplay =true;
      }
      if(element.uri ==='/mineral-poi' && element.method =='POST'){
        this.addPoiDisplay =true;
      }
      if(element.uri ==='/mineral-poi' && element.method =='PUT'){
        this.modifyPoiDisplay =true;
      }
      if(element.uri ==='/mineral-poi/*' && element.method =='DELETE'){
        this.deletePoiDisplay=true;
      }
      
      if(element.uri ==='/mineral-poi/all' && element.method =='GET'){
        this.mapDisplay =true;
      }
      if(element.uri ==='/mineral-area/all' && element.method =='GET'){
        this.mapDisplay =true;
      }
      if(element.uri ==='/mineral-project/all' && element.method =='GET'){
        this.mapDisplay =true;
      }
     
    
    });


    if(this.projectDisplay){
      this.locationMineralDisplay = true;
    }

    if(!this.mapDisplay){
      return;
    }
    
    this.getMapLocationLabelAll();
    this.getMapLocationAreaAll();
    this.getMineralOwner();
    //this.getMieralLocation();
   }
  /* 获取所有地图点位标注 */
  getMapLocationLabelAll(){
    this.httpUtil.get('mineral-poi/all').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralPois;
        
        this.twoMap.forEach(outdoorMap=>{
          outdoorMap.initializeLabel(data);
          outdoorMap.oldIconValue.push(data);
        })
      }
      
    })
  }
  /* 获取所有地图区域标注 */
  getMapLocationAreaAll(){
    this.httpUtil.get('mineral-area/all').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralAreas;
        
        this.twoMap.forEach(outdoorMap=>{
          for(let i in data){
            if(data[i].areaCoordinates){
              data[i].areaCoordinates = JSON.parse(data[i].areaCoordinates);
            }
          }
          outdoorMap.initializeArea(data);
          outdoorMap.oldAreaValue.push(data);
        })
      }
      
    }).then(()=>{
      this.getMieralLocation()
    })
  }

  /* 获取所有项目区域列表 */
  getMieralLocation(){
    this.httpUtil.get('mineral-project/all').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralProjects;
        for(let i in data){
          if(data[i].areaCoordinates){
            data[i].areaCoordinates = JSON.parse(data[i].areaCoordinates);
          }
        }
        this.twoMap.forEach(outdoorMap=>{
          
          outdoorMap.initializeArea(data);
          outdoorMap.oldAreaValue.push(data);
        })
      }
      
    })
  }

  /* 获取地图点位标注 */
  getMapLocationLabel(){
    this.httpUtil.get('mineral-poi/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data= value.data.mineralPois.list;
        this.labelTotal = value.data.mineralPois.total;
        for(let i in data){
            data[i].poiCoordinates = data[i].poiCoordinates
        }
        this.locationLabelValue = data;
      }
    })
  }
  /* 获取地图区域定位 */
  getMapLocationArea(){
    this.httpUtil.get('mineral-area/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data= value.data.mineralAreas.list;
        this.areaTotal = value.data.mineralAreas.total;
        /* for(let i in data){
          data[i].areaCoordinates = ProjectionUtil.toLonLat(data[i].areaCoordinates.split(',').map(Number))
        } */
        
        this.areaLocationValue = data;
      }
    })
  }

  /* 获取矿权项目定位 */
  getMineralLocation(){
    this.httpUtil.get('mineral-project/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data= value.data.mineralProjects.list;
        this.mineralTotal = value.data.mineralProjects.total;
        for(let i in data){
          /* data[i].explorationStartTime =  data[i].explorationStartTime?new Date(data[i].explorationStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          data[i].miningStartTime =  data[i].miningStartTime?new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-"):''; */
          for(let j in this.mineralOwner){
            if(data[i].ownerId == this.mineralOwner[j].id){
              data[i]['owner_id']  = this.mineralOwner[j].ownerName;
            }
          }
          if(data[i].areaCoordinates){
            data[i].areaCoordinates = JSON.parse(data[i].areaCoordinates);
          }
        }
        this.mineralLocationValue = data;
      }
    })
  }

  /*  获取矿权人*/
  getMineralOwner(){
    this.httpUtil.get('mineral-owner/list/1/10000').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralOwners.list;
        for(let i in data){
          data[i]['label'] = data[i].ownerName;
          data[i]['value'] = data[i].id;
        }
        this.mineralOwner = data;
        this.getMineralLocation();
      }
    })
  }
  /* 地图交互选择是否显示 */
  mapInteraction(){
    this.getMapLocationArea();
    this.selectedDraw = '';
    this.mapDrawDisplay = !this.mapDrawDisplay;
    this.locationIconDisplay = false;
    this.locationMineralDisplay = false;
    this.dropdownDisplay = false;
    this.twoMap.forEach(outdoorMap=>{
      outdoorMap.removeInteraction();
    })
  }
  /* 定位标记 */
  signPoint(type?){
    this.getMapLocationLabel();
    this.mapDrawDisplay = false;
    this.selectIconDisplay = false;
    this.locationMineralDisplay = false;
    this.dropdownDisplay = false;
    this.twoMap.forEach(outdoorMap=>{
      outdoorMap.removeInteraction();
    })
    if(type){
      this.locationIconDisplay = !this.locationIconDisplay;
      this.selectedIcon = {name:'icon1',flag:'./assets/img/location_icon/icon1.jpg'};
      return;
    }
    
    let that = this;
    let icon = this.selectedIcon.flag;
    this.twoMap.forEach(outdoorMap=>{
      outdoorMap.removeInteraction();
      outdoorMap.signPoint(icon);
    })
    
  }

  /* 打开新增图标弹出框 */
  openSignPoint(){
    this.selectIconDisplay = true;
    this.selectedIcon = {name:'icon1',flag:'./assets/img/location_icon/icon1.jpg'};
  }

  /* 打开项目列表 */
  openMineral(){
    this.locationMineralDisplay = true;
    this.mapDrawDisplay = false;
    this.locationIconDisplay = false;
    this.getMineralLocation();
  }

  /* 取消画图 */
  cancelDraw(){
    this.dropdownDisplay = false;
    this.twoMap.forEach(outdoorMap=>{
      outdoorMap.removeInteraction();
    })
  }

  /* 地图交互 */
  selectDraw(type){
    this.areaOpacity = 0;
    this.twoMap.forEach(outdoorMap=>{
      outdoorMap.addInteractions(this.selectedDraw.code,type);
      this.mapDrawDisplay = false;
    })
  }
  /* 定位 */
  locatorCard(point,zoom,value,type?){
    /* this.locationIconDisplay = false;
    this.mapDrawDisplay = false; */
    let area = [value]
    point= point.split(',').map(Number);
    this.twoMap.forEach(outdoorMap=>{
      outdoorMap.removeInteraction();
      outdoorMap.removeLayer();//清除所有区域
      if(type){
        outdoorMap.initializeLabel(area);//只显示定位点位
      }else{
        outdoorMap.initializeArea(area);//只显示定位区域
      }
      
      outdoorMap.locatorCard(point,zoom);
  
    })
  }

  /* 对右侧菜单列表的操作 */
  setMineralMap(type,value?){
    /* 定位图标 */
    if(type ==='locationLabel'){
      this.locatorCard(value.poiCoordinates,6,value,'locationLabel');
      return;
    }
    /* 定位区域 */
    if(type ==='locationArea'){
      let point = [];
      value.areaCoordinates = JSON.parse(value.areaCoordinates);
      let areaCoordinates = ProjectionUtil.toLonLat(value.areaCoordinates.coordinates.split(',').map(Number));
      point.push(areaCoordinates[0]);
      point.push(areaCoordinates[1]);
      this.locatorCard(point.toString(),value.areaCoordinates.zoom,value);
      return;
    }
    /* 图标修改 */
    if(type === 'modifyLabel'){
      this.modifyLabel = true;
      this.mapLocationLabel = new MapLocationLabel();
      this.mapLocationLabel = JSON.parse(JSON.stringify(value));
      this.labelInfoDisplay = true;
      return;
    }
    /* 区域修改 */
    if(type === 'modifyArea'){
      this.mapLocationArea = new MapLocationArea();
      this.mapLocationArea = JSON.parse(JSON.stringify(value));
      this.areaOpacity = value.areaOpacity/100;
      this.areaInfoDisplay = true;
      this.modifyArea = true;
      return;
    }
    /* 图标删除 */
    if(type==='deleteLabel'){
      this.confirmationService.confirm({
        message: '确认删除该图标('+value.poiName+')吗?',
        header: '删除图标',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-poi/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.twoMap.forEach(outdoorMap=>{
                outdoorMap.removeLayer();
              })
              this.getMapLocationLabelAll();
              this.getMapLocationAreaAll();
              this.getMapLocationLabel();
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
            }
          })
        },
        reject: () => {
        
        }
      });
        return;
    }

    /* 区域删除 */
    if(type==='deleteArea'){
      this.confirmationService.confirm({
        message: '确认删除该区域('+value.areaName+')吗?',
        header: '删除区域',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-area/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.twoMap.forEach(outdoorMap=>{
                outdoorMap.removeLayer();
              })
              this.getMapLocationArea();
              this.getMapLocationAreaAll();
              this.getMapLocationLabelAll();
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
            }
          })
        },
        reject: () => {
        
        }
      });
        return;
    }

    /*新增项目区域 */
    if(type=='addMineral'){
      this.dropdownDisplay = true;
      this.projectName = value.projectName;
      this.projectInfo = value;
      return;
    }
    /* 定位项目区域 */
    if(type=='locationMineral'){
      let point = [];
      //let coordinates = value.areaCoordinates.length>0?value.areaCoordinates:JSON.parse(value.areaCoordinates).coordinates;
      //let zoom = 
      let areaCoordinates = ProjectionUtil.toLonLat(value.areaCoordinates.coordinates.split(',').map(Number));
      point.push(areaCoordinates[0]);
      point.push(areaCoordinates[1]);
      let aa = ProjectionUtil.transform(point, 'EPSG:4326', 'EPSG:3857');
      let bb = toStringHDMS(point);
      this.locatorCard(point.toString(),value.areaCoordinates.zoom,value);
      return;
    } 
    /* 修改项目区域 */
    if(type=='modifyMineral'){
      this.projectName = value.projectName;
      this.projectColor = value.areaBackground;
      this.areaOpacity = value.areaOpacity/100;
      this.mineralInfoDisplay = true;
      this.projectInfo = value;
      this.modifyMineral = true;
    }
     /* 项目区域删除 */
     if(type==='deleteMineral'){
      this.confirmationService.confirm({
        message: '确认删除该区域('+value.projectName+')吗?',
        header: '删除区域',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.post('mineral-project/coordinates',{
            "areaBackground": "",
            "areaCoordinates": "",
            "projectId": value.id
          }).then(value=>{
            if (value.meta.code === 6666) {
              this.twoMap.forEach(outdoorMap=>{
                outdoorMap.removeLayer();
              })
              this.getMineralLocation();
              this.getMapLocationAreaAll();
              this.getMapLocationLabelAll();
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
            }
          })
        },
        reject: () => {
        
        }
      });
        return;
    }
  }

  /* 保存定位图标信息 */
  saveLocationPoint(type){
    if(type=='cancel'){
      this.labelInfoDisplay = false;
      if(!this.modifyLabel){
        this.twoMap.forEach(outdoorMap=>{
          outdoorMap.removeTemporary();
        })
      }
      return;
    }
    if(this.modifyLabel){
      this.mapLocationLabel.poiCoordinates = this.mapLocationLabel.poiCoordinates.toString();
      this.httpUtil.put('mineral-poi',this.mapLocationLabel).then(value=>{
        if (value.meta.code === 6666) {
            this.twoMap.forEach(outdoorMap=>{
              outdoorMap.removeLayer();
            })
            this.getMapLocationLabel();
            this.getMapLocationLabelAll();
            this.getMapLocationAreaAll();
            this.getMieralLocation();
            this.labelInfoDisplay = false;
        }
      })
    }else{
      let info = {
        "description": this.mapLocationLabel.description,
        "poiCoordinates": ProjectionUtil.toLonLat(this.locationPointCoordinate).toString(),
        "poiIcon": this.selectedIcon.flag,
        "poiName": this.mapLocationLabel.poiName
      }
      this.httpUtil.post('mineral-poi',info).then(value=>{
        if (value.meta.code === 6666) {
            this.twoMap.forEach(outdoorMap=>{
              outdoorMap.removeLayer();
            })
            this.getMapLocationLabelAll();
            this.getMapLocationAreaAll();
            this.getMapLocationLabel();
            this.getMieralLocation();
            this.labelInfoDisplay = false;
        }
      })
    }
    
  }

  /* 保存区域信息 */
  saveLocationArea(type){
    if(type=='cancel'){
      this.areaInfoDisplay = false;
      if(!this.modifyArea){
        this.twoMap.forEach(outdoorMap=>{
          outdoorMap.removeTemporary();
        })
      }
      return;
    }
    
    if(this.modifyArea){
      this.modifyArea = false;
      let areaCoordinates = {
        zoom: JSON.parse(this.mapLocationArea.areaCoordinates).zoom,
        coordinates:JSON.parse(this.mapLocationArea.areaCoordinates).coordinates
      }
      this.mapLocationArea.areaCoordinates = JSON.stringify(areaCoordinates);
      this.mapLocationArea.areaOpacity = this.areaOpacity*100;
      this.httpUtil.put('mineral-area',this.mapLocationArea).then(value=>{
        if (value.meta.code === 6666) {
            this.areaInfoDisplay = false;
            this.twoMap.forEach(outdoorMap=>{
              outdoorMap.removeLayer();
            })
            this.getMapLocationArea();
            this.getMapLocationAreaAll();
            this.getMapLocationLabelAll();
            this.getMieralLocation();
            this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
        }
        
      })
    }else{
      let zoom;
      this.twoMap.forEach(outdoorMap=>{
        zoom = outdoorMap.zoom;
      })
      let areaCoordinates = {
        zoom:zoom,
        coordinates:this.areaCoordinate.toString()
      }
      let info ={
        "areaColor": this.mapLocationArea.areaColor,
        "areaCoordinates": JSON.stringify(areaCoordinates),
        "areaName": this.mapLocationArea.areaName,
        "description": this.mapLocationArea.description,
        "areaOpacity": this.areaOpacity*100
      }
      this.httpUtil.post('mineral-area',info).then(value=>{
        if (value.meta.code === 6666) {
            this.areaInfoDisplay = false;
            this.twoMap.forEach(outdoorMap=>{
              outdoorMap.removeLayer();
            })
            this.getMapLocationArea();
            this.getMapLocationAreaAll();
            this.getMapLocationLabelAll();
            this.getMieralLocation();
            this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
        }
        
      })
    }
    
  }

  /* 更新项目区域信息 */
  saveLocationMineral(type){
    if(type=='cancel'){
      this.mineralInfoDisplay = false;
      this.selectedDraw = '';
      this.twoMap.forEach(outdoorMap=>{
        outdoorMap.removeTemporary();
      })
      return;
    }
    let info;
    if(this.modifyMineral){
      this.modifyMineral = false;
      let areaCoordinates = {
        zoom:this.projectInfo.areaCoordinates.zoom,
        coordinates:this.projectInfo.areaCoordinates.coordinates.toString()
      }
       info={
        "areaBackground": this.projectColor,
        "projectId": this.projectInfo.id,
        "areaCoordinates": JSON.stringify(areaCoordinates),
        "areaOpacity": this.areaOpacity*100
      }
    }else{
      let zoom;
      this.twoMap.forEach(outdoorMap=>{
        zoom = outdoorMap.zoom;
      })
      let areaCoordinates = {
        zoom:zoom,
        coordinates:this.areaCoordinate.toString(),
      }
      info={
        "areaBackground": this.projectColor,
        "areaCoordinates": JSON.stringify(areaCoordinates),
        "projectId": this.projectInfo.id,
        "areaOpacity": this.areaOpacity*100
      }
    }
     
    this.httpUtil.post('mineral-project/coordinates',info).then(value=>{
      if (value.meta.code === 6666) {
        this.mineralInfoDisplay = false;
        this.twoMap.forEach(outdoorMap=>{
          outdoorMap.removeLayer();
        })
        this.getMapLocationLabelAll();
        this.getMapLocationAreaAll();
        this.getMineralLocation();
        this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
      }
    })
  }

  /* 切换页码 */
  pageChange(event,type){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    if(type=='area'){
      this.getMapLocationArea();
    }else if(type=='label'){
      this.getMapLocationLabel();
    }else{
      this.getMineralLocation();
    }
  }
}
