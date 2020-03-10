import { Component, OnInit, Input } from '@angular/core';
import { ExplorationInfoService } from '../exploration-info.service';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { ExplorationReport } from '../../../../common/util/app-config';
import { HttpUtil } from '../../../../common/util/http-util';
import * as XLSX from 'xlsx';
import { HttpUrl } from '../../../../common/util/http-url';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../../login/login.service';
import { setTime } from '../../../../common/util/app-config';
declare let PDFObject,$,Tiff;

@Component({
  selector: 'app-report-file',
  templateUrl: './report-file.component.html',
  styleUrls: ['./report-file.component.scss']
})
export class ReportFileComponent implements OnInit {
  @Input() reportCategory;
  @Input() explorationProject;
  @Input() type;
  @Input() buttonType;
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数
  reportDetailDisplay = false;//报告文件页面
  reportClassifyTitle;//矿权报告列表标题
  reportClassifyValue;//矿权报告列表数据
  explorationReport: ExplorationReport = new ExplorationReport();//探矿权报告单条数据
  reportDisplay = false;//探矿权报告弹出框是否显示
  reportFileDisplay = false;//查看探矿权报告文件
  modifyReport = false;//是否修改报告文件
  pdfDisplay = false;//显示pdf预览
  loadingDisplay = false;
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
  isInitialize = true;//预览按钮灰化
  imgUrl;//图片路径
  txtTable;//txt文件内容

  clickFolder = [];//点击的当前文件夹
  clickFolderPath=[];//文件夹路径
  fileTitle;//文件夹列表标题
  fileValue = [];//文件夹列表数据

  filePathType;//文件夹路径类型

  private reportFileCommon: Subscription;

  explorationItems: MenuItem[];//探矿权详情tab页标题

  addButton =false;//新增按钮显示
  modifyButton = false;//修改按钮显示
  viewButton = false;//查看文件按钮显示
  deleteButton = false;//删除按钮显示
  previewButton = false;//预览按钮显示

  startTime;//开始时间
  endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);//结束时间
  isClickSearch = false;//查询按钮点击
  reportNameLike;//搜索报告名称
  policyReportCategory;//政策报告分类
  selectFolderDisplay = false;//点击选择文件夹按钮
  reportFolderDisplay = false;//选择文件夹弹出框
  selectedFolder;//已选择的文件夹
  reportTotal;//报告文件总数
  policyReportDisplay = false;//是否是政策报告页面
  uploadedFiles = [];//上传文件
  fileUrl = localStorage.getItem('IP')+'mineral-policy/fileUpload';
  fileDisplay = false;//预览文件是否存在
  constructor(private explorationInfoService:ExplorationInfoService,
              private httpUtil: HttpUtil,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private router: Router,
              private loginService: LoginService) {
    this.reportFileCommon = this.explorationInfoService.reportFileCommon$.subscribe(value=>{
      
      if(value.type){
        this.reportDetailDisplay = true;
        this.reportCategory = value.reportCategory;
        this.explorationProject = value.explorationProject;
        this.getReportClassify();
      }else{
        this.reportDetailDisplay = false;
      }
    })
   }

  ngOnInit() {
    this.setTableValue();
  }
  ngOnDestroy(){
    this.reportFileCommon.unsubscribe();
  }

  /* 初始化页面 */
  setTableValue(){
    this.reportClassifyTitle = [
      { field: 'reportName', header: '报告名称' },
      { field: 'reportCategoryId', header: '报告分类名称' },
      { field: 'reportDescription', header: '文件详情描述' },
      { field: 'reportUploader', header: '文件上传用户' },
      { field: 'creationTime', header: '报告上传日期' },
      { field: 'updateTime', header: '报告更新日期' },
      /* { field: 'operation', header: '操作' } */
    ];
    this.explorationItems = [
      {label: '项目详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '勘查阶段详情', icon: 'fa fa-fw fa-bar-chart'},
      {label: '探矿权报告', icon: 'fa fa-fw fa-bar-chart'}
    ];
    this.fileTitle = [
      { field: 'name', header: '名称' },
      { field: 'fileType', header: '文件类型' },
      { field: 'operation', header: '操作' },
    ]
    this.itemsExcel =[
      {label: 'Stats', icon: 'fa fa-fw fa-bar-chart'}
    ]
    //获取授权的API资源
    if(!localStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(localStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/report-viewer/toPdfFile' && element.method =='POST'){
        this.previewButton =true;
      }
      if(element.uri ==='/mineral-policy/search/*/*' && element.method =='POST'){
        this.isClickSearch =true;
      } 
      //矿业权政策报告API资源
      if(this.type =='policy'){
        if(element.uri ==='/mineral-policy' && element.method =='POST'){
          this.addButton =true;
        }
        if(element.uri ==='/mineral-policy' && element.method =='PUT'){
          this.modifyButton =true;
        }
        if(element.uri ==='/mineral-policy/*' && element.method =='DELETE'){
          this.deleteButton =true;
        }
        if(element.uri ==='/mineral-policy/file' && element.method =='POST'){
          this.viewButton =true;
        }
      }else{
        if(element.uri ==='/mineral-project-report' && element.method =='POST'){
          this.addButton =true;
        }
        if(element.uri ==='/mineral-project-report' && element.method =='PUT'){
          this.modifyButton =true;
        }
        if(element.uri ==='/mineral-project-report/*' && element.method =='DELETE'){
          this.deleteButton =true;
        }
        if(element.uri ==='/mineral-project-report/file' && element.method =='POST'){
          this.viewButton =true;
        }
      }
      
      
    });

 
    this.startTime = new Date(this.endTime.getFullYear(), this.endTime.getMonth() - 3, this.endTime.getDate());
    if(this.type=='policy'){
      this.reportDetailDisplay = true;
      this.policyReportDisplay = true;
      this.getReportCategory();
      return;
    }
    
    
  }

  /* 获取矿权报告 */
  getReportClassify(){
    let reportType = '1';
    if(this.type=='mining'){
      reportType = '2'
    }
    this.httpUtil.get('mineral-project-report/project/'+this.explorationProject.id+'/'+reportType+'/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.reportInfos.list;
          this.reportTotal = value.data.reportInfos.total;
          for(let i=0; i<data.length;i++){
            
            
            data[i].creationTime =  data[i].creationTime?setTime(data[i].creationTime):'';
            data[i].updateTime =  data[i].updateTime?setTime(data[i].updateTime):'';
            data[i].reportCategoryId =  data[i].reportCategoryName;
            /* for(let j in this.reportCategory){
              if(data[i].reportCategoryId ===this.reportCategory[j].value){
                data[i].reportCategoryId = this.reportCategory[j].reportCategoryName;
              }

            } */
          }
          //删除不是该矿权分类的报告
          /* for(var i = data.length - 1; i >= 0; i--){
            if(typeof(data[i].reportCategoryId)=='number'){
              data.splice(i,1);
            }
          } */

          for(let i=0;i<data.length;i++){
            data[i].number = (this.startPage-1)*this.limit+i +1;
          }
          this.reportClassifyValue = data;
      }
    })
  }


  
   /* 获取矿业权报告分类 */
   getReportCategory(){
    this.httpUtil.get('mineral-report-category/type/0/1/1000').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.reportCategories.list;
        for(var i = data.length - 1; i >= 0; i--){
          data[i]['label'] = data[i].reportCategoryName;
          data[i]['value'] = data[i].id;
          if(data[i].reportType!==0){
              data.splice(i,1);
          }
        }
        this.reportCategory = data;
      }
    }).then(()=>{
      /* 获取矿业权政策报告 */
      this.httpUtil.get('mineral-policy/list/'+this.startPage+'/'+this.limit).then(value=>{
        if (value.meta.code === 6666) {
            let data = value.data.policies.list;
            this.reportTotal = value.data.policies.total;
            for(let i=0; i<data.length;i++){
           
              data[i].creationTime =  data[i].creationTime?setTime(data[i].creationTime):'';
              data[i].updateTime =  data[i].updateTime?setTime(data[i].updateTime):'';
              data[i].reportCategoryId =  data[i].reportCategoryName;
              /* for(let j in this.reportCategory){
                if(data[i].reportCategoryId ===this.reportCategory[j].value){
                  data[i].reportCategoryId = this.reportCategory[j].reportCategoryName;
                }
  
              } */
            }
            //删除不是矿业权权分类的报告
            /* 
            for(var i = data.length - 1; i >= 0; i--){
              if(typeof(data[i].reportCategoryId)=='number'){
                data.splice(i,1);
              }
            } */

            for(let i=0;i<data.length;i++){
              data[i].number = (this.startPage-1)*this.limit+i +1;
            }
            this.reportClassifyValue = data;
        }
      })
    })
  }

  /* 获取文件夹文件 */
  getReportFolder(filePath){
    this.httpUtil.post('mineral-project-report/folder',{
      filePath: filePath
    }).then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.fileList;
          let fileInfo = [];
          this.fileTree = [];
          if(data.length<1){
            this.fileValue = [];
            this.loadingDisplay = false;
            return;
          }
          for(let i in data){
            let path='';
            let dataList= data[i].replace(/^\/|\/$/g, "").split("\\");
            if(dataList.length>1){
              for(let j=1; j<dataList.length;j++){
                path += dataList[j]+this.filePathType;
              }
              this.filePathType = '\\';
            }else{
              dataList= data[i].replace(/^\/|\/$/g, "").split("/");
              for(let j=0; j<dataList.length;j++){
                path += dataList[j]+this.filePathType;
              }
              this.filePathType = '/';
            }
            
            
            this.fileTree.push({
              label: dataList[dataList.length-1],
              ExpandedIcon: 'fa fa-folder-open',
              path: path
            })
            
            /* if(dataList.length==2){
        
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
            } */
          
          }

          if(this.fileTree.length>0){
            for(let i in this.fileTree){
              //this.fileTree[i].children=this.getFileInfo(fileInfo,this.fileTree[i].label);
              this.fileTree[i].name = this.fileTree[i].label+'>';
              this.fileTree[i].fileType = '文件夹';
              this.fileTree[i].filePath = this.filePathType+this.fileTree[i].label;
              this.fileTree[i].path = this.filePathType+this.fileTree[i].path;
            }
            
            this.fileValue = this.fileTree;
          
          }
          this.loadingDisplay = false;
      }
    })
  }

  /* 查看文件 */
  getReportFile(reportFilePath){
    this.httpUtil.post('mineral-project-report/file',{
      filePath: reportFilePath
    }).then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.fileList;
          let fileInfo = [];
          this.fileTree = [];
          this.fileValue = [];
          for(let i in data){
            let dataList= data[i].replace(/^\/|\/$/g, "").split('\\');
            if(dataList.length>1){
              this.filePathType = '\\';
            }else{
              this.filePathType = '/';
              dataList= data[i].replace(/^\/|\/$/g, "").split('/');
            }
            let filePath='';
            for(let i =0;i<dataList.length;i++){
              
              if(i === dataList.length-1){
                filePath +=dataList[i];
              }else{
                filePath +=dataList[i]+'/';
              }
            }
            
            this.fileTree.push({
              label: dataList[dataList.length-1],
              ExpandedIcon: 'fa fa-folder-open',
              filePath:filePath,
              children:[]  
            })
            /* if(dataList.length==2){
        
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
            } */
          
          }

          if(this.fileTree[0]){
            this.fileTree=this.getFileInfo(this.fileTree);
            
            this.fileValue = this.fileTree;
          }
          
          
          this.loadingDisplay = false;
      }
    })
  }
  /* 矿权报告操作 */
  setExplorationt(type,value?){
    /* 报告文件的增加 */
    if(type==='addReport'){
      this.reportDisplay = true;
      this.uploadedFiles = [];
      this.explorationReport = new ExplorationReport();

      this.modifyReport = false;
      if(this.type=='exploration'){
        this.explorationTitle = '增加探矿权文件';
      }
      if(this.type=='mining'){
        this.explorationTitle = '增加采矿权文件';
      }
      if(this.type=='policy'){
        this.explorationTitle = '增加政策文件';
      }
      
      return;
    }
    /* 报告文件修改 */
    if(type==='modifyReport'){
      this.modifyReport = true;
      this.reportDisplay = true;
      if(this.type=='exploration'){
        this.explorationTitle = '修改探矿权文件('+value.reportCategoryId+')';
      }
      if(this.type=='mining'){
        this.explorationTitle = '修改采矿权文件('+value.reportCategoryId+')';
      }
      if(this.type=='policy'){
        this.explorationTitle = '修改政策文件('+value.reportCategoryId+')';
        this.uploadedFiles = [];
        this.uploadedFiles.push({
          name: value.reportFilePath.split('\\')[value.reportFilePath.split('\\').length-1]
        });

      }
      
      this.explorationReport = JSON.parse(JSON.stringify(value));
  
      for(let i in this.reportCategory){
        if(this.reportCategory[i].label == this.explorationReport.reportCategoryId){
          this.explorationReport.reportCategoryId = this.reportCategory[i].value;
        }
      }
      return;
    }
    /* 查看报告文件 */
    if(type==='viewReport'){
      
      //政策报告文件
      if(this.type=='policy'){
        this.previewFile(value);
        return;
      }
      /* 获取文件 */
      this.selectFolderDisplay = false;
      this.reportFileDisplay = true;
      this.loadingDisplay = true;
      this.selectedFile = {
        label:'',
        filePath:'',
        children:[]
      };
      this.fileTree = [];
      this.clickFolderPath = [{
        name:value.reportFilePath,
        path:value.reportFilePath+'>'
      }];
      this.loadingDisplay = true;
      this.getReportFile(value.reportFilePath);
      return;
    }
    /* 报告文件的删除 */
    if(type==='deleteReport'){
      let url = 'mineral-project-report/';
      if(this.type =='policy'){
          url = 'mineral-policy/';
      }
      this.confirmationService.confirm({
        message: '确认删除该报告吗?',
        header: '删除报告',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete(url+value.id).then(value=>{
            if (value.meta.code === 6666) {
              if(this.type =='policy'){
                this.getReportCategory();
              }else{
                this.getReportClassify();
              }
              
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
            }
          })
        },
        reject: () => {
        
        }
      });
      return;
    }

    /* 矿业权、政策报告的搜索 */
    if(type=='filtered'){
      let info,url;
      if(this.policyReportDisplay){
        info={
          "reportNameLike": this.reportNameLike?this.reportNameLike:'',
          "reportEndTime": parseInt((this.endTime.getTime()/1000).toString())+86399,
          "reportStartTime": parseInt((this.startTime.getTime()/1000).toString())
        };
        url = 'mineral-policy/search/';
      }else{
        info = {
          "reportType": this.type=='mining'?2:1,
          "projectId": this.explorationProject.id,
          "reportNameLike": this.reportNameLike?this.reportNameLike:'',
          "reportEndTime": parseInt((this.endTime.getTime()/1000).toString())+86399,
          "reportStartTime": parseInt((this.startTime.getTime()/1000).toString()),
        };
       
        url = 'mineral-project-report/search/';
      }
      this.httpUtil.post(url+this.startPage+'/'+this.limit,info).then(value=>{
        if (value.meta.code === 6666) {
          let data;
          if(this.policyReportDisplay){
            data= value.data.policies.list;
            this.reportTotal = value.data.policies.total;
          }else{
            data= value.data.reportInfos.list;
            this.reportTotal = value.data.reportInfos.total;
          }
          
          for(let i=0; i<data.length;i++){
            
      
            data[i].creationTime =  data[i].creationTime?setTime(data[i].creationTime):'';
            data[i].updateTime =  data[i].updateTime?setTime(data[i].updateTime):'';
            data[i].reportCategoryId =  data[i].reportCategoryName;
            /* for(let j in this.reportCategory){
              if(data[i].reportCategoryId ===this.reportCategory[j].value){
                data[i].reportCategoryId = this.reportCategory[j].reportCategoryName;
              }

            } */
          }
          //删除不是政策的报告
          /* for(var i = data.length - 1; i >= 0; i--){
            if(typeof(data[i].reportCategoryId)=='number'){
              data.splice(i,1);
            }
          } */
          for(let i=0;i<data.length;i++){
            data[i].number = (this.startPage-1)*this.limit+i +1;
          }
          this.reportClassifyValue = data;
      }
      })
    }
  }

  /* 将报告文件整理成树形结构 */
  getFileInfo(data){

    for(var i in data){
        let fileType = data[i].label.split('.')[data[i].label.split('.').length-1];
        let isInitialize = false;
        switch(fileType){
          case 'doc':
          case 'docx':
          case 'pptx':
            isInitialize = true;
            break;
          case 'png':
            isInitialize = true;
            break;
          case 'jpg':
            isInitialize = true;
            break;  
          case 'pdf':
            isInitialize = true;
            break;  
          case 'xlsx':
            isInitialize = true;
            break;  
          case 'txt':
            isInitialize = true;
            break;   
          case 'tif':
            isInitialize = true;
            break;     
        }
        if(isInitialize){
          data[i]['fileType']='文件';
          data[i]['file']= true;
          data[i].name =  data[i].label;
        }else{
          data[i]['fileType']='文件夹';
          data[i]['file'] = false;
          data[i].name =  data[i].label +'>';
          data[i]['filePath'] = this.filePathType+data[i].label;
        }
 
    }
    return data;
    
  }

  
  /* 保存探矿权报告 */
  saveExplorationReport(){
    if(!this.explorationReport.reportName){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '报告名称不能为空'});
      return;
    }
    if(!this.explorationReport.reportCategoryId){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '报告分类不能为空'});
      return;
    }
    if(!this.explorationReport.reportFilePath){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '报告路径不能为空'});
      return;
    }
    let reportInfo = {
      "id":this.explorationReport.id,
      "creationTime": parseInt((new Date().getTime()/1000).toString()),
      "reportCategoryId": this.explorationReport.reportCategoryId,
      "reportDescription": this.explorationReport.reportDescription?this.explorationReport.reportDescription:'',
      "reportFilePath": this.explorationReport.reportFilePath?this.explorationReport.reportFilePath:'',
      "reportName": this.explorationReport.reportName,
      "reportUploader": localStorage.getItem('uid'),
      "updateTime": parseInt((new Date().getTime()/1000).toString())
    };
    let url = 'mineral-policy';
    if(this.type!=='policy'){
      reportInfo['projectId']=this.explorationProject.id;
      url = 'mineral-project-report';
    }
    
    if(this.modifyReport){
      reportInfo.creationTime = new Date(this.explorationReport.creationTime).getTime()/1000;
      this.httpUtil.put(url,reportInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.reportDisplay =false;
          if(this.type =='policy'){
            this.getReportCategory();
          }else{
            this.getReportClassify();
          }
          
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
        }
      })
    }else{
      this.httpUtil.post(url,reportInfo).then(value=>{
        if (value.meta.code === 6666) {
          this.reportDisplay =false;
          if(this.type =='policy'){
            this.getReportCategory();
          }else{
            this.getReportClassify();
          }
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
        }
      })
    }
    
  }

  //查看PDF
  public lookPDF(url){

    PDFObject.embed(url,"#example-pdf");
    let options = {
      pdfOpenParams: { scrollbars: '0', toolbar: '0', statusbar: '0'}//禁用工具栏代码
    };
    PDFObject.embed(url,"#example-pdf");
    //document.getElementById('result').innerHTML ='';
    this.pdfDisplay =true;
    
  }

  /* ecxcel文件预览 */
  
  excelChange(url){
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'arraybuffer';
    let that =this;
    xhr.onload = function(e) {
        if(xhr.status == 200) {
            var data = new Uint8Array(xhr.response)
            var workbook = XLSX.read(data, {type: 'array'});
            that.outputWorkbook(workbook)
        }else{
          that.fileDisplay = true;
        }
    };
    xhr.send();
  }
  public excelSheetInfo = [];
  public excelName = [];

  outputWorkbook(workbook) {
    var sheetNames = workbook.SheetNames; // 工作表名称集合
    this.itemsExcel = [];
    this.excelSheetInfo = [];
    this.excelName = [];
    for(let i in sheetNames){
      this.excelName.push(sheetNames[i]);
      this.itemsExcel.push({
          label: sheetNames[i], icon: 'fa fa-fw fa-bar-chart'
      })
      var worksheet = workbook.Sheets[sheetNames[i]];
      var csv = XLSX.utils.sheet_to_html(worksheet);
      this.excelSheetInfo.push(csv);
      
    }
    document.getElementById('result').innerHTML = this.excelSheetInfo[0];

      //设置表格样式
      let table = document.getElementsByTagName('table');
      for(let i=0; i< table.length;i++){
        table[i].className = 'table table-bordered'
      }
    this.pdfDisplay = true;
  }
  
  
  csv2table(csv,title){
      var html = "<div>"+title+"</div><table class='table table-bordered'>";
      var rows = csv.split('\n');
      rows.pop(); // 最后一行没用的
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
  /* 切换Excel表格 */
  excelClick(event){
    for(let i in this.excelName){
      if(event.path[0].innerText == this.excelName[i]){
        document.getElementById('result').innerHTML = this.excelSheetInfo[i];
        //设置表格样式
        let table = document.getElementsByTagName('table');
        for(let i=0; i< table.length;i++){
          table[i].className = 'table table-bordered'
        }
      }
    }
  }

  
  /* 点击报告文件的进行查看 */
  treeSelect(event){
    this.selectedFile = event;
    let fileType=this.selectedFile.label.split('.')[this.selectedFile.label.split('.').length-1];
    let isInitialize = true;
    switch(fileType){
      case 'doc':
      case 'docx':
      case 'pptx':
        isInitialize = false;
        break;
      case 'png':
        isInitialize = false;
        this.imgUrl = localStorage.getItem('fileIP') +'mineral/upload/'+this.selectedFile.filePath;
        break;
      case 'jpg':
        isInitialize = false;
        this.imgUrl = localStorage.getItem('fileIP') +'mineral/upload/'+this.selectedFile.filePath;
        break;  
      case 'pdf':
        isInitialize = false;
        break;  
      case 'xlsx':
        isInitialize = false;
        break;  
      case 'txt':
        isInitialize = false;
        break;   
      case 'tif':  
        isInitialize = false;
        return;
    }
    this.isInitialize = isInitialize;
    if(isInitialize){
      this.clickFile(event,'file');
      /* this.selectedFile= {
        label:'',
        filePath:'',
        children:[]
      } */
    }
  }

  /* 预览文件 */
  previewFile(value){
    
    let url,filepath,path;
    let that = this;
    this.fileDisplay = false;
    //政策文件单独路径
    if(this.type=='policy'){
      let data = value.reportFilePath.split('\\');
      path = '';
      for(let i=0; i<data.length;i++){
        if(i===data.length-1){
          path += data[i];
        }else{
          path += data[i]+'/';
        }
        
      }
      this.fileType = data[data.length-1].split('.')[data[data.length-1].split('.').length-1]
      filepath  = 'minerals-file/'+path;
      this.selectedFile.label = data[data.length-1];
    }else{
      this.selectedFile = value;
      filepath = 'minerals-file/report/upload/'+this.selectedFile.filePath;
      this.fileType = this.selectedFile.label.split('.')[this.selectedFile.label.split('.').length-1];
      
    }
    url = localStorage.getItem('fileIP') +filepath;
    this.viewFileDisplay=true;
    switch(this.fileType){
      case 'doc':
      case 'docx':
      case 'pptx':
        let fileurl = 'report-viewer/toPdfFile';
        if(this.type=='policy'){
          fileurl = 'mineral-policy/toPdfFile'
        }
        this.httpUtil.post(fileurl,{
          "filePath": this.type=='policy'?path:this.selectedFile.filePath
        }).then(value=>{
            if(value.meta.code===6666){
              let data = value.data.filePath.split('\\');
              let path = '';
              for(let i=0; i<data.length;i++){
                if(i===data.length-1){
                  path += data[i];
                }else{
                  path += data[i]+'/';
                }
                
              }
                url = localStorage.getItem('fileIP') +'minerals-file/'+path;
       
              this.lookPDF(url);
            }
        })
        
        break;
      case 'png':
        this.imgUrl = localStorage.getItem('fileIP') +filepath;
        break;
      case 'jpg':

        this.imgUrl = localStorage.getItem('fileIP') +filepath;
        break;  
      case 'pdf':
        this.lookPDF(url);
        break;  
      case 'xlsx':
        document.getElementById('result').innerHTML ='';
        this.excelChange(url);
        break;  
      case 'txt':
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
        xhr.send(null);
        if(xhr.status !==200){
          this.fileDisplay = true;
          return;
        }
        this.txtTable = xhr.responseText;
        break;   
      case 'tif':
        let xhrTif = new XMLHttpRequest();
        xhrTif.responseType = 'arraybuffer';
        xhrTif.open('GET', url);
        
        xhrTif.onload = function (e) {
          if(e.target['status'] !==200 ){
            that.fileDisplay = true;
            return;
          }
          var tiff = new Tiff({buffer: xhrTif.response});
          var canvas = tiff.toCanvas();
          document.getElementById('tiff').appendChild(canvas);
          
        };
        xhrTif.send(); 
    }
    
    
  }



  pageChange(event){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    if(this.type=='policy'){
      this.getReportCategory()
    }else{
      this.getReportClassify();
    }
    
    
  }
  goBack(){
    if(this.type=='exploration'){
      this.router.navigate(['/layout/explorationRight/explorationInfo']);
    }else{
      this.router.navigate(['/layout/miningRight/miningInfo']);
    }
    
    this.explorationInfoService.goBack();
  }

  /* 点击文件夹 */
  clickFile(value,type){

    /* 点击表格中文件 */
    if(type=='file'){
      
        //this.fileValue = value.children;
        
        let filePath = value.filePath.split(this.filePathType).splice(1,value.filePath.split(this.filePathType).length);
        let pathFile = [];
        if(this.selectFolderDisplay){
          if(this.clickFolderPath.length>1){
            let path = '';
            
              let pathArray = this.clickFolderPath[this.clickFolderPath.length-1].path.split('>');
              let data =  pathArray.splice(0,pathArray.length-1);
              for(let i=0; i<data.length;i++){
                pathFile.push(data[i]);
                if(i>0){
                  path += data[i] +'/';
                }
                
              }
              this.loadingDisplay = true;
            this.getReportFolder( path+value.label);
            pathFile.push(filePath[0]);
            filePath = pathFile;
          }else{
            this.loadingDisplay = true;
            this.getReportFolder(value.label);
            filePath.unshift('根目录');
          }
          
        }else{
          //点击查看文件
          let path = '';
            
          let pathArray = this.clickFolderPath[this.clickFolderPath.length-1].path.split('>');
          let data =  pathArray.splice(0,pathArray.length-1);
          for(let i=0; i<data.length;i++){
            pathFile.push(data[i]);
            path += data[i] +'/';
            
          }
          this.loadingDisplay = true;
          this.getReportFile( path+value.label);
          pathFile.push(filePath[0]);
          filePath = pathFile;
        }
       
        this.clickFolderPath = [];
        for(let i in filePath){
          let path = '';
          for(let j=0;j<=parseInt(i);j++){
            path += filePath[j]+'>'
          }
          this.clickFolderPath.push({
            name: filePath[i],
            path: path
          });
    
        }
    }else{
      /* 点击文件路径 */
      let path = value.path.substring(0,value.path.length-1);
      if(this.selectFolderDisplay){
        if(path ==='根目录'){
          //this.fileValue = this.fileTree;
          this.loadingDisplay = true;
          this.getReportFolder('');
          this.clickFolderPath = [{
            name: '根目录',
            path: '根目录>'
          }];
        }else{
          let filePath = path.split('>');
          //this.getFilePath(path.slice(4,path.length),this.fileTree);
          let reportPath='';
          for(let i=1;i<filePath.length;i++){
            if(i==filePath.length-1){
              reportPath +=filePath[i]
            }else{
              reportPath +=filePath[i]+'/'
            }
            
            
          }
          this.loadingDisplay = true;
          this.getReportFolder(reportPath);
          this.clickFolderPath = [];
          for(let i in filePath){
            let path = '';
            for(let j=0;j<=parseInt(i);j++){
              path += filePath[j]+'>'
            }
            this.clickFolderPath.push({
              name: filePath[i],
              path: path
            });
      
          }
        }
        return;
      }
      


      let filePath = path.split('>');
          //this.getFilePath(path.slice(4,path.length),this.fileTree);
          let reportPath='';
          for(let i=0;i<filePath.length;i++){
            if(i==filePath.length-1){
              reportPath +=filePath[i]
            }else{
              reportPath +=filePath[i]+'/'
            }
            
            
          }
          this.loadingDisplay = true;
          this.getReportFile(reportPath);
          this.clickFolderPath = [];
          for(let i in filePath){
            let path = '';
            for(let j=0;j<=parseInt(i);j++){
              path += filePath[j]+'>'
            }
            this.clickFolderPath.push({
              name: filePath[i],
              path: path
            });
      
          }
      
    }
  }

  /* 获取文件 */
  getFilePath(path,data){
    let paths = path.split('>');
    path = '';
    for(let i in paths){
        
        path += paths[i]+this.filePathType
    }
    path =this.filePathType+ path.slice(0,path.length-1);
    for(let i in data){
      if(data[i].filePath ===path){
          this.fileValue = data[i].children;
          return;
      }else{
        this.getFilePath(path.slice(1,path.length),data[i].children);
      }
    }
  }

  /* 选择文件夹 */
  selectFolder(){
    this.reportFolderDisplay = true;
      this.loadingDisplay = true;
      this.selectedFile = {
        label:'',
        filePath:'',
        children:[]
      };
      this.fileTree = [];
      this.selectFolderDisplay = true;
      this.clickFolderPath = [{
        name:'根目录',
        path:'根目录>'
      }];
      this.loadingDisplay = true;
    this.getReportFolder('');
  }

  /* 保存选择的文件夹 */
  saveFolder(){
    if(this.selectedFolder){
      this.explorationReport.reportFilePath =  this.selectedFolder.path.slice(1,this.selectedFolder.path.length-1);
    }else{
      this.explorationReport.reportFilePath = '';
    }
   
   this.reportFolderDisplay = false;
  }
  /* 上传文件 */
  onUpload(event) {
    if(event.files.length<1 || event.originalEvent.body.meta.code!==6666){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '上传失败，请重新上传'});
      return;
    }
    this.uploadedFiles = [];
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
    this.explorationReport.reportFilePath = event.originalEvent.body.data.filePath;
    this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '上传成功'});
  }

}
