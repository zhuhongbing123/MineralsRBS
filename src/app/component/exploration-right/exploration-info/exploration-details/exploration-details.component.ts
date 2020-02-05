import { Component, OnInit, Input } from '@angular/core';
import { ExplorationProject, ExplorationStage } from '../../../../common/util/app-config';
import { ExplorationInfoService } from '../exploration-info.service';
import { HttpUtil } from '../../../../common/util/http-util';
import { MessageService, ConfirmationService, MenuItem, DialogService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../login/login.service';
import { ProjectMapComponent } from 'src/app/component/exploration-right/exploration-info/project-map/project-map.component';
@Component({
  selector: 'app-exploration-details',
  templateUrl: './exploration-details.component.html',
  styleUrls: ['./exploration-details.component.scss']
})
export class ExplorationDetailsComponent implements OnInit {
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数
  detailTotal;//勘查阶段详情总数

  explorationProject: ExplorationProject = new ExplorationProject();//一条探矿权项目数据
  reportCategory;//报告分类数据
  mineralOwner;//矿权人信息
  explorationDetailTitle;//勘查详情标题
  explorationDetailValue;//勘查详情内容
  explorationItems: MenuItem[];//探矿权详情tab页标题
  projectDetailDisplay = true;//项目tab页是否显示
  stageDetailDisplay = false;//勘查阶段tab页是否显示
  reportDetailDisplay = false;//矿权报告tab页是否显示
  explorationtDisplay = false;//探矿权项目(增加、删除)弹出框是否显示
  stageDisplay = false;//勘查阶段详情(增加、删除)弹出框是否显示
  modifyExploration = false;//是否修改探矿权
  oldProjectInfo;//项目信息修改之前的值
  explorationStartTime;//探矿权首立时间
  miningStartTime;//采矿权首立时间
  stageStartTime;//勘查阶段开始时间
  stageEndTime;//勘查阶段结束时间
  modifyStage = false;//是否修改勘查阶段信息
  explorationStage: ExplorationStage = new ExplorationStage();//勘查阶段单行数据
  explorationTitle;//弹出框标题
  buttonType = false;//点击跳转按钮的类型


  modifyButton = false;//编辑按钮显示
  addStageButton = false;//勘查阶段新增按钮显示
  modifyStageButton = false;//勘查阶段修改按钮显示
  deleteStageButton = false;//勘查阶段删除按钮显示

  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private explorationInfoService: ExplorationInfoService,
              private router: Router,
              private loginService: LoginService,
              public route: ActivatedRoute,
              private dialogService: DialogService) { 
                
  }

  ngOnInit() {
    this.explorationProject = this.explorationInfoService.explorationProject;
    this.reportCategory = this.explorationInfoService.reportCategory;
    this.mineralOwner = this.explorationInfoService.mineralOwner;

    for(let i in  this.mineralOwner){
      if(this.explorationProject.ownerId ==  this.mineralOwner[i].id){
        this.explorationProject['ownerName'] = this.mineralOwner[i].ownerName;
      }
    }
    this.route.queryParams.subscribe(params => {
      if(params['type']=='modify'){
        this.buttonType = true;
      }

    });
    this.setTableValue();
  }

  //初始化表格
  public setTableValue(){
    this.explorationItems = [
      {label: '项目详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '勘查阶段详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '探矿权报告', icon: 'fa fa-fw fa-bar-chart'}
    ];
    this.explorationDetailTitle = [
      { field: 'ownerId', header: '矿权人' },
      { field: 'investigationStartTime', header: '首立时间' },
      { field: 'projectArea', header: '矿权范围' },
      { field: 'investigationOrganization', header: '勘查单位' },
      { field: 'investigationCategory', header: '类别' },
      { field: 'investigationArea', header: '面积(平方公里)' },
      { field: 'investigationMineralType', header: '勘查矿种' },
      { field: 'investigationStage', header: '勘查阶段' },
      { field: 'investigationWorkload', header: '工作量' },
      { field: 'investigationInvestment', header: '投入金额(万元)' },

    ];
    //获取授权的API资源
    if(!localStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(localStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/mineral-project' && element.method =='PUT'){
          this.modifyButton =true;
      }
      if(element.uri ==='/mineral-explore-stage' && element.method =='POST'){
        this.addStageButton =true;
      }
      if(element.uri ==='/mineral-explore-stage' && element.method =='PUT'){
        this.modifyStageButton =true;
      }
      if(element.uri ==='/mineral-explore-stage' && element.method =='DELETE'){
        this.deleteStageButton =true;
      }
    });

    if(!this.modifyStageButton && !this.deleteStageButton || !this.buttonType){
      this.explorationDetailTitle.splice(this.explorationDetailTitle.length-1,1);
    }
    this.getStageInfo();
  }

  /* 获取勘查阶段详情 */
  getStageInfo(){
    /* 获取探矿权勘查阶段详情 */
    this.httpUtil.get('mineral-explore-stage/project/'+this.explorationProject.id+'/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.explorationStages.list;
        this.detailTotal = value.data.explorationStages.total;
        for(let i=0; i<data.length;i++){
          data[i].investigationStartTime = data[i].investigationStartTime? new Date(data[i].investigationStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          data[i].investigationEndTime =  data[i].investigationEndTime?new Date(data[i].investigationEndTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          data[i].number = (this.startPage-1)*this.limit+i +1;
          for(let j in this.mineralOwner){
              if(data[i].ownerId == this.mineralOwner[j].id){
                  data[i].ownerId = this.mineralOwner[j].ownerName;
              }
          }
        }
        this.explorationDetailValue = data;
      }
    })
  }
 /* 点击tab页面切换按钮 */
 menuClick(event){
  if(event ==='项目详情'){
    this.projectDetailDisplay = true;
    this.reportDetailDisplay = false;
    this.stageDetailDisplay = false;
    this.explorationInfoService.getReportFile({
      type: false
    });
  }else if(event ==='勘查阶段详情'){
    this.stageDetailDisplay = true;
    this.projectDetailDisplay = false;
    this.reportDetailDisplay = false;
    this.explorationInfoService.getReportFile({
      type: false
    });
  }else if(event ==='探矿权报告'){
    this.reportDetailDisplay = true
    this.projectDetailDisplay = false;
    this.stageDetailDisplay = false;
    this.explorationInfoService.getReportFile({
      type: true,
      reportCategory:this.explorationInfoService.reportCategory,
      explorationProject: this.explorationInfoService.explorationProject
    });
  }
}
/* 编辑项目详情 */
modifyProject(){
  this.modifyExploration = true;
  this.explorationtDisplay = true;
  this.oldProjectInfo = JSON.parse(JSON.stringify(this.explorationProject));
  this.explorationStartTime = this.explorationProject.explorationStartTime?new Date(this.explorationProject.explorationStartTime):'';
  this.miningStartTime = new Date(this.explorationProject.miningStartTime);
}

 
/* 保存增加、修改的探矿权信息 */
  saveExplorationProject(type){
    if(type ==='cancel' && this.modifyExploration){
      this.explorationProject = this.oldProjectInfo;
      this.explorationtDisplay = false;
      return;
    }
    if(type ==='cancel' && !this.modifyExploration){
      this.explorationtDisplay = false;
      return;
    }
    if(!this.explorationProject.projectName){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '项目名称不能为空'});
      return;
    }
    if(typeof(this.explorationProject.areaCoordinates)==='object'){
      this.explorationProject.areaCoordinates =  JSON.stringify(this.explorationProject.areaCoordinates);
    }
    this.explorationProject.explorationStartTime = this.explorationStartTime?this.explorationStartTime.getTime()/1000:0;
    this.explorationProject.miningStartTime = this.miningStartTime?this.miningStartTime.getTime()/1000:0;

    if(this.modifyExploration){
      /* 修改项目信息 */
        this.httpUtil.put('mineral-project',this.explorationProject).then(value=>{
          if (value.meta.code === 6666) {
            this.explorationProject.explorationStartTime = new Date(this.explorationStartTime).toLocaleDateString().replace(/\//g, "-");
            for(let i in  this.mineralOwner){
              if(this.explorationProject.ownerId ==  this.mineralOwner[i].id){
                this.explorationProject['ownerName'] = this.mineralOwner[i].ownerName;
              }
            }
            this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
            this.explorationtDisplay = false;
          }
        })
    }
  }

   /* 探矿权、勘查阶段、报告文件的新增和删除操作 */
   setExplorationt(type,value?){
    //增加勘查详情
    if(type=='addStage'){
      this.modifyStage = false;
      this.stageDisplay = true;
      this.explorationStage = new ExplorationStage();
      this.stageEndTime = '';
      this.stageStartTime = '';
      this.explorationTitle = '增加勘查阶段';
      return;
    }
    //修改勘查详情
    if(type==='modifyStage'){
      this.stageDisplay = true;
      this.modifyStage = true;
      this.explorationTitle = '修改勘查阶段';
      this.explorationStage = JSON.parse(JSON.stringify(value));  
      this.stageStartTime = value.investigationStartTime?new Date(value.investigationStartTime):'';
      this.stageEndTime = value.investigationEndTime?new Date(value.investigationEndTime):'';
      //矿权人
      for(let i in this.mineralOwner){
        if(this.explorationStage.ownerId == this.mineralOwner[i].ownerName){
          this.explorationStage.ownerId = this.mineralOwner[i].id;
        }
    }
      return;
    }
    //删除勘查详情
    if(type==='deleteStage'){
      this.confirmationService.confirm({
        message: '确认删除该条勘查信息吗?',
        header: '删除勘查阶段信息',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-explore-stage/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.getStageInfo();
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

   /* 勘查阶段保存 */
saveExplorationStage(){
    if(!this.explorationStage.ownerId){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '矿权人不能为空'});
      return;
    }
    let stageInfo = {
      "id": this.explorationStage.id,
      "projectId": this.explorationProject.id,//矿权项目ID，
      "ownerId": this.explorationStage.ownerId,//矿权人ID
      "investigationStartTime": this.stageStartTime?this.stageStartTime.getTime()/1000:0,//首立时间
      "investigationEndTime":0,//结束时间
      "projectArea": this.explorationStage.projectArea,//矿权范围
      "investigationOrganization": this.explorationStage.investigationOrganization,//勘查单位
      "investigationCategory": this.explorationStage.investigationCategory,//类别  
      "investigationArea": this.explorationStage.investigationArea?parseFloat(this.explorationStage.investigationArea.toString()):null,//勘查面积
      "investigationMineralType": this.explorationStage.investigationMineralType,//勘查矿种
      "investigationStage": this.explorationStage.investigationStage,//勘查阶段
      "investigationWorkload": this.explorationStage.investigationWorkload,//勘查工作量
      "investigationInvestment":  this.explorationStage.investigationInvestment?parseFloat(this.explorationStage.investigationInvestment.toString()):null//勘查投入金额
    }
    if(this.modifyStage){
      this.httpUtil.put('mineral-explore-stage',stageInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.stageDisplay = false;
          this.getStageInfo();
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
          
        }else{
          this.messageService.add({key: 'tc', severity:'error', summary: '警告', detail: '服务器开小差'});
          return;
        }
      })
    }else{
      this.httpUtil.post('mineral-explore-stage',stageInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.stageDisplay = false;
          this.getStageInfo();
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          
        }
      })
    }
}
  /* 返回到探矿权项目首页 */
  goBack(){
    this.router.navigate(['/layout/explorationRight/explorationInfo']);
    this.explorationInfoService.goBack();
  }

  pageChange(event){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    this.getStageInfo();
  }

  /* 显示地图区域 */
 viewMap(){
    this.dialogService.open(ProjectMapComponent, {
      header: '新增项目区域',
      height: '400px',
    width: '600px',
      baseZIndex:2000,
      styleClass:'dialog-class',
      
      // baseZIndex: 1000,
      data: {
        isIndoorMap: false,
        addLocationArea: false,
        mineralProject:this.explorationProject
      },
    });
  }
}
