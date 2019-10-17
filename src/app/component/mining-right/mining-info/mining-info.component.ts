import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { HttpUtil } from '../../../common/util/http-util';
import { ExplorationProject,MiningMonitoring,ExplorationReport, MiningStage } from '../../../common/util/app-config';
import * as XLSX from 'xlsx';
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
  miningInfoTableDisplay = false;//探矿权信息列表是否显示
  miningItems: MenuItem[];//探矿权详情tab也标题
  miningProject: ExplorationProject = new ExplorationProject();//一条矿权项目数据
  miningStage: MiningStage = new MiningStage();//排查阶段单行数据
  miningMonitoring: MiningMonitoring = new MiningMonitoring();//年度监测报告单条数据
  explorationReport: ExplorationReport= new ExplorationReport();//采矿权报告单条数据
  projectDetailDisplay = false;//项目tab页是否显示
  stageDetailDisplay = false;//排查阶段tab页是否显示
  monitoringDetailDisplay = false;//监测报告tab页是否显示
  reportDetailDisplay = false;//采矿权报告tab页
  mineralOwner:any[] = [];//矿权人
  stageDetailTitle;//排查详情标题
  stageDetailValue;//排查详情内容
  reportCategory;//报告分类
  monitoringTitle;//年度监测报告列表标题
  monitoringValue;//年度监测报告列表数据
  miningDisplay = false;//采矿权项目修改弹出框
  oldProjectInfo;//项目信息修改之前的值
  miningStartTime;//采矿权首立时间
  reportFileDisplay = false;//查看采矿权报告文件
  modifyStage = false;//是否修改排查阶段信息
  stageDisplay = false;//排查阶段详情(增加、删除)弹出框是否显示
  stageStartTime;//排查阶段开始时间
  stageEndTime;//排查阶段结束时间
  monitoringDisplay=false;//年度监测报告是否显示
  modifyMonitoring = false;//修改年度监测报告
  reportClassifyTitle;//采矿权报告列表标题
  reportClassifyValue;//采矿权报告列表数据
  reportDisplay = false;//采矿权报告弹出框是否显示
  modifyReport = false;//是否修改报告文件
  pdfDisplay = false;//查看PDF文件
  miningTitle;//弹出框标题

  constructor(private httpUtil: HttpUtil,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.setTableValue();
  }

  //初始化表格
  public setTableValue(){
    
    this.miningInfoTitle=[
      { field: 'projectName', header: '项目名称' },
      { field: 'owner_id', header: '矿权人' },
      { field: 'miningStartTime', header: '采矿权首立时间' },
      { field: 'miningArea', header: '矿权范围' },
      { field: 'operation', header: '操作' }
    ];
    this.miningItems = [
      {label: '项目详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '排查阶段详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '年度监测报告', icon: 'fa fa-fw fa-bar-chart'},
      {label: '采矿权报告', icon: 'fa fa-fw fa-bar-chart'}
    ];
    this.stageDetailTitle = [
      { field: 'miningStartTime', header: '开始时间' },
      { field: 'miningEndTime', header: '结束时间' },
      { field: 'projectArea', header: '矿权范围' },
      { field: 'miningMineralType', header: '开采矿种' },
      { field: 'miningProductionScale', header: '生产规模' },
      { field: 'miningArea', header: '开采面积' },
      { field: 'miningWorkload', header: '开采投入工作量' },
      { field: 'miningInvestment', header: '开采投入金额' },
      { field: 'ownerId', header: '矿权人' },
      { field: 'operation', header: '操作' },
    ];
    this.monitoringTitle = [
      { field: 'validationYear', header: '监测报告年份' },
      { field: 'resourceUsed', header: '年度动用资源量' },
      { field: 'resourceMaintained', header: '年末保有资源量' },
      { field: 'executionStatus', header: '执行情况' },
      { field: 'problemFound', header: '监测过程发现的其它问题' },
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
    this.getMiningInfo();
    this.getMineralOwner();
    this.getReportCategory();
  }

  /* 获取采矿权项目数据 */
  getMiningInfo(){
    this.httpUtil.get('mineral-project/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i in data){
          data[i].miningStartTime =  new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-");
        }
        
        this.miningInfoValue = data;
      }
    });
  }

  /* 获取排查阶段详情 */
  getStageInfo(){
    /* 获取采矿权排查阶段详情 */
    this.httpUtil.get('mineral-mining-stage/project/'+this.miningProject.id).then(value=>{
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
        this.stageDetailValue = data;
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
          if(data[i].reportType!==2){
              data.splice(i,1);
          }
        }
        this.reportCategory = data;
      }
    })
  }
  /* 获取年度监测报告 */
  getMonitoring(){
    this.httpUtil.get('mineral-project-validation/project/'+this.miningProject.id).then(value=>{
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
          this.monitoringValue = data;
      }
    })
  }

   /* 获取矿权报告 */
   getReportClassify(){
    this.httpUtil.get('mineral-project-report/project/'+this.miningProject.id).then(value=>{
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
          //删除不是采矿权分类的报告
          for(var i = data.length - 1; i >= 0; i--){
            if(typeof(data[i].reportCategoryId)=='number'){
              data.splice(i,1);
            }
          }
          this.reportClassifyValue = data;
      }
    })
  }
  /* 查看项目详情 */
  goDetails(data){
    this.miningInfoTableDisplay = true;
    this.projectDetailDisplay = true;
    this.miningProject = data;
    this.getStageInfo();
    this.getReportClassify();
    this.getMonitoring();
  }

  /* 编辑项目详情 */
  modifyProject(){
    this.miningDisplay = true;
    this.miningTitle = '编辑项目';
    this.oldProjectInfo = JSON.parse(JSON.stringify(this.miningProject));
    this.miningStartTime = new Date(this.miningProject.miningStartTime);
  }


  /* 保存修改的采矿权项目 */
  saveMiningProject(type){
    if(type ==='cancel'){
      this.miningProject = this.oldProjectInfo;
      this.miningDisplay = false;
      return;
    }
    
    let projectInfo = {
      "areaGeologicBackground": this.miningProject.areaGeologicBackground,
      "explorationArea": this.miningProject.explorationArea,
      "explorationStartTime": this.miningProject.explorationStartTime,
      "geophysicalGeochemical": this.miningProject.geophysicalGeochemical,
      "investigationFinalStage": this.miningProject.investigationFinalStage,
      "majorAchievement": this.miningProject.majorAchievement,
      "mineralBeltGeologic": this.miningProject.mineralBeltGeologic,
      "mineralBeltOwner": this.miningProject.mineralBeltOwner,
      "mineralCharacteristics": this.miningProject.mineralCharacteristics,
      "mineralGeologicalMagmatite": this.miningProject.mineralGeologicalMagmatite,
      "mineralGeologicalStratum": this.miningProject.mineralGeologicalStratum,
      "mineralGeologicalStructure": this.miningProject.mineralGeologicalStructure,
      "miningArea": this.miningProject.miningArea,
      "miningStartTime":this.miningStartTime.getTime()/1000,
      "preliminaryUnderstanding": this.miningProject.preliminaryUnderstanding,
      "projectName": this.miningProject.projectName,
      "remarks": this.miningProject.remarks,
      "rockAlteration": this.miningProject.rockAlteration,
      "id": this.miningProject.id
    };
     /* 修改项目信息 */
     this.httpUtil.put('mineral-project',projectInfo).then(value=>{
      if (value.meta.code === 6666) {
        this.miningProject.miningStartTime = new Date(this.miningStartTime).toLocaleDateString().replace(/\//g, "-");
        this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
        this.miningDisplay = false;
      }
    })
  }

  /* 点击详情页面切换按钮 */
  menuClick(event){
    if(event.path[0].innerText ==='项目详情'){
      this.projectDetailDisplay = true;
      this.monitoringDetailDisplay = false;
      this.stageDetailDisplay = false;
      this.reportFileDisplay = false;
      this.reportDetailDisplay = false;
    }else if(event.path[0].innerText ==='排查阶段详情'){
      this.stageDetailDisplay = true;
      this.projectDetailDisplay = false;
      this.monitoringDetailDisplay = false;
      this.reportFileDisplay = false;
      this.reportDetailDisplay = false;
    }else if(event.path[0].innerText ==='年度监测报告'){
      this.monitoringDetailDisplay = true;
      this.projectDetailDisplay = false;
      this.stageDetailDisplay = false;
      this.reportDetailDisplay = false;
    }else if(event.path[0].innerText ==='采矿权报告'){
      this.stageDetailDisplay = false;
      this.projectDetailDisplay = false;
      this.monitoringDetailDisplay = false;
      this.reportFileDisplay = false;
      this.reportDetailDisplay = true;
    }
  }

  /* 采矿权、排查阶段、监测报告阶段的操作 */
  setMining(type,value?){
    //增加排查详情
    if(type=='addStage'){
      this.modifyStage = false;
      this.stageDisplay = true;
      this.miningStage = new MiningStage();
      this.stageEndTime = '';
      this.stageStartTime = '';
      this.miningTitle = '增加排查阶段';
      return;
    }
    //修改排查详情
    if(type==='modifyStage'){
      this.stageDisplay = true;
      this.modifyStage = true;
      this.miningTitle = '修改排查阶段';
      this.miningStage = JSON.parse(JSON.stringify(value));  
      this.stageStartTime = new Date(value.investigationStartTime);
      this.stageEndTime = new Date(value.investigationEndTime);
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
        header: '删除排查阶段信息',
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

    /* 年度监测报告增加 */
    if(type =='addMonitoring'){
        this.monitoringDisplay = true;
        this.miningTitle = '增加监测报告';
        this.miningMonitoring = new MiningMonitoring();
        this.modifyMonitoring = false;
        return;
    }
    /* 年度监测报告修改 */
    if(type =='modifyMonitoring'){
      this.monitoringDisplay = true;
      this.miningTitle = '修改监测报告';
      this.miningMonitoring = new MiningMonitoring();
      this.modifyMonitoring = false;
      return;
    }


    
    /* 报告文件的增加 */
    if(type==='addReport'){
      this.reportDisplay = true;
      this.miningTitle = '增加报告文件';
      this.explorationReport = new ExplorationReport();
      this.modifyReport = false;
      return;
    }
    /* 报告文件修改 */
    if(type==='modifyReport'){
      this.modifyReport = true;
      this.reportDisplay = true;
      this.miningTitle = '修改报告文件('+value.reportCategoryId+')';
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
      this.reportFileDisplay = true;
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
  }

  /* 排查阶段保存 */
  saveMiningStage(){
    let stageInfo = {
      "id": this.miningStage.id,
      "projectId": this.miningProject.id,//矿权项目ID，
      "ownerId": this.miningStage.ownerId,//矿权人ID
      "miningStartTime": this.stageStartTime.getTime()/1000,//开始时间
      "miningEndTime": this.stageEndTime.getTime()/1000,//结束时间
      "projectArea": this.miningStage.projectArea,//矿权范围
      "miningMineralType": this.miningStage.miningMineralType,//开采矿种
      "miningProductionScale": this.miningStage.miningProductionScale,//生产规模  
      "miningArea": parseInt(this.miningStage.miningArea.toString()),//开采面积
      "miningWorkload": this.miningStage.miningWorkload,//开采投入工作量
      "miningInvestment": parseInt(this.miningStage.miningInvestment.toString())//开采投入金额
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

  /*保存采矿权文件  */
  saveMiningReport(){
    let reportInfo = {
      "id":this.explorationReport.id,
      "creationTime": new Date().getTime()/1000,
      "projectId": this.miningProject.id,
      "reportCategoryId": this.explorationReport.reportCategoryId,
      "reportDescription": this.explorationReport.reportDescription,
      "reportFilePath": "string",
      "reportTime":  this.explorationReport.reportTime.getTime()/1000,
      "reportUploader": "string",
      "updateTime": new Date().getTime()/1000
    };
    if(this.modifyReport){
      reportInfo.creationTime = new Date(this.explorationReport.creationTime).getTime()/1000;
      this.httpUtil.put('mineral-project-report',reportInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.reportDisplay =false;
          this.getReportClassify();
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
        }
      })
    }else{
      this.httpUtil.post('mineral-project-report',reportInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.reportDisplay =false;
          this.getReportClassify();
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
        }
      })
    }
  }

  /* 保存年度监测报告 */
  saveMiningMonitoring(){
   let monitoringInfo = {
      "executionStatus": this.miningMonitoring.executionStatus,
      "id": this.miningMonitoring.id,
      "problemFound": this.miningMonitoring.problemFound,
      "projectId": this.miningProject.id,
      "resourceMaintained": this.miningMonitoring.resourceMaintained,
      "resourceUsed": this.miningMonitoring.resourceUsed,
      "validationYear": this.miningMonitoring.validationYear.getTime()/1000
    }

    if(this.modifyMonitoring){
      this.httpUtil.put('mineral-project-validation', monitoringInfo).then(value=>{

      })
    }else{
      this.httpUtil.post('mineral-project-validation', monitoringInfo).then(value=>{

      })
    }
  }

  //查看PDF
  public lookPDF(){
    PDFObject.embed("./assets/js/房源表.pdf","#example-pdf");
    document.getElementById('result').innerHTML ='';
    this.pdfDisplay =true;
    
  }

  /* ecxcel文件预览 */
  
  excelChange(){
    var xhr = new XMLHttpRequest();
    xhr.open('get', './assets/js/矿权排查表王文义(1)(1).xlsx', true);
    xhr.responseType = 'arraybuffer';
    let that =this;
    xhr.onload = function(e) {
        if(xhr.status == 200) {
            var data = new Uint8Array(xhr.response)
            var workbook = XLSX.read(data, {type: 'array'});
            that.outputWorkbook(workbook)
           // if(callback) callback(workbook);
        }
    };
    xhr.send();
  }
  outputWorkbook(workbook) {
    var sheetNames = workbook.SheetNames; // 工作表名称集合
   
    for(let i in sheetNames){
      var worksheet = workbook.Sheets[sheetNames[i]];
      var csv = XLSX.utils.sheet_to_csv(worksheet);
      document.getElementById('result').innerHTML += this.csv2table(csv,sheetNames[i]);
     
    }
    this.pdfDisplay = true;
    document.getElementById('example-pdf').innerHTML ='';
  }
  
  csv2table(csv,title){
      var html = "<div>"+title+"</div><table class='table table-bordered'>";
      var rows = csv.split('\n');
      rows.pop(); // 最后一行没用的
  /*     this.thead = rows[0];
      this.data = rows.slice(1);
      this.pdfDisplay = true; */
      
      rows.forEach(function(row, idx) {
          var columns = row.split(',');
          columns.unshift(idx+1); // 添加行索引
          if(idx == 0) { // 添加列索引
              html += '<thead><tr>';
              for(var i=0; i<columns.length; i++) {
                  html += '<th>' + (i==0?'':String.fromCharCode(65+i-1)) + '</th>';
              }
              html += '</tr></thead>';
          }
          html += '<tbody><tr>';
          columns.forEach(function(column) {
              html += '<td>'+column+'</td>';
          });
          html += '</tr></tbody>';
      });
      html += '</table>';
      return html;
  }

  pageChange(event,type){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    switch(type){
      case 'project':
        this.getMiningInfo();
        break;
      case 'stage':
        this.getStageInfo()
        break;
      case 'monitoring'://年度监测
        
        this.getMonitoring();
        break; 
      case 'report'://矿权报告
        this.getReportClassify();
        break;
    }
    
  }
}
