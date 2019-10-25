import { Component, OnInit, Input } from '@angular/core';
import { ExplorationInfoService } from '../exploration-info.service';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { ExplorationReport } from '../../../../common/util/app-config';
import { HttpUtil } from '../../../../common/util/http-util';
import * as XLSX from 'xlsx';
import { HttpUrl } from '../../../../common/util/http-url';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
declare let PDFObject,$;

@Component({
  selector: 'app-report-file',
  templateUrl: './report-file.component.html',
  styleUrls: ['./report-file.component.scss']
})
export class ReportFileComponent implements OnInit {
  @Input() reportCategory;
  @Input() explorationProject;
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
  private reportFileCommon: Subscription;

  explorationItems: MenuItem[];//探矿权详情tab页标题
  constructor(private explorationInfoService:ExplorationInfoService,
              private httpUtil: HttpUtil,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private router: Router) {
    this.reportFileCommon = this.explorationInfoService.reportFileCommon$.subscribe(value=>{
      if(value){
        this.reportDetailDisplay = true;
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
    this.itemsExcel =[
      {label: 'Stats', icon: 'fa fa-fw fa-bar-chart'}
    ]
    
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
  /* 矿权报告操作 */
  setExplorationt(type,value?){
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

  
  /* 保存探矿权报告 */
  saveExplorationReport(){
    localStorage.getItem('uid')
    let reportInfo = {
      "id":this.explorationReport.id,
      "creationTime": new Date().getTime()/1000,
      "projectId": this.explorationProject.id,
      "reportCategoryId": this.explorationReport.reportCategoryId,
      "reportDescription": this.explorationReport.reportDescription,
      "reportFilePath": this.explorationReport.reportFilePath,
      "reportTime":  this.explorationReport.reportTime.getTime()/1000,
      "reportUploader": localStorage.getItem('uid'),
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
           // if(callback) callback(workbook);
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
      var csv = XLSX.utils.sheet_to_json(worksheet);
      this.excelSheetInfo.push(csv);
      
    }
    document.getElementById('result').innerHTML = this.excelSheetInfo[0];

      //设置表格样式
      /* let table = document.getElementsByTagName('table');
      for(let i=0; i< table.length;i++){
        table[i].className = 'table table-bordered'
      } */
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
    }
    this.isInitialize = isInitialize;
    if(this.selectedFile.label.split('.').length==1 || isInitialize){
      this.selectedFile= {
        label:'',
        filePath:'',
        children:[]
      }
    }
  }

  /* 预览文件 */
  previewFile(){
    if(!this.selectedFile.label){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请选择文件'});
      return;
    }
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
        xhr.open('GET', "./assets/js/aaa.txt", false);
        xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
        xhr.send(null);
        this.txtTable = xhr.responseText;
        break;   
    }
    
    
  }



  pageChange(event){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    this.getReportClassify();
    
  }
  goBack(){
    this.explorationInfoService.goBack();
  }
}
