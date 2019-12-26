import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { HttpUtil } from '../../../common/util/http-util';
import { ExplorationProject,MiningMonitoring,ExplorationReport, MiningStage } from '../../../common/util/app-config';
import * as XLSX from 'xlsx';
import { ExplorationInfoService } from '../../exploration-right/exploration-info/exploration-info.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';
import { FALSE } from 'ol/functions';
declare let PDFObject;
@Component({
  selector: 'app-mining-info',
  templateUrl: './mining-info.component.html',
  styleUrls: ['./mining-info.component.scss']
})
export class MiningInfoComponent implements OnInit {
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数

  projectTotal;//采矿权列表总数
  miningInfoTitle;//采矿信息列表标题
  miningInfoValue;//采矿信息列表数据
  miningProject: ExplorationProject = new ExplorationProject();//一条矿权项目数据

  mineralOwner:any[] = [];//矿权人
  reportCategory;//报告分类
  miningTitle;//弹出框标题
  
  deleteDisplay = false;//删除按钮显示
  queryDisplay = false;//查询按钮显示
  filteredProjectName;//项目名称
  filteredProject:any[];//搜索项目时下拉框的项目名称
  allProjectName;//所有项目名称
  isClickSearch = false;//点击搜索按钮
  loading: boolean;//列表加载动画显示
  filteredOwnerName;//矿权人名称
  miningInfoDisplay =false;//新增采矿权弹出框
  miningStartTime = new Date();//采矿权首立时间
  explorationStartTime;//探矿权首立时间
  modifyButton = false;//修改按钮
  constructor(private httpUtil: HttpUtil,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private explorationInfoService: ExplorationInfoService,
    private router: Router,
    private loginService: LoginService) { 

    }

  ngOnInit() {
    this.setTableValue();
  }
  

  //初始化表格
  public setTableValue(){
    
    this.miningInfoTitle=[
      { field: 'number', header: '序号' },
      { field: 'projectName', header: '项目名称' },
      { field: 'owner_id', header: '矿权人' },
      { field: 'miningStartTime', header: '采矿权首立时间' },
      { field: 'miningArea', header: '矿权范围' },
      { field: 'operation', header: '操作' }
    ];
    this.loading = true;
    //获取授权的API资源
    if(!localStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(localStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/mineral-project/*' && element.method =='DELETE'){
        this.deleteDisplay =true;
      }
      if(element.uri ==='/mineral-project/search/*/*' && element.method =='POST'){
        this.queryDisplay =true;
      }
      if(element.uri ==='/mineral-project' && element.method =='PUT'){
        this.modifyButton =true;
      }

    });
    
    this.getMiningInfo();
    this.getMineralOwner();
    this.getReportCategory();
    this.getProjectName();
  }

  /* 获取采矿权项目数据 */
  getMiningInfo(){
    this.httpUtil.get('mineral-project/type/2/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i=0; i<data.length;i++){
          data[i].miningStartTime =  data[i].miningStartTime?new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          data[i].number = (this.startPage-1)*this.limit+i +1;
          if( data[i].lastestProjectOwner){
            data[i]['owner_id'] = data[i].lastestProjectOwner.ownerName;
          }
        }
        
        this.miningInfoValue = data;
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
          if(data[i].reportType!==2){
              data.splice(i,1);
          }
        }
        this.reportCategory = data;
      }
    })
  }
   /* 获取矿权项目名称 */
   getProjectName(){
    this.httpUtil.get('mineral-project/name/2').then(value=>{
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
      "projectType": 2
    }).then(value=>{
      if (value.meta.code === 6666) {
        this.isClickSearch = true;
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i in data){
          data[i].miningStartTime = data[i].miningStartTime? new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
        }
        
        this.miningInfoValue = data;
      }
    })
  }

  /* 查看项目详情 */
  goDetails(data,type){
    if(type=='detail'){
      this.router.navigate(['/layout/miningRight/miningDetails'],{ skipLocationChange: true,queryParams:{'type':'detail'}  });
    }else{
      this.router.navigate(['/layout/miningRight/miningDetails'],{ skipLocationChange: true,queryParams:{'type':'modify'}  });
    }
    
    this.explorationInfoService.explorationProject = data;
    this.explorationInfoService.reportCategory = this.reportCategory;
    this.explorationInfoService.mineralOwner = this.mineralOwner;
  }



  

  /* 采矿权的操作 */
  setMining(type,value?){
    if(type=='filtered'){
      this.getSearchProject();
      return;
    }
    if(type=='add'){
      this.miningInfoDisplay = true;
      this.miningProject= new ExplorationProject();
      return;
    }
    /* 项目文件的删除 */
    if(type==='delete'){
      this.confirmationService.confirm({
        message: '确认删除该项目('+value.projectName+')吗?',
        header: '删除文件',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-project/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.getMiningInfo();
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

  
 
  pageChange(event,type){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    if(this.isClickSearch){
      this.getSearchProject()
    }else{
      this.getMiningInfo();
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

  /* 保存采矿权项目 */
  saveProject(){
    if(!this.miningProject.projectName){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '项目名称不能为空'});
      return;
    }
    this.miningProject.explorationStartTime = this.explorationStartTime?this.explorationStartTime.getTime()/1000:0;
    this.miningProject.miningStartTime = this.miningStartTime?parseInt((this.miningStartTime.getTime()/1000).toString()):0;
  /* 增加采矿权项目 */
    this.httpUtil.post('mineral-project',this.miningProject).then(value=>{
      if (value.meta.code === 6666) {
        this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
        this.miningInfoDisplay = false;
        this.getMiningInfo();
      }
    })
  }
}
