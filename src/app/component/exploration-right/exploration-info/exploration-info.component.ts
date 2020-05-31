import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService, DialogService } from 'primeng/api';
import { HttpUtil } from '../../../common/util/http-util';
import { ExplorationProject,ExplorationStage,ExplorationReport } from '../../../common/util/app-config';

import { ExplorationInfoService } from './exploration-info.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';

import { MineralManageService } from '../../mineral-manage/mineral-manage.service';
import { ProjectMapComponent } from 'src/app/component/exploration-right/exploration-info/project-map/project-map.component';

@Component({
  selector: 'app-exploration-info',
  templateUrl: './exploration-info.component.html',
  styleUrls: ['./exploration-info.component.scss']
})
export class ExplorationInfoComponent implements OnInit {
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数

  projectTotal;//探矿权列表总数
  explorationInfoTitle;//探矿信息列表标题
  explorationInfoValue;//探矿信息列表数据
  explorationInfoTableDisplay = false;//探矿权信息列表是否显示


  explorationtDisplay = false;//探矿权项目(增加、删除)弹出框是否显示
  stageDisplay = false;//勘查阶段详情(增加、删除)弹出框是否显示
  explorationProject: ExplorationProject = new ExplorationProject();//一条探矿权项目数据
  modifyExploration = false;//是否修改探矿权
  oldProjectInfo;//项目信息修改之前的值
  explorationStartTime = new Date();//探矿权首立时间
  miningStartTime;//采矿权首立时间
  mineralOwner:any[] = [];//矿权人
  reportCategory;//报告分类数据


  explorationTitle;//弹出框标题
  fileTree = [];//报告文件树形结构数据
  deleteButton = false;//删除按钮显示
  queryDisplay  = false;//查询按钮显示
  backCommon: Subscription;
  addAreaCommon:Subscription;

  filteredProjectName;//项目名称
  filteredOwnerName;//矿权人名称
  filteredProject:any[];//搜索项目时下拉框的项目名称
  allProjectName;//所有项目名称
  isClickSearch = false;//是否点击了搜索
  loading: boolean;//列表加载动画显示
  modifyButton = false;//修改按钮

  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private explorationInfoService: ExplorationInfoService,
              private loginService:LoginService,
              private router: Router,
              private dialogService: DialogService) { 
               this.backCommon =  this.explorationInfoService.backCommon$.subscribe(()=>{
                  this.setTableValue();
                });

               this.addAreaCommon =  this.explorationInfoService.addAreaCommon$.subscribe((value)=>{
                  this.explorationProject.areaBackground = value.areaBackground;
                  this.explorationProject.areaCoordinates = value.areaCoordinates;
                  this.explorationProject.areaOpacity = value.areaOpacity;
                })
               
              }

  ngOnInit() {
    this.setTableValue();
  }
  ngOnDestroy(){
    this.backCommon.unsubscribe();
    this.addAreaCommon.unsubscribe();
  }
  //初始化表格
  public setTableValue(){
    
    this.explorationInfoTitle=[
      { field: 'projectName', header: '项目名称' },
      { field: 'owner_id', header: '矿权人' },
      { field: 'explorationStartTime', header: '探矿权首立时间' },
      { field: 'projectArea', header: '矿权范围' },
      { field: 'investigationArea', header: '面积(平方公里)' },
      { field: 'investigationStage', header: '勘查阶段' },
      { field: 'investigationMineralType', header: '勘查矿种' },
      { field: 'investigationWorkload', header: '工作量' },
      { field: 'investigationInvestment', header: '投入金额(万元)' }
    ];
    this.loading = true;
    //获取授权的API资源
    if(!sessionStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
    }
    JSON.parse(sessionStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/mineral-project/*' && element.method =='DELETE'){
          this.deleteButton =true;
      }
      if(element.uri ==='/mineral-project/search/*/*' && element.method =='POST'){
        this.queryDisplay =true;
      }
      if(element.uri ==='/mineral-project' && element.method =='PUT'){
        this.modifyButton =true;
      }
    })
    
  }
  ngAfterViewInit(){

    this.getMineralOwner();
    this.getReportCategory();
    this.getProjectName();
  }
  /* 获取探矿权项目数据 */
  getExplorationInfo(){
    this.httpUtil.get('mineral-project/type/1/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i=0; i<data.length;i++){
          data[i].explorationStartTime = data[i].explorationStartTime!==0? new Date(data[i].explorationStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
         
          data[i].number = (this.startPage-1)*this.limit+i +1;
          if(data[i].latestExplorationStage){
              data[i]['projectArea'] = data[i].latestExplorationStage.projectArea;
              data[i]['investigationArea'] = data[i].latestExplorationStage.investigationArea;
              data[i]['investigationStage'] = data[i].latestExplorationStage.investigationStage;
              data[i]['investigationWorkload'] = data[i].latestExplorationStage.investigationWorkload;
              data[i]['investigationInvestment'] = data[i].latestExplorationStage.investigationInvestment;
              data[i]['investigationMineralType'] = data[i].latestExplorationStage.investigationMineralType;

          }
          for(let j in this.mineralOwner){
              if(data[i].ownerId == this.mineralOwner[j].id){
                data[i]['owner_id']  = this.mineralOwner[j].ownerName;
              }
          }
        }
        
        this.explorationInfoValue = data;
        this.loading = false;
      }
    });
    
    
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


  /* 获取报告分类 */
  getReportCategory(){
    this.httpUtil.get('mineral-report-category/list/1/1000').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.reportCategories.list;
        for(var i = data.length - 1; i >= 0; i--){
          data[i]['label'] = data[i].reportCategoryName;
          data[i]['value'] = data[i].id;
          if(data[i].reportType!==1){
              data.splice(i,1);
          }
        }
        this.reportCategory = data;
      }
    })
  }

  /* 获取矿权项目名称 */
  getProjectName(){
    this.httpUtil.get('mineral-project/name/1').then(value=>{
      if (value.meta.code === 6666) {
        this.allProjectName = value.data.projectNames;
      }
    })
  }

  /* 根据项目名字搜索 */
  getSearchProject(){
    this.httpUtil.post('mineral-project/search/'+this.startPage+'/'+this.limit,{
      "projectName": this.filteredProjectName?this.filteredProjectName:'',
      "ownerName": this.filteredOwnerName?this.filteredOwnerName:'',
      "projectType": 1
    }).then(value=>{
      if (value.meta.code === 6666) {
        this.isClickSearch = true;
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i=0; i<data.length;i++){
          data[i].number = (this.startPage-1)*this.limit+i +1;
          data[i].explorationStartTime = data[i].explorationStartTime? new Date(data[i].explorationStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          if(data[i].latestExplorationStage){
            data[i]['projectArea'] = data[i].latestExplorationStage.projectArea;
            data[i]['investigationArea'] = data[i].latestExplorationStage.investigationArea;
            data[i]['investigationStage'] = data[i].latestExplorationStage.investigationStage;
            data[i]['investigationWorkload'] = data[i].latestExplorationStage.investigationWorkload;
            data[i]['investigationInvestment'] = data[i].latestExplorationStage.investigationInvestment;
            data[i]['investigationMineralType'] = data[i].latestExplorationStage.investigationMineralType;

          }
          for(let j in this.mineralOwner){
              if(data[i].ownerId == this.mineralOwner[j].id){
                data[i]['owner_id']  = this.mineralOwner[j].ownerName;
              }
          }
        }
        
        this.explorationInfoValue = data;
      }
    })
  }

  /* 将报告文件整理成树形结构 */
  getFileInfo(data,pid){
    var result = [] , temp;
    for(var i in data){
        if(data[i].pid==pid){
            result.push(data[i]);
            temp = this.getFileInfo(data,data[i].id);           
            if(temp.length>0){
                data[i].children=temp;
            }           
        }       
    }
    return result;
    
  }
  /* 查看项目详情 */
  goDetails(data,type){
    this.explorationProject = data;
    if(type=='detail'){
      this.router.navigate(['/layout/explorationRight/explorationDetails'],{ skipLocationChange: true,queryParams:{'type':'detail'} });
    }else{
      this.router.navigate(['/layout/explorationRight/explorationDetails'],{ skipLocationChange: true,queryParams:{'type':'modify'} });
    }

    this.explorationInfoService.explorationProject = this.explorationProject;
    this.explorationInfoService.reportCategory = this.reportCategory;
    this.explorationInfoService.mineralOwner = this.mineralOwner;
    
  }


  /* 探矿权的新增和删除操作 */
  setExplorationt(type,value?){
    if(type=='filtered'){
      this.getSearchProject();
      return;
    }
    /* 增加矿权项目 */
    if(type ==='add'){
      this.modifyExploration = false;
      this.explorationProject = new ExplorationProject();
      this.explorationStartTime = new Date();
      this.explorationtDisplay = true;
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

 

  pageChange(event,type){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    if(this.isClickSearch){
      this.getSearchProject();
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

  /* 保存新增项目 */
  saveProject(){
    if(!this.explorationProject.projectName){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '项目名称不能为空'});
      return;
    }
    if(!this.explorationProject.ownerId){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '矿权人不能为空'});
      return;
    }
    this.explorationProject.explorationStartTime = this.explorationStartTime.getTime()/1000
    this.explorationProject.miningStartTime = 0;
    this.explorationProject.areaCoordinates = JSON.stringify(this.explorationProject.areaCoordinates);
 
      /* 增加探矿权项目 */
      this.httpUtil.post('mineral-project',this.explorationProject).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          this.explorationtDisplay = false;
          this.getExplorationInfo();
        }
      })

  }
 /* 显示地图区域 */
  viewMap(){
    this.dialogService.open(ProjectMapComponent, {
      header: '新增项目区域',
      width: '70%',
      baseZIndex:2000,
      // height: "50%",
      // baseZIndex: 1000,
      data: {
        isIndoorMap: false,
        addLocationArea: true,
        
        mineralProject:[]
      },
    });
  }

  /* 列表导出到Excel */
  exportExcel(){
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.getProject());
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "探矿权项目列表数据");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName  + '('+new Date(new Date().toString()).toLocaleDateString().replace(/\//g, "-")+ ')'+EXCEL_EXTENSION);
    });
  }

  getProject() {
    let exploration = [];
    let data = JSON.parse(JSON.stringify(this.explorationInfoValue));
    for(let project of data) {

        let info = {
          '项目名称': project.projectName,
          '矿权人 ': project.owner_id,
          '探矿权首立时间': project.explorationStartTime,
          '矿权范围': project.projectArea,
          '面积(平方公里)': project.investigationArea,
          '勘查阶段': project.investigationStage,
          '勘查矿种': project.investigationMineralType,
          '工作量': project.investigationWorkload,
          '投入金额(万元)': project.investigationInvestment
        }

        exploration.push(info);
    }
    return exploration;
  }
    
}
