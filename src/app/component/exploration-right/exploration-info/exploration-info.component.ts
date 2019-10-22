import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { HttpUtil } from '../../../common/util/http-util';
import { ExplorationProject,ExplorationStage,ExplorationReport } from '../../../common/util/app-config';

import { ExplorationInfoService } from './exploration-info.service';

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
  explorationItems: MenuItem[];//探矿权详情tab也标题

  explorationDetailTitle;//勘查详情标题
  explorationDetailValue;//勘查详情内容
  projectDetailDisplay = false;//项目tab页是否显示
  stageDetailDisplay = false;//勘查阶段tab页是否显示
  reportDetailDisplay = false;//矿权报告tab页是否显示
  explorationtDisplay = false;//探矿权项目(增加、删除)弹出框是否显示
  stageDisplay = false;//勘查阶段详情(增加、删除)弹出框是否显示
  explorationProject: ExplorationProject = new ExplorationProject();//一条探矿权项目数据
  modifyExploration = false;//是否修改探矿权
  oldProjectInfo;//项目信息修改之前的值
  explorationStartTime;//探矿权首立时间
  miningStartTime;//采矿权首立时间
  mineralOwner:any[] = [];//矿权人
  explorationStage: ExplorationStage = new ExplorationStage();//勘查阶段单行数据
  stageStartTime;//勘查阶段开始时间
  stageEndTime;//勘查阶段结束时间
  modifyStage = false;//是否修改勘查阶段信息
  reportCategory;//报告分类数据

  reportClassifyTitle;//探矿权报告列表标题
  reportClassifyValue;//探矿权报告列表数据
  explorationReport: ExplorationReport = new ExplorationReport();//探矿权报告单条数据
  reportDisplay = false;//探矿权报告弹出框是否显示
  reportFileDisplay = false;//查看探矿权报告文件
  modifyReport = false;//是否修改报告文件
  pdfDisplay = false;//显示pdf预览
  explorationTitle;//弹出框标题
  itemsExcel: MenuItem[];
  fileTree = [];//报告文件树形结构数据
  selectedFile = {
    label:'',
    filePath:'',
    children:[]
  };//弹出框选择的文件 
  viewFileDisplay = false;//预览页面是否显示
  fileType;//文件类型

  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private explorationInfoService: ExplorationInfoService) { }

  ngOnInit() {
    this.setTableValue();
  }

  //初始化表格
  public setTableValue(){
    
    this.explorationInfoTitle=[
      { field: 'projectName', header: '项目名称' },
      { field: 'owner_id', header: '矿权人' },
      { field: 'explorationStartTime', header: '探矿权首立时间' },
      { field: 'explorationArea', header: '矿权范围' },
      { field: 'operation', header: '操作' }
    ];
    this.explorationItems = [
      {label: '项目详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '勘查阶段详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '探矿权报告', icon: 'fa fa-fw fa-bar-chart'}
    ];
    this.explorationDetailTitle = [
      { field: 'investigationStartTime', header: '开始时间' },
      { field: 'investigationEndTime', header: '结束时间' },
      { field: 'projectArea', header: '矿权范围' },
      { field: 'investigationOrganization', header: '勘查单位' },
      { field: 'investigationCategory', header: '类别' },
      { field: 'investigationArea', header: '面积' },
      { field: 'investigationMineralType', header: '勘查矿种' },
      { field: 'investigationStage', header: '勘查阶段' },
      { field: 'investigationWorkload', header: '工作量' },
      { field: 'investigationInvestment', header: '投入金额' },
      { field: 'ownerId', header: '矿权人' },
      { field: 'operation', header: '操作' },
    ];
    this.reportClassifyTitle = [
      { field: 'reportCategoryId', header: '报告分类名称' },
      { field: 'reportTime', header: '报告日期' },
      { field: 'reportFilePath', header: '报告文件路径' },
      { field: 'reportDescription', header: '文件详情描述' },
      { field: 'reportUploader', header: '文件上传用户' },
      { field: 'creationTime', header: '报告上传日期' },
      { field: 'updateTime', header: '报告更新日期' },
      { field: 'operation', header: '操作' }
    ];
    
    this.getExplorationInfo();
    this.getMineralOwner();
    this.getReportCategory();
  }

  /* 获取探矿权项目数据 */
  getExplorationInfo(){
    this.httpUtil.get('mineral-project/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i in data){
          data[i].explorationStartTime =  new Date(data[i].explorationStartTime*1000).toLocaleDateString().replace(/\//g, "-");
        }
        
        this.explorationInfoValue = data;
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

  /* 获取勘查阶段详情 */
  getStageInfo(){
    /* 获取探矿权勘查阶段详情 */
    this.httpUtil.get('mineral-explore-stage/project/'+this.explorationProject.id).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.stageInfos;
        for(let i in data){
          data[i].investigationStartTime =  new Date(data[i].investigationStartTime*1000).toLocaleDateString().replace(/\//g, "-");
          data[i].investigationEndTime =  new Date(data[i].investigationEndTime*1000).toLocaleDateString().replace(/\//g, "-");
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
  /* 获取报告分类 */
  getReportCategory(){
    this.httpUtil.get('mineral-project-category/list/1/1000').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.projectReports.list;
        for(var i = data.length - 1; i >= 0; i--){
          data[i]['label'] = data[i].reportCategory;
          data[i]['value'] = data[i].id;
          if(data[i].reportType!==1){
              data.splice(i,1);
          }
        }
        this.reportCategory = data;
      }
    })
  }

  /* 获取矿权报告 */
  getReportClassify(){
    this.httpUtil.get('mineral-project-report/project/'+this.explorationProject.id).then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.reportInfos;
          for(let i in data){
            data[i].reportTime =  new Date(data[i].reportTime*1000).toLocaleDateString().replace(/\//g, "-");
            data[i].creationTime =  new Date(data[i].creationTime*1000).toLocaleDateString().replace(/\//g, "-");
            data[i].updateTime =  new Date(data[i].updateTime*1000).toLocaleDateString().replace(/\//g, "-");
            for(let j in this.reportCategory){
              if(data[i].reportCategoryId ===this.reportCategory[j].value){
                data[i].reportCategoryId = this.reportCategory[j].reportCategory;
              }

            }
          }
          //删除不是探矿权分类的报告
          for(var i = data.length - 1; i >= 0; i--){
            if(typeof(data[i].reportCategoryId)=='number'){
              data.splice(i,1);
            }
          }
          this.reportClassifyValue = data;
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
  goDetails(data){
    this.explorationInfoTableDisplay = true;
    this.projectDetailDisplay = true;
    this.explorationProject = data;
    this.getStageInfo();
    this.getReportClassify();
  }

  /* 点击详情页面切换按钮 */
  menuClick(event){
      if(event.path[0].innerText ==='项目详情'){
        this.projectDetailDisplay = true;
        this.reportDetailDisplay = false;
        this.stageDetailDisplay = false;
        this.reportFileDisplay = false;
        this.explorationInfoService.getReportFile(false);
      }else if(event.path[0].innerText ==='勘查阶段详情'){
        this.stageDetailDisplay = true;
        this.projectDetailDisplay = false;
        this.reportDetailDisplay = false;
        this.reportFileDisplay = false;
        this.explorationInfoService.getReportFile(false);
      }else if(event.path[0].innerText ==='探矿权报告'){
        this.reportDetailDisplay = true
        this.explorationInfoService.getReportFile(true);
        this.projectDetailDisplay = false;
        this.stageDetailDisplay = false;
      }
  }

  /* 编辑项目详情 */
  modifyProject(){
    this.modifyExploration = true;
    this.explorationtDisplay = true;
    this.oldProjectInfo = JSON.parse(JSON.stringify(this.explorationProject));
    this.explorationStartTime = new Date(this.explorationProject.explorationStartTime);
    this.miningStartTime = new Date(this.explorationProject.miningStartTime);
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
      this.stageStartTime = new Date(value.investigationStartTime);
      this.stageEndTime = new Date(value.investigationEndTime);
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

    /* 报告文件的增加 */
    if(type==='addReport'){
      this.reportDisplay = true;
      this.explorationReport = new ExplorationReport();
      this.modifyReport = false;
      this.explorationTitle = '增加探矿权文件';
      return;
    }
    /* 报告文件修改 */
    if(type==='modifyReport'){
      this.modifyReport = true;
      this.reportDisplay = true;
      this.explorationTitle = '修改探矿权文件('+value.reportCategoryId+')';
      this.explorationReport = JSON.parse(JSON.stringify(value));
      this.explorationReport.reportTime = new Date(this.explorationReport.reportTime);
      for(let i in this.reportCategory){
        if(this.reportCategory[i].label == this.explorationReport.reportCategoryId){
          this.explorationReport.reportCategoryId = this.reportCategory[i].value;
        }
      }
      return;
    }
    /* 查看报告文件 */
    if(type==='viewReport'){
      /* 获取文件 */
      value.reportFilePath;
      this.reportFileDisplay = true;
      this.selectedFile = {
        label:'',
        filePath:'',
        children:[]
      };
      this.fileTree = [];
      this.httpUtil.post('mineral-project-report/file',{
        filePath:'00.行业规范'
      }).then(value=>{
        if (value.meta.code === 6666) {
            let data = value.data.fileList;
            let fileInfo = [];
            for(let i in data){
            let dataList= data[i].replace(/^\/|\/$/g, "").split('/');
            if(dataList.length==1){
        
              this.fileTree.push({
                label: dataList[dataList.length-1],
                ExpandedIcon: 'fa fa-folder-open',
                children:[]  
              })
            }else{
              fileInfo.push({
                id:dataList[dataList.length-1],
                pid: dataList[dataList.length-2],
                filePath: data[i],
                label:dataList[dataList.length-1]
              })
            }
            
            }

            this.fileTree[0].children=this.getFileInfo(fileInfo,this.fileTree[0].label);
    
        }
      })
      return;
    }
    /* 报告文件的删除 */
    if(type==='deleteReport'){
      this.confirmationService.confirm({
        message: '确认删除该文件吗?',
        header: '删除文件',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-project-report/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.getReportClassify();
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
            }
          })
        },
        reject: () => {
        
        }
      });
      return;
    }
    /* 增加矿权项目 */
    if(type ==='add'){
      this.modifyExploration = false;
      this.explorationProject = new ExplorationProject();
      this.explorationStartTime = '';
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
    let projectInfo = {
      "areaGeologicBackground": this.explorationProject.areaGeologicBackground,
      "explorationArea": this.explorationProject.explorationArea,
      "explorationStartTime": this.explorationStartTime.getTime()/1000,
      "geophysicalGeochemical": this.explorationProject.geophysicalGeochemical,
      "investigationFinalStage": this.explorationProject.investigationFinalStage,
      "majorAchievement": this.explorationProject.majorAchievement,
      "mineralBeltGeologic": this.explorationProject.mineralBeltGeologic,
      "mineralBeltOwner": this.explorationProject.mineralBeltOwner,
      "mineralCharacteristics": this.explorationProject.mineralCharacteristics,
      "mineralGeologicalMagmatite": this.explorationProject.mineralGeologicalMagmatite,
      "mineralGeologicalStratum": this.explorationProject.mineralGeologicalStratum,
      "mineralGeologicalStructure": this.explorationProject.mineralGeologicalStructure,
      "miningArea": this.explorationProject.miningArea,
      "miningStartTime":this.miningStartTime.getTime()/1000,
      "preliminaryUnderstanding": this.explorationProject.preliminaryUnderstanding,
      "projectName": this.explorationProject.projectName,
      "remarks": this.explorationProject.remarks,
      "rockAlteration": this.explorationProject.rockAlteration,
      "id": this.explorationProject.id
    };
    if(this.modifyExploration){
      /* 修改项目信息 */
        this.httpUtil.put('mineral-project',projectInfo).then(value=>{
          if (value.meta.code === 6666) {
            this.explorationProject.explorationStartTime = new Date(this.explorationStartTime).toLocaleDateString().replace(/\//g, "-");
            this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
            this.explorationtDisplay = false;
          }
        })
    }else{
      /* 增加探矿权项目 */
      this.httpUtil.post('mineral-project',projectInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          this.explorationtDisplay = false;
          this.getExplorationInfo();
        }
      })
    }
  }

  /* 勘查阶段保存 */
  saveExplorationStage(){
      let stageInfo = {
        "id": this.explorationStage.id,
        "projectId": this.explorationProject.id,//矿权项目ID，
        "ownerId": this.explorationStage.ownerId,//矿权人ID
        "investigationStartTime": this.stageStartTime.getTime()/1000,//开始时间
        "investigationEndTime": this.stageEndTime.getTime()/1000,//结束时间
        "projectArea": this.explorationStage.projectArea,//矿权范围
        "investigationOrganization": this.explorationStage.investigationOrganization,//勘查单位
        "investigationCategory": this.explorationStage.investigationCategory,//类别  
        "investigationArea": parseInt(this.explorationStage.investigationArea.toString()),//勘查面积
        "investigationMineralType": this.explorationStage.investigationMineralType,//勘查矿种
        "investigationStage": this.explorationStage.investigationStage,//勘查阶段
        "investigationWorkload": this.explorationStage.investigationWorkload,//勘查工作量
        "investigationInvestment":  parseInt(this.explorationStage.investigationInvestment.toString())//勘查投入金额
      }
      if(this.modifyStage){
        this.httpUtil.put('mineral-explore-stage',stageInfo).then(value=>{
          if (value.meta.code === 6666) {
            this.stageDisplay = false;
            this.getStageInfo();
            this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
            
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

  pageChange(event,type){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    switch(type){
      case 'project':
        this.getExplorationInfo();
        break;
      case 'stage':
        this.getStageInfo()
        break;
      case 'report':
        this.getReportClassify();
        break; 
    }
    
  }

  
}
