import { Component, OnInit, Input } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService } from 'primeng/api';



@Component({
  selector: 'app-exploration-file',
  templateUrl: './exploration-file.component.html',
  styleUrls: ['./exploration-file.component.scss']
})
export class ExplorationFileComponent implements OnInit {
  @Input() reportTypeNumber = 1;
  public explorationInfoTitle:any;//探矿权报告标题
  public explorationValue: any[] = [];//探矿权报告列表数据
  setReporteDisplay = false;//编辑报告分类弹出框是否显示
  reportCategoryName;//报告分类名称
  reportTotal;//列表总数
  LIMIT_LOGIN = 10;//列表每页显示数量
  reportType;//报告分类操作类型
  reportValue;//报告分类操作数据(单独操作的数据)
  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.setTableValue();
   
  }

  //初始化表格
  public setTableValue(){
    this.explorationInfoTitle=[
      { field: 'reportCategory', header: '报告分类名称' },
      { field: 'reportType', header: '报告种类' },
      { field: 'operation', header: '操作' }
    ];
    this.getReportCategory();
  }

  /* 获取报告分类数据 */
  getReportCategory(){
    this.httpUtil.get('mineral-project-category/list/1/10').then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.projectReports.list;
          this.reportTotal = value.data.projectReports.total;
          for(let i in data){
            if(data[i].reportType ==0){
              data[i].reportType = '行业规范'
            }
            if(data[i].reportType ==1){
              data[i].reportType = '探矿权'
            }
            if(data[i].reportType ==2){
              data[i].reportType = '采矿权'
            }
          } 
          
          this.explorationValue = data;
      }
    })
  }

  /* 编辑报告分类 */
  setReport(type,value){
    
    this.reportCategoryName = '';
    this.reportType = type;
    this.reportValue = value;
    if(type ==='add'){
      this.setReporteDisplay  = true;
    }
    if(type==='modify'){
      this.setReporteDisplay  = true;
      this.reportCategoryName = value.reportCategory; 
    }
    if(type == 'delete'){
      this.confirmationService.confirm({
        message: '确认删除该角色吗?',
        header: '删除角色',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-project-category/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
              this.getReportCategory();
              this.setReporteDisplay = false;
            }
          })
        },
        reject: () => {
        
        }
      });
    }
  }

  /* 保存报告分类 */
  saveReport(){
    if(this.reportType =='add'){
      this.httpUtil.post('mineral-project-category',{
        "reportType": this.reportTypeNumber,
        "reportCategory": this.reportCategoryName
      }).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          this.getReportCategory();
          this.setReporteDisplay = false;
        }
      })
    }else{
      this.httpUtil.put('mineral-project-category',{
        "reportType": this.reportTypeNumber,
        "reportCategory": this.reportCategoryName,
        "id":this.reportValue.id
      }).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
          this.getReportCategory();
          this.setReporteDisplay = false;
        }
      })
    }
  }

  /* 角色表格切换页码 */
  pageChange(event){
    let page = event.page+1;
    let rows = event.rows;
    this.httpUtil.get('mineral-project-category/list/'+page+'/'+rows).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.projectReports.list;
        this.reportTotal = value.data.projectReports.total;
        for(let i in data){
          if(data[i].reportType ==0){
            data[i].reportType = '行业规范'
          }
          if(data[i].reportType ==1){
            data[i].reportType = '探矿权'
          }
          if(data[i].reportType ==2){
            data[i].reportType = '采矿权'
          }
        } 
        this.explorationValue = data;
      }
    })
  }

/* 
  //查看详情
  public goDetails(value){
    this.detailsDisplay = true;
  }
  //返回列表
  public goBack(){
    this.detailsDisplay = false;
  }

  //查看PDF
  public lookPDF(){
    PDFObject.embed("./assets/js/房源表.pdf","#example-pdf");
    this.exampleDisplay =true;
    
  } */
}
