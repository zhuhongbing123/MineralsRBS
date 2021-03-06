import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService, DialogService } from 'primeng/api';
import { ExplorationProject, MiningStage, MiningMonitoring, ExplorationReport } from '../../../../common/util/app-config';
import { HttpUtil } from '../../../../common/util/http-util';
import { ExplorationInfoService } from '../../../exploration-right/exploration-info/exploration-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../login/login.service';
import { ProjectMapComponent } from '../../../exploration-right/exploration-info/project-map/project-map.component';
import { setTime } from '../../../../common/util/app-config';
@Component({
  selector: 'app-mining-details',
  templateUrl: './mining-details.component.html',
  styleUrls: ['./mining-details.component.scss']
})
export class MiningDetailsComponent implements OnInit {
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数

  stageTotal;//开采阶段列表总数
  validationTotal;//年度监测列表总数

  miningInfoTableDisplay = false;//探矿权信息列表是否显示
  miningItems: MenuItem[];//探矿权详情tab页标题
  miningProject: ExplorationProject = new ExplorationProject();//一条矿权项目数据
  miningStage: MiningStage = new MiningStage();//开采阶段单行数据
  miningMonitoring: MiningMonitoring = new MiningMonitoring();//年度监测情况单条数据
  explorationReport: ExplorationReport = new ExplorationReport();//采矿权档案单条数据
  projectDetailDisplay = true;//项目tab页是否显示
  stageDetailDisplay = false;//开采阶段tab页是否显示
  monitoringDetailDisplay = false;//监测报告tab页是否显示
  reportDetailDisplay = false;//采矿权档案tab页
  mineralOwner:any[] = [];//矿权人
  stageDetailTitle;//开采详情标题
  stageDetailValue;//开采详情内容
  reportCategory;//报告分类
  monitoringTitle;//年度监测情况列表标题
  monitoringValue;//年度监测情况列表数据
  miningDisplay = false;//采矿权项目修改弹出框
  oldProjectInfo;//项目信息修改之前的值
  miningStartTime;//采矿权首立时间
  reportFileDisplay = false;//查看采矿权档案文件
  modifyStage = false;//是否修改开采阶段信息
  stageDisplay = false;//开采阶段详情(增加、删除)弹出框是否显示
  stageStartTime;//开采阶段开始时间
  stageEndTime;//开采阶段结束时间
  monitoringDisplay = false;//年度监测情况是否显示
  modifyMonitoring = false;//修改年度监测情况
  validationYear;//监测报告年份
  miningTitle;//弹出框标题

  modifyButton = false;//编辑按钮显示
  addStageButton = false;//开采阶段新增按钮显示
  modifyStageButton = false;//开采阶段修改按钮显示
  deleteStageButton = false;//开采阶段删除按钮显示
  addValidationButton = false;//监测阶段新增按钮显示
  modifyValidationButton = false;//监测阶段修改按钮显示
  deleteValidationButton = false;//监测阶段删除按钮显示

  buttonType = false;//点击按钮的类型
  selectedStageColumns: any[];//选择开采详情菜单列
  selectedReportColumns: any[];//选择年度监测菜单列
  showLoading = true;//页面加载中

  constructor(private httpUtil: HttpUtil,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private explorationInfoService: ExplorationInfoService,
    private router: Router,
    private loginService: LoginService,
    public route: ActivatedRoute,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.miningProject = this.explorationInfoService.explorationProject;
    this.reportCategory = this.explorationInfoService.reportCategory;
    this.mineralOwner = this.explorationInfoService.mineralOwner;
    for(let i in  this.mineralOwner){
      if(this.miningProject.ownerId ==  this.mineralOwner[i].id){
        this.miningProject['ownerName'] = this.mineralOwner[i].ownerName;
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
    
    this.miningItems = [
      {label: '项目详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '采矿证信息沿革', icon: 'fa fa-fw fa-bar-chart'},
      {label: '年度监测情况', icon: 'fa fa-fw fa-bar-chart'},
      {label: '采矿权档案', icon: 'fa fa-fw fa-bar-chart'}
    ];
    this.stageDetailTitle = [
      { field: 'number', header: '序号' },
      { field: 'lisenceId', header: '证号' },
      { field: 'ownerId', header: '采矿权人' },
      { field: 'address', header: '地址' },
      { field: 'economyType', header: '经济类型' },
      { field: 'miningMineralType', header: '开采矿种' },
      { field: 'miningMethod', header: '开采方式' },
      { field: 'miningProductionScale', header: '生产规模(吨/年)' },
      { field: 'miningArea', header: '矿区面积(平方公里)' },
      { field: 'validityDate', header: '有效期' },
      { field: 'projectArea', header: '矿权范围拐点坐标' },
      { field: 'miningDepth', header: '开采深度' },
      { field: 'comment', header: '备注' },
      { field: 'operation', header: '操作' }

    ];
     this.selectedStageColumns = this.stageDetailTitle;
    this.monitoringTitle = [
      { field: 'validationYear', header: '监测报告年份' },
      { field: 'resourceUsed', header: '年度动用资源量(千吨)' },
      { field: 'resourceMaintained', header: '年末保有资源量(千吨)' },
      { field: 'executionStatus', header: '矿山年度监测概况' },
      { field: 'problemFound', header: '存在的主要问题' },

    ];
     this.selectedReportColumns = this.monitoringTitle;
     //获取授权的API资源
     if(!sessionStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(sessionStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/mineral-project' && element.method =='PUT'){
          this.modifyButton =true;
      }
      if(element.uri ==='/mineral-mining-stage' && element.method =='POST'){
        this.addStageButton =true;
      }
      if(element.uri ==='/mineral-mining-stage' && element.method =='PUT'){
        this.modifyStageButton =true;
      }
      if(element.uri ==='/mineral-mining-stage/*' && element.method =='DELETE'){
        this.deleteStageButton =true;
      }
      if(element.uri ==='/mineral-project-validation' && element.method =='POST'){
        this.addValidationButton =true;
      }
      if(element.uri ==='/mineral-project-validation' && element.method =='PUT'){
        this.modifyValidationButton =true;
      }
      if(element.uri ==='/mineral-project-validation/*' && element.method =='DELETE'){
        this.deleteValidationButton =true;
      }

    });

   /*  if(!this.modifyStageButton && !this.deleteStageButton || !this.buttonType){
      this.stageDetailTitle.splice(this.stageDetailTitle.length-1,1);
    }
    if(!this.modifyValidationButton && !this.deleteValidationButton || !this.buttonType){
      this.monitoringTitle.splice(this.monitoringTitle.length-1,1);
    } */

    this.getStageInfo();
    this.getMonitoring();
  }
  
   /* 获取开采阶段详情 */
   getStageInfo(){
    /* 获取采矿权开采阶段详情 */
    this.httpUtil.get('mineral-mining-stage/project/'+this.miningProject.id+'/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.miningStages.list;
        this.stageTotal = value.data.miningStages.total;
        for(let i=0; i<data.length;i++){
          data[i].number = (this.startPage-1)*this.limit+i +1;
          data[i].miningStartTime =  data[i].miningStartTime?new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          data[i].miningEndTime =  data[i].miningEndTime?new Date(data[i].miningEndTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
          if (data[i].miningStartTime){
            data[i]['validityDate'] = data[i].miningStartTime + '~' + data[i].miningEndTime; //有效期
          }
          for(let j in this.mineralOwner){
              if(data[i].ownerId == this.mineralOwner[j].id){
                  data[i].ownerId = this.mineralOwner[j].ownerName;
              }
          }
        }
        this.showLoading = false;
        this.stageDetailValue = data;
      }
    })
  }
  /* 获取年度监测情况 */
  getMonitoring(){
    this.httpUtil.get('mineral-project-validation/project/'+this.miningProject.id+'/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.projectValidations.list;
          this.validationTotal = value.data.projectValidations.total;
          for(let i=0; i<data.length;i++){
            data[i].number = (this.startPage-1)*this.limit+i +1;
            data[i].validationYear =  data[i].validationYear?setTime(data[i].validationYear).split('-')[0]:'';
            for(let j in this.reportCategory){
              if(data[i].reportCategoryId ===this.reportCategory[j].value){
                data[i].reportCategoryId = this.reportCategory[j].reportCategory;
                
              }
            }
          }
          this.monitoringValue = data;
          this.showLoading = false;
      }
    })
  }
/* 编辑项目详情 */
  modifyProject(){
    this.miningDisplay = true;
    this.miningTitle = '编辑项目';
    this.oldProjectInfo = JSON.parse(JSON.stringify(this.miningProject));
    this.miningStartTime = this.miningProject.miningStartTime?new Date(this.miningProject.miningStartTime):'';
  }

  
  /* 点击详情页面切换按钮 */
  menuClick(event){
    if(event ==='项目详情'){
      this.projectDetailDisplay = true;
      this.monitoringDetailDisplay = false;
      this.stageDetailDisplay = false;
      this.reportFileDisplay = false;
      this.reportDetailDisplay = false;
      this.explorationInfoService.getReportFile({
        type: false
      });
    } else if (event ==='采矿证信息沿革'){
      this.stageDetailDisplay = true;
      this.projectDetailDisplay = false;
      this.monitoringDetailDisplay = false;
      this.reportFileDisplay = false;
      this.reportDetailDisplay = false;
      this.explorationInfoService.getReportFile({
        type: false
      });
    } else if (event ==='年度监测情况'){
      this.monitoringDetailDisplay = true;
      this.projectDetailDisplay = false;
      this.stageDetailDisplay = false;
      this.reportDetailDisplay = false;
      this.explorationInfoService.getReportFile({
        type: false
      });
    }else if(event ==='采矿权档案'){
      this.stageDetailDisplay = false;
      this.projectDetailDisplay = false;
      this.monitoringDetailDisplay = false;
      this.reportFileDisplay = false;
      this.reportDetailDisplay = true;
      this.explorationInfoService.getReportFile({
        type: true,
        reportCategory:this.explorationInfoService.reportCategory,
        explorationProject: this.explorationInfoService.explorationProject
      });
    }
  }

  /* 采矿权、开采阶段、监测报告阶段的操作 */
  setMining(type,value?){
    //增加开采详情
    if(type=='addStage'){
      this.modifyStage = false;
      this.stageDisplay = true;
      this.miningStage = new MiningStage();
      this.stageEndTime = '';
      this.stageStartTime = '';
      this.miningTitle = '增加开采阶段';
      return;
    }
    //修改开采详情
    if(type==='modifyStage'){
      this.stageDisplay = true;
      this.modifyStage = true;
      this.miningTitle = '修改开采阶段';
      this.miningStage = JSON.parse(JSON.stringify(value));  
      this.stageStartTime = new Date(value.miningStartTime);
      this.stageEndTime = new Date(value.miningEndTime);
      //矿权人
      for(let i in this.mineralOwner){
        if(this.miningStage.ownerId == this.mineralOwner[i].ownerName){
          this.miningStage.ownerId = this.mineralOwner[i].id;
        }
    }
      return;
    }
    //删除勘查详情
    if(type==='deleteStage'){
      this.confirmationService.confirm({
        message: '确认删除该条信息吗?',
        header: '删除开采阶段信息',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-mining-stage/'+value.id).then(value=>{
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

    /* 年度监测情况增加 */
    if(type =='addMonitoring'){
        this.monitoringDisplay = true;
        this.miningTitle = '年度监测情况';
        this.miningMonitoring = new MiningMonitoring();
        this.validationYear = '';
        this.modifyMonitoring = false;
        return;
    }
    /* 年度监测情况修改 */
    if(type =='modifyMonitoring'){
      this.monitoringDisplay = true;
      this.miningTitle = '年度监测情况';
      //this.miningMonitoring = new MiningMonitoring();
      this.miningMonitoring = JSON.parse(JSON.stringify(value)); 
      this.validationYear = new Date(value.validationYear);
      this.modifyMonitoring = true;
      return;
    }
    //删除年度监测情况
    if(type==='deleteMonitoring'){
      this.confirmationService.confirm({
        message: '确认删除该条报告吗?',
        header: '删除监测报告',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-project-validation/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.getMonitoring();
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

  /* 开采阶段保存 */
  saveMiningStage(){
    if(!this.miningStage.ownerId){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '矿权人不能为空'});
      return;
    }
    if (!this.stageStartTime || !this.stageEndTime){
      this.messageService.add({ key: 'tc', severity: 'warn', summary: '警告', detail: '请选择有效期时间' });
      return;
    }
    if (this.stageStartTime && this.stageEndTime && this.stageStartTime.getTime()>this.stageEndTime.getTime()){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '开始时间不能晚于结束时间'});
      return;
    }
    let stageInfo = {
      "id": this.miningStage.id,
      "projectId": this.miningProject.id,//矿权项目ID，
      "ownerId": this.miningStage.ownerId,//矿权人ID
      "miningStartTime": this.stageStartTime?this.stageStartTime.getTime()/1000:0,//开始时间
      "miningEndTime": this.stageEndTime?this.stageEndTime.getTime()/1000:0,//结束时间
      "projectArea": this.miningStage.projectArea?this.miningStage.projectArea:'',//矿权范围
      "miningMineralType": this.miningStage.miningMineralType?this.miningStage.miningMineralType:'',//开采矿种
      "miningProductionScale": this.miningStage.miningProductionScale?this.miningStage.miningProductionScale:'',//生产规模  
      "miningArea": this.miningStage.miningArea?this.miningStage.miningArea:null,//开采面积
      "miningWorkload": this.miningStage.miningWorkload?this.miningStage.miningWorkload:'',//开采投入工作量
      "miningInvestment": this.miningStage.miningInvestment?this.miningStage.miningInvestment:null,//开采投入金额
      "lisenceId": this.miningStage.lisenceId ? this.miningStage.lisenceId:null,//证号
      "address": this.miningStage.address ? this.miningStage.address : null,//地址
      "economyType": this.miningStage.economyType ? this.miningStage.economyType : null,//经济类型
      "miningMethod": this.miningStage.miningMethod ? this.miningStage.miningMethod : null,//开采方式
      "miningDepth": this.miningStage.miningDepth ? this.miningStage.miningDepth : null,//开采深度
      "comment": this.miningStage.comment ? this.miningStage.comment : null,//备注
    }
    if(this.modifyStage){
      this.httpUtil.put('mineral-mining-stage',stageInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.stageDisplay = false;
          this.getStageInfo();
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
          
        }
      })
    }else{
      this.httpUtil.post('mineral-mining-stage',stageInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.stageDisplay = false;
          this.getStageInfo();
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          
        }
      })
    }
  }

 
  /* 保存年度监测情况 */
  saveMiningMonitoring(){
    if(!this.validationYear){
      this.messageService.add({ key: 'tc', severity: 'warn', summary: '警告', detail: '年度监测情况年份不能为空'});
      return;
    }
   let monitoringInfo = {
      "executionStatus": this.miningMonitoring.executionStatus,
      "id": this.miningMonitoring.id,
      "problemFound": this.miningMonitoring.problemFound,
      "projectId": this.miningProject.id,
      "resourceMaintained": this.miningMonitoring.resourceMaintained,
      "resourceUsed": this.miningMonitoring.resourceUsed,
      "validationYear": this.validationYear?this.validationYear.getTime()/1000:0
    }

    if(this.modifyMonitoring){
      this.httpUtil.put('mineral-project-validation', monitoringInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.monitoringDisplay = false;
          this.getMonitoring();
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
        }
      })
    }else{
      this.httpUtil.post('mineral-project-validation', monitoringInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.monitoringDisplay = false;
          this.getMonitoring();
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
        }
      })
    }
  }
/* 保存修改的采矿权项目 */
saveMiningProject(type){
  if(type ==='cancel'){
    this.miningProject = this.oldProjectInfo;
    this.miningDisplay = false;
    return;
  }
  if(!this.miningProject.projectName){
    this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '项目名称不能为空'});
    return;
  }
  if(typeof(this.miningProject.areaCoordinates)==='object'){
    this.miningProject.areaCoordinates =  JSON.stringify(this.miningProject.areaCoordinates);
  }
  this.miningProject.miningStartTime = this.miningStartTime?this.miningStartTime.getTime()/1000:0;
 
   /* 修改项目信息 */
   this.httpUtil.put('mineral-project',this.miningProject).then(value=>{
    if (value.meta.code === 6666) {
      this.miningProject.miningStartTime = new Date(this.miningStartTime).toLocaleDateString().replace(/\//g, "-");
      for(let i in  this.mineralOwner){
        if(this.miningProject.ownerId ==  this.mineralOwner[i].id){
          this.miningProject['ownerName'] = this.mineralOwner[i].ownerName;
        }
      }
      this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
      this.miningDisplay = false;
    } else {
      this.messageService.add({ key: 'tc', severity: 'error', summary: '信息', detail: value.meta.msg });
      return;
    }
  })
}

  /* 返回到探矿权项目首页 */
  goBack(){
    this.router.navigate(['/layout/miningRight/miningInfo']);
    this.explorationInfoService.goBack();
  }

  pageChange(event,type){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    this.showLoading = true;
    switch(type){
      case 'stage':
        this.getStageInfo()
        break;
      case 'validation'://年度监测
        
        this.getMonitoring();
        break; 
    }
    
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
      addLocationArea: false,
      mineralProject: this.miningProject
    },
  });
}
}
