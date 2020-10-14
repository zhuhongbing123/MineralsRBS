import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService, DialogService } from 'primeng/api';
import { ExplorationProject } from '../../../common/util/app-config';
import { LoginService } from '../../login/login.service';
import { Openlayer } from '../../../common/map/openlayer';
import { Map2dService } from '../../../common/map/map2-d/map2-d.service';

import { ProjectMapComponent } from '../project-map/project-map.component';
import { MineralManageService } from '../mineral-manage.service';
import { Subscription } from 'rxjs';
import { setTime } from '../../../common/util/app-config';

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
  detailsDisplay = false;//详情按钮显示
  filteredProjectName;//项目名称
  filteredProject:any[];//搜索项目时下拉框的项目名称
  allProjectName;//所有项目名称
  isClickSearch = false;//是否点击查询按钮
  loading: boolean;//列表加载动画显示
  ownerName;//矿权人名称
  addProjectArea = false;//新增项目区域
  addAreaCommon: Subscription;
  mineralOwner:any[];//矿权人
  inputDisabled = false;//弹出框的输入框是否禁止输入
  selectedColumns: any[];//选择的菜单列
  showLoading = true;//页面加载动画
  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private loginService: LoginService,
              private map2dService: Map2dService,
              public dialogService: DialogService,
              private mineralManageService: MineralManageService) {
               this.addAreaCommon =  this.mineralManageService.addAreaCommon$.subscribe((value)=>{
                  this.mineralProject.areaBackground = value.areaBackground;
                  this.mineralProject.areaCoordinates = value.areaCoordinates;
                  this.mineralProject.areaOpacity = value.areaOpacity;
      
                })
               }

  ngOnInit() {
    this.setTableValue();
    this.getProjectName();
  }
  ngAfterViewInit(){
    this.addAreaCommon.unsubscribe();

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
      { field: 'number', header: '序号' },
      { field: 'projectName', header: '项目名称' },
      { field: 'owner_id', header: '矿权人' },
      { field: 'explorationStartTime', header: '探矿权首立时间' },
      { field: 'miningStartTime', header: '采矿权首立时间' },
      { field: 'explorationArea', header: '探矿权范围' },
      { field: 'miningArea', header: '采矿权范围' },
      { field: 'operation', header: '操作' }
    ];
    this.selectedColumns = this.mineralProjectTitle;
    
    this.loading = true;
    //获取授权的API资源
    if(!sessionStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
    }
    //获取授权的API资源
    JSON.parse(sessionStorage.getItem('api')).forEach(element => {
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
      if (element.uri === '/mineral-project/*' && element.method == 'GET') {
        this.detailsDisplay = true;
      } 
    });

    if(!this.deleteDisplay){
      this.mineralProjectTitle.splice(this.mineralProjectTitle.length-1,1)
    }

    this.getMineralOwner();
  }

  /* 获取矿权项目数据 */
  getExplorationInfo(){
    this.httpUtil.get('mineral-project/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i=0; i<data.length;i++){
          data[i].number = (this.startPage-1)*this.limit+i +1;
          data[i].explorationStartTime =  data[i].explorationStartTime!==0?new Date(data[i].explorationStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          data[i].miningStartTime =  data[i].miningStartTime!==0?new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          for(let j in this.mineralOwner){
            if(data[i].ownerId == this.mineralOwner[j].id){
              data[i]['owner_id']  = this.mineralOwner[j].ownerName;
            }
          }
        }
        
        this.mineralProjectValue = data;
        this.showLoading = false;
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
        this.getExplorationInfo();
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
        for(let i=0; i<data.length;i++){
          data[i].number = (this.startPage-1)*this.limit+i +1;
          data[i].explorationStartTime =  data[i].explorationStartTime!==0?setTime(data[i].explorationStartTime):'';
          data[i].miningStartTime =  data[i].miningStartTime!==0?setTime(data[i].miningStartTime):'';
          
            data[i]['owner_id']= data[i].ownerName;
          
        }
        
        this.mineralProjectValue = data;
      }
    })
  }
  /* 操作 */
  setMineral(type,value?){
    this.isModify = false;
    this.inputDisabled = false;
    let textarea = document.getElementsByTagName('textarea');
   
    if(type=='modify'){
      this.explorationStartTime = value.explorationStartTime?new Date(value.explorationStartTime):'';
      this.miningStartTime = value.miningStartTime?new Date(value.miningStartTime):'';
      this.mineralProject = value;
      this.mineralProjectDisplay = true;
      this.addProjectArea = false;
      this.isModify = true;

      return;
    }
    //详情
    if (type ==='details'){
      this.explorationStartTime = value.explorationStartTime ? new Date(value.explorationStartTime) : '';
      this.miningStartTime = value.miningStartTime ? new Date(value.miningStartTime) : '';
      this.mineralProject = value;
      this.mineralProjectDisplay = true;
      this.addProjectArea = false;
      this.isModify = true;
      this.inputDisabled = true;
      //设置文本框文字颜色
      setTimeout(() => {
        for (let i = 0; i < textarea.length; i++) {
          textarea[i].style.background = '#467e9b';
          textarea[i].style.opacity = '1'; 
        }
      });
      
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
      this.addProjectArea = true;
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
    if(!this.mineralProject.ownerId){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '矿权人不能为空'});
      return;
    }
    this.mineralProject.explorationStartTime = this.explorationStartTime?this.explorationStartTime.getTime()/1000:0;
    this.mineralProject.miningStartTime = this.miningStartTime?this.miningStartTime.getTime()/1000:0;
    this.mineralProject.areaCoordinates = JSON.stringify(this.mineralProject.areaCoordinates);
    if(this.isModify){
      /* 修改探矿权项目 */
      this.httpUtil.put('mineral-project',this.mineralProject).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
          this.mineralProjectDisplay = false;
          this.getExplorationInfo();
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: '信息', detail: value.meta.msg });
          return;
        }
      })
    }else{
      /* 增加探矿权项目 */
      this.httpUtil.post('mineral-project',this.mineralProject).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          this.mineralProjectDisplay = false;
          this.getExplorationInfo();
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: '信息', detail: value.meta.msg });
          return;
        }
      })
    }
    
  }

  pageChange(event){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    this.showLoading = true;
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
      let brand = this.allProjectName[i].projectName;
      if(brand.toLowerCase().indexOf(event.query.toLowerCase())>-1) {
          this.filteredProject.push(brand);
      }
    }
  }

  /* 显示地图区域 */
  viewMap(){
     this.dialogService.open(ProjectMapComponent, {
      header: this.mineralProject.projectName?this.mineralProject.projectName:'新增项目'+'区域',
      width: '70%',
      baseZIndex:2000,
      // height: "50%",
      // baseZIndex: 1000,
      data: {
        isIndoorMap: false,
        addProjectArea: this.addProjectArea,
        mineralProject:this.mineralProject
      },
    });
    
    
   
  }
   


}
