import { Component, OnInit, Input } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoginService } from '../../login/login.service';



@Component({
  selector: 'app-exploration-file',
  templateUrl: './exploration-file.component.html',
  styleUrls: ['./exploration-file.component.scss']
})
export class ExplorationFileComponent implements OnInit {
  @Input() reportTypeNumber = 1;
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数
  public explorationInfoTitle:any;//探矿权报告标题
  public explorationValue: any[] = [];//探矿权报告列表数据
  setReporteDisplay = false;//编辑报告分类弹出框是否显示
  reportCategoryName;//报告分类名称
  reportTotal;//列表总数
  reportType;//报告分类操作类型
  reportValue;//报告分类操作数据(单独操作的数据)
  reportTitle;//弹出框标题

  addButton = false;//新增按钮显示
  modifyButton = false;//修改按钮显示
  deleteButton = false;//删除按钮显示
  loading: boolean;//列表加载动画显示

  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private loginService: LoginService) { }

  ngOnInit() {
    this.setTableValue();
   
  }

  //初始化表格
  public setTableValue(){
    this.explorationInfoTitle=[
      { field: 'reportCategoryName', header: '报告分类名称' },
      { field: 'reportType', header: '报告种类' }
    ];
    this.loading =true;
    //获取授权的API资源
    if(!localStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(localStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/mineral-report-category' && element.method =='POST'){
        this.addButton =true;
      }
      if(element.uri ==='/mineral-report-category' && element.method =='PUT'){
        this.modifyButton =true;
      }
      if(element.uri ==='/mineral-report-category/*' && element.method =='DELETE'){
          this.deleteButton =true;
      }
    });
    if(!this.modifyButton && !this.deleteButton){
      this.explorationInfoTitle.splice(2,1);
    }
    this.getReportCategory();
  }

  /* 获取报告分类数据 */
  getReportCategory(){
    let type = this.reportTypeNumber;
    this.httpUtil.get('mineral-report-category/type/'+type+'/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.reportCategories.list;
          this.reportTotal = value.data.reportCategories.total;
          for(let i=0; i<data.length;i++){
            data[i].number = (this.startPage-1)*this.limit+i +1;
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
          this.loading = false;
      }
    })
  }

  /* 编辑报告分类 */
  setReport(type,value?){
    
    this.reportCategoryName = '';
    this.reportType = type;
    this.reportValue = value;
    if(type ==='add'){
      this.setReporteDisplay  = true;
      this.reportTitle = '新增分类';
    }
    if(type==='modify'){
      this.setReporteDisplay  = true;
      this.reportCategoryName = value.reportCategoryName; 
      this.reportTitle = '修改分类('+value.reportCategoryName+')';
    }
    if(type == 'delete'){
      this.confirmationService.confirm({
        message: '确认删除该分类('+value.reportCategoryName+')吗?',
        header: '删除分类',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-report-category/'+value.id).then(value=>{
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
    if(!this.reportCategoryName){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '报告分类名称不能为空'});
      return;
    }
    if(this.reportType =='add'){
      this.httpUtil.post('mineral-report-category',{
        "reportType": this.reportTypeNumber,
        "reportCategoryName": this.reportCategoryName
      }).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          this.getReportCategory();
          this.setReporteDisplay = false;
        }
      })
    }else{
      this.httpUtil.put('mineral-report-category',{
        "reportType": this.reportTypeNumber,
        "reportCategoryName": this.reportCategoryName,
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
    this.startPage = event.page+1;
    this.limit= event.rows;
    this.getReportCategory();
  }

}
