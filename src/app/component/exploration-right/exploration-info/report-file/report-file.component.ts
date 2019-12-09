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

  private reportFileCommon: Subscription;

  explorationItems: MenuItem[];//探矿权详情tab页标题

  addButton =false;//新增按钮显示
  modifyButton = false;//修改按钮显示
  viewButton = false;//查看文件按钮显示
  deleteButton = false;//删除按钮显示
  previewButton = false;//预览按钮显示

  startTime;//开始时间
  endTime = new Date();//结束时间
  isClickSearch = false;//查询按钮点击
  reportDesc;//文件描述
  policyReportCategory;//政策报告分类
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
      { field: 'reportCategoryId', header: '报告分类名称' },
      { field: 'reportTime', header: '报告日期' },
      { field: 'reportFilePath', header: '报告文件路径' },
      { field: 'reportDescription', header: '文件详情描述' },
      { field: 'reportUploader', header: '文件上传用户' },
      { field: 'creationTime', header: '报告上传日期' },
      { field: 'updateTime', header: '报告更新日期' },
      { field: 'operation', header: '操作' }
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
      this.getReportCategory();
      return;
    }
    
  }

  /* 获取矿权报告 */
  getReportClassify(){
    this.httpUtil.get('mineral-project-report/project/'+this.explorationProject.id).then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.reportInfos;
          for(let i in data){
            data[i].reportTime =  data[i].reportTime?new Date(data[i].reportTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
            data[i].creationTime =  data[i].creationTime?new Date(data[i].creationTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
            data[i].updateTime =  data[i].updateTime?new Date(data[i].updateTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
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

  
  getPolicyReport(){
    
  }

  
   /* 获取矿业权报告分类 */
   getReportCategory(){
    this.httpUtil.get('mineral-project-category/type/0/1/1000').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.projectReports.list;
        for(var i = data.length - 1; i >= 0; i--){
          data[i]['label'] = data[i].reportCategory;
          data[i]['value'] = data[i].id;
          if(data[i].reportType!==0){
              data.splice(i,1);
          }
        }
        this.reportCategory = data;
      }
    }).then(()=>{
      /* 获取矿业权政策报告 */
      this.httpUtil.get('mineral-policy/list/1/800').then(value=>{
        if (value.meta.code === 6666) {
            let data = value.data.policies.list;
            for(let i in data){
              data[i].reportTime =  data[i].reportTime?new Date(data[i].reportTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
              data[i].creationTime =  data[i].creationTime?new Date(data[i].creationTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
              data[i].updateTime =  data[i].updateTime?new Date(data[i].updateTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
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
    })
  }
  /* 矿权报告操作 */
  setExplorationt(type,value?){
    /* 报告文件的增加 */
    if(type==='addReport'){
      this.reportDisplay = true;
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
      }
      
      this.explorationReport = JSON.parse(JSON.stringify(value));
      this.explorationReport.reportTime = this.explorationReport.reportTime?new Date(this.explorationReport.reportTime):'';
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
      this.loadingDisplay = true;
      this.selectedFile = {
        label:'',
        filePath:'',
        children:[]
      };
      this.fileTree = [];
      this.httpUtil.post('mineral-project-report/file',{
        filePath: value.reportFilePath
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

            if(this.fileTree[0]){
              this.fileTree[0].children=this.getFileInfo(fileInfo,this.fileTree[0].label);
              this.clickFolderPath = [{
                name:this.fileTree[0].label,
                path:this.fileTree[0].label+'/'
              }];
              this.fileValue = this.fileTree[0].children;
            }
            
            
            this.loadingDisplay = false;
        }
      })
      return;
    }
    /* 报告文件的删除 */
    if(type==='deleteReport'){
      let url = 'mineral-project-report/';
      if(this.type =='policy'){
          url = 'mineral-policy';
      }
      this.confirmationService.confirm({
        message: '确认删除该报告吗?',
        header: '删除报告',
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

    /* 矿业权政策报告的搜索 */
    if(type=='filtered'){
      this.httpUtil.post('mineral-policy/search/1/1000',{
        "reportCategory": this.policyReportCategory?this.policyReportCategory:'',
        "reportDesc": this.reportDesc?this.reportDesc:'',
        "reportEndTime": parseInt((this.endTime.getTime()/1000).toString()),
        "reportStartTime": parseInt((this.startTime.getTime()/1000).toString()),
      }).then(value=>{
        if (value.meta.code === 6666) {
          let data = value.data.reportInfos;
          for(let i in data){
            data[i].reportTime =  data[i].reportTime?new Date(data[i].reportTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
            data[i].creationTime =  data[i].creationTime?new Date(data[i].creationTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
            data[i].updateTime =  data[i].updateTime?new Date(data[i].updateTime*1000).toLocaleDateString().replace(/\//g, "-"):'';
            for(let j in this.reportCategory){
              if(data[i].reportCategoryId ===this.reportCategory[j].value){
                data[i].reportCategoryId = this.reportCategory[j].reportCategory;
              }

            }
          }
          //删除不是政策的报告
          for(var i = data.length - 1; i >= 0; i--){
            if(typeof(data[i].reportCategoryId)=='number'){
              data.splice(i,1);
            }
          }
          this.reportClassifyValue = data;
      }
      })
    }
  }

  /* 将报告文件整理成树形结构 */
  getFileInfo(data,pid){
    var result = [] , temp;
    for(var i in data){
        let fileType = data[i].label.split('.')[data[i].label.split('.').length-1];
        let isInitialize = false;
        switch(fileType){
          case 'doc':
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
          data[i].name =  data[i].label +'/';
        }
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

  
  /* 保存探矿权报告 */
  saveExplorationReport(){
    if(!this.explorationReport.reportCategoryId){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '报告分类不能为空'});
      return;
    }
    let reportInfo = {
      "id":this.explorationReport.id,
      "creationTime": parseInt((new Date().getTime()/1000).toString()),
      "reportCategoryId": this.explorationReport.reportCategoryId,
      "reportDescription": this.explorationReport.reportDescription?this.explorationReport.reportDescription:'',
      "reportFilePath": this.explorationReport.reportFilePath?this.explorationReport.reportFilePath:'',
      "reportTime":  this.explorationReport.reportTime?parseInt((this.explorationReport.reportTime.getTime()/1000).toString()):0,
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
          
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
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
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
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
        isInitialize = false;
        break;
      case 'png':
        isInitialize = false;
        this.imgUrl = HttpUrl.fileUrl +'mineral/upload/'+this.selectedFile.filePath;
        break;
      case 'jpg':
        isInitialize = false;
        this.imgUrl = HttpUrl.fileUrl +'mineral/upload/'+this.selectedFile.filePath;
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
    this.selectedFile = value;
    this.fileType = this.selectedFile.label.split('.')[this.selectedFile.label.split('.').length-1];
    let url = HttpUrl.fileUrl +'mineral/upload/'+ this.selectedFile.filePath
    this.viewFileDisplay=true;

    switch(this.fileType){
      case 'doc':
        this.httpUtil.post('report-viewer/toPdfFile',{
          "filePath": this.selectedFile.filePath
        }).then(value=>{
            if(value.meta.code===6666){
              let url = HttpUrl.fileUrl +'mineral/convert/'+ value.data.filePath;
              this.lookPDF(url);
            }
        })
        
        break;
      case 'png':
        this.imgUrl = HttpUrl.fileUrl +'mineral/upload/'+this.selectedFile.filePath;
        break;
      case 'jpg':

        this.imgUrl = HttpUrl.fileUrl +'mineral/upload/'+this.selectedFile.filePath;
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
        this.txtTable = xhr.responseText;
        break;   
      case 'tif':
        let xhrTif = new XMLHttpRequest();
        xhrTif.responseType = 'arraybuffer';
        xhrTif.open('GET', url);
        xhrTif.onload = function (e) {
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
    this.getReportClassify();
    
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
    /* this.fileType = value.label.split('.')[this.selectedFile.label.split('.').length-1];
    if(value.label){

    } */
    /* 点击表格中文件 */
    if(type=='file'){
        this.fileValue = value.children;
        let filePath = value.filePath.split('/');
        this.clickFolderPath = [];
        for(let i in filePath){
          let path = '';
          for(let j=0;j<=parseInt(i);j++){
            path += filePath[j]+'/'
          }
          this.clickFolderPath.push({
            name: filePath[i],
            path: path
          });
    
        }
    }else{
      /* 点击文件路径 */
      let path = value.path.substring(0,value.path.length-1)
      if(path ==this.fileTree[0].label){
        this.fileValue = this.fileTree[0].children;
        this.clickFolderPath = [{
          name: this.fileTree[0].label,
          path: this.fileTree[0].label+'/'
        }]
      }else{
        this.getFilePath(path,this.fileTree[0].children);
        let filePath = path.split('/');
        this.clickFolderPath = [];
        for(let i in filePath){
          let path = '';
          for(let j=0;j<=parseInt(i);j++){
            path += filePath[j]+'/'
          }
          this.clickFolderPath.push({
            name: filePath[i],
            path: path
          });
    
        }
      }
      
    }
  }

  /* 获取文件 */
  getFilePath(path,data){
    for(let i in data){
      if(data[i].filePath ==path){
          this.fileValue = data[i].children;
          return;
      }else{
        this.getFilePath(path,data[i].children);
      }
    }
  }


  
}
