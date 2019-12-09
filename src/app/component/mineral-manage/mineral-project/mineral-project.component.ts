import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService, DialogService } from 'primeng/api';
import { ExplorationProject } from '../../../common/util/app-config';
import { LoginService } from '../../login/login.service';
import { Openlayer } from '../../../common/map/openlayer';
import { Map2dService } from '../../../common/map/map2-d/map2-d.service';
import * as ProjectionUtil from 'ol/proj';
import { ProjectMapComponent } from '../project-map/project-map.component';


@Component({
  selector: 'app-mineral-project',
  templateUrl: './mineral-project.component.html',
  styleUrls: ['./mineral-project.component.scss']
})
export class MineralProjectComponent implements OnInit {
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数

  projectTotal;//矿权项目列表总数
  mineralProjectTitle;//矿权项目列表标题
  mineralProjectValue;//矿权项目列表数据
  mineralProjectDisplay = false;//矿权项目弹出框
  mineralAreaDisplay = false;//矿权项目区域弹出框
  explorationStartTime;//探矿权首立时间
  miningStartTime;//采矿权首立时间
  mineralProject: ExplorationProject = new ExplorationProject();//矿权项目数据初始化
  isModify = false;//是否修改项目
  addDisplay = false;//添加按钮显示
  modifDisplay = false;//修改按钮显示
  deleteDisplay = false;//删除按钮显示
  searchDisplay = false;//查询按钮显示

  filteredProjectName;//项目名称
  filteredProject:any[];//搜索项目时下拉框的项目名称
  allProjectName;//所有项目名称
  isClickSearch = false;//是否点击查询按钮
  loading: boolean;//列表加载动画显示
  ownerName;//矿权人名称

  OlFloorMap: Openlayer;
  drawShaps;//地图形状类型
  selectedDraw;//已选择的形状
  addAreaDisplay = false;//添加区域下拉框

  areaBackground = "#ff0044";//临时区域颜色
  areaOpacity = 1;//临时区域透明度
  areaDialogDisplay = false;//新增区域弹出框
  modifyAreaDisplay = false;//修改地图区域

  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private loginService: LoginService,
              private map2dService: Map2dService,
              public dialogService: DialogService) {
                //接受地图画图区域后返回的值
                this.map2dService.areaLocationCommon$.subscribe(value=>{
                  this.mineralProject.areaCoordinates = value.points.toString();
                  this.addAreaDisplay = false;
                  this.areaDialogDisplay = true;
                })
               }

  ngOnInit() {
    this.setTableValue();
    this.getProjectName();
  }
  ngAfterViewInit(){
    this.OlFloorMap = new Openlayer(this.map2dService);
    this.OlFloorMap.mapDivId = 'projectMap';
    this.OlFloorMap.fullMap = false;
    this.OlFloorMap.initMap();
    let that = this;
    window.onresize = function(){
      if(document.getElementById('main_content')){
        //document.getElementById('main_content').style.width = document.getElementById('layout-main').offsetWidth+"px";
        /* that.removeLayer();
        for(let i in that.oldIconValue){
          that.initializeLabel(that.oldIconValue[i]);
        }
        
        for(let i in that.oldAreaValue){
          that.initializeArea(that.oldAreaValue[i])
        } */
        
        }
    }
    //this.OlFloorMap.initMap();
  }
  //初始化表格
  public setTableValue(){
    
    this.mineralProjectTitle=[
      { field: 'projectName', header: '项目名称' },
      { field: 'owner_id', header: '矿权人' },
      { field: 'explorationStartTime', header: '探矿权首立时间' },
      { field: 'miningStartTime', header: '采矿权首立时间' },
      { field: 'explorationArea', header: '探矿权范围' },
      { field: 'miningArea', header: '采矿权范围' },
      { field: 'operation', header: '操作' }
    ];
    this.drawShaps = [
      {code: 'Circle', name: '圆形'},
     /*  {code: 'Box', name: '矩形'}, */
      {code: 'Polygon', name: '多边形'}
    ];
    this.loading = true;
    //获取授权的API资源
    if(!localStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
    }
    //获取授权的API资源
    JSON.parse(localStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/mineral-project' && element.method =='POST'){
        this.addDisplay =true;
      }
      if(element.uri ==='/mineral-project' && element.method =='PUT'){
        this.modifDisplay =true;
    }
      if(element.uri ==='/mineral-project/*' && element.method =='DELETE'){
        this.deleteDisplay =true;
      }
      if(element.uri ==='/mineral-project/search/*/*' && element.method =='POST'){
        this.searchDisplay =true;
      }
    
    });

    if(!this.deleteDisplay){
      this.mineralProjectTitle.splice(this.mineralProjectTitle.length-1,1)
    }
    this.getExplorationInfo()
  }

  /* 获取矿权项目数据 */
  getExplorationInfo(){
    this.httpUtil.get('mineral-project/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i in data){
          data[i].explorationStartTime =  data[i].explorationStartTime?new Date(data[i].explorationStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          data[i].miningStartTime =  data[i].miningStartTime?new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          if(data[i].lastestProjectOwner){
            data[i]['owner_id']= data[i].lastestProjectOwner.ownerName;
          }
        }
        
        this.mineralProjectValue = data;
        this.loading = false;
      }
    }); 
  }

  /* 获取项目名称 */
  getProjectName(){
    this.httpUtil.get('mineral-project/name/0').then(value=>{
      if (value.meta.code === 6666) {
        this.allProjectName = value.data.projectNames;
      }
    })
  }

  /* 根据项目名称搜索 */
  getFilteredProject(){
    this.httpUtil.post('mineral-project/search/'+this.startPage+'/'+this.limit,{
      "projectName": this.filteredProjectName? this.filteredProjectName:'',
      "ownerName": this.ownerName?this.ownerName:'',
      "projectType": 0
    }).then(value=>{
      if (value.meta.code === 6666) {
        this.isClickSearch = true;
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i in data){
          data[i].explorationStartTime =  data[i].explorationStartTime?new Date(data[i].explorationStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          data[i].miningStartTime =  data[i].miningStartTime?new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          if(data[i].lastestProjectOwner){
            data[i]['owner_id']= data[i].lastestProjectOwner.ownerName;
          }
        }
        
        this.mineralProjectValue = data;
      }
    })
  }
  /* 操作 */
  setMineral(type,value?){
    this.isModify = false;
    if(type=='modify'){
      this.explorationStartTime = value.explorationStartTime!==0?new Date(value.explorationStartTime):'';
      this.miningStartTime = value.miningStartTime!==0?new Date(value.miningStartTime):'';
      this.mineralProject = value;
      this.mineralProjectDisplay = true;
      this.isModify = true;

      return;
    }
    // 搜索
    if(type=='filtered'){
      this.getFilteredProject();
      return;
    }
    if(type=='add'){
      this.mineralProject = new ExplorationProject();
      this.miningStartTime = '';
      this.explorationStartTime = '';
      this.mineralProjectDisplay = true;
    }else{
      this.confirmationService.confirm({
        message: '确认删除该项目('+value.projectName+')吗?',
        header: '删除项目',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-project/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.getExplorationInfo();
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
            }
          })
        },
        reject: () => {
        
        }
      });
    }
  }

  /* 保存项目 */
  saveMineralProject(){
    if(!this.mineralProject.projectName){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '项目名称不能为空'});
      return;
    }
    this.mineralProject.explorationStartTime = this.explorationStartTime?this.explorationStartTime.getTime()/1000:0;
    this.mineralProject.miningStartTime = this.miningStartTime?this.miningStartTime.getTime()/1000:0;
    /* let projectInfo = {
      "areaGeologicBackground": this.mineralProject.areaGeologicBackground,
      "explorationArea": this.mineralProject.explorationArea,
      "explorationStartTime": this.explorationStartTime?this.explorationStartTime.getTime()/1000:0,
      "geophysicalGeochemical": this.mineralProject.geophysicalGeochemical,
      "investigationFinalStage": this.mineralProject.investigationFinalStage,
      "majorAchievement": this.mineralProject.majorAchievement,
      "mineralBeltGeologic": this.mineralProject.mineralBeltGeologic,
      "mineralBeltOwner": this.mineralProject.mineralBeltOwner,
      "mineralCharacteristics": this.mineralProject.mineralCharacteristics,
      "mineralGeologicalMagmatite": this.mineralProject.mineralGeologicalMagmatite,
      "mineralGeologicalStratum": this.mineralProject.mineralGeologicalStratum,
      "mineralGeologicalStructure": this.mineralProject.mineralGeologicalStructure,
      "miningArea": this.mineralProject.miningArea,
      "miningStartTime":this.miningStartTime?this.miningStartTime.getTime()/1000:0,
      "preliminaryUnderstanding": this.mineralProject.preliminaryUnderstanding,
      "projectName": this.mineralProject.projectName,
      "remarks": this.mineralProject.remarks,
      "rockAlteration": this.mineralProject.rockAlteration,
      "id": this.mineralProject.id
    }; */

    if(this.isModify){
      /* 修改探矿权项目 */
      this.httpUtil.put('mineral-project',this.mineralProject).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
          this.mineralProjectDisplay = false;
          this.getExplorationInfo();
        }
      })
    }else{
      /* 增加探矿权项目 */
      this.httpUtil.post('mineral-project',this.mineralProject).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          this.mineralProjectDisplay = false;
          this.getExplorationInfo();
        }
      })
    }
    
  }

  pageChange(event){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    if(this.isClickSearch){
      this.getFilteredProject();
    }else{
      this.getExplorationInfo(); 
    }
       
  }

  /* 过滤显示项目名 */
  filteredName(event){
    this.filteredProject= [];
    for(let i in this.allProjectName){
      let brand = this.allProjectName[i];
      if(brand.toLowerCase().indexOf(event.query.toLowerCase())>-1) {
          this.filteredProject.push(brand);
      }
    }
  }

  /* 显示地图区域 */
  viewMap(){
    this.mineralAreaDisplay = true;
    this.OlFloorMap.clickIcon = false;
    this.removeLayer();
    //显示区域
    let area = [];
    let points = [];
    area.push(this.mineralProject)
    this.OlFloorMap.areaPoint(area);
    
    //定位区域
    if(this.mineralProject.areaCoordinates){
      let areaCoordinates = this.mineralProject.areaCoordinates;
      let point = ProjectionUtil.toLonLat(areaCoordinates.split(',').map(Number));
      points.push(point[0]);
      points.push(point[1]);
      this.OlFloorMap.locatorCard(points);
    }
   
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
      this.mineralProject.areaOpacity = '10';
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
  /* 保存地图区域 */
  saveArea(type?){
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
    let info ={
      "areaBackground": this.mineralProject.areaBackground,
      "areaCoordinates": this.mineralProject.areaCoordinates.toString(),
      "areaOpacity": this.mineralProject.areaOpacity.toString(),
      "projectId": this.mineralProject.id
    }
    this.httpUtil.post('mineral-project/coordinates',info).then(value=>{
      if (value.meta.code === 6666) {
          this.removeLayer();
          //显示区域
          let area = [];
          area.push(this.mineralProject)
          this.OlFloorMap.areaPoint(area);
          this.areaDialogDisplay = false;
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
      }
      
    })
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
  
    setTimeout(() => {
      this.OlFloorMap.map.updateSize();
      
    }, 5000);
    
    //this.removeLayer();
  }
}
