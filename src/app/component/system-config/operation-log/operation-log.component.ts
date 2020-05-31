import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { LoginService } from '../../login/login.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-operation-log',
  templateUrl: './operation-log.component.html',
  styleUrls: ['./operation-log.component.css']
})
export class OperationLogComponent implements OnInit {
  pageSize = 10;//列表每页数量
  pageNumber = 1;//列表第几页
  public operationLogTitle: any;// 操作日志列表标题
  public operationLogValue: any;// 操作日志列表数据
  public operationLogTotal;//操作日志列表总数
  public LIMIT_LOGIN=10;//操作日志列表每页显示数量

  allUserName;//所有用户名字
  filteredUserName;//用户名称
  filteredUser:any[];//搜索框下拉显示用户名
  startTime;//开始时间
  endTime = new Date();//结束时间
  isClickSearch = false;//查询按钮点击
  loading: boolean;//列表加载动画显示
  searchDisplay = false;//查询按钮显示
  searchNameDisplay = true;//用户名搜索框是否显示
  constructor(private httpUtil: HttpUtil,
              private loginService: LoginService,
              private messageService:MessageService) { }

  ngOnInit() {
    this.getTableValue();
  }

  //初始化列表数据
  getTableValue(){
    this.operationLogTitle = [
      { field: 'logName', header: '日志类型' },
      { field: 'userId', header: '用户标识' },
      { field: 'api', header: '调用API' },
      { field: 'method', header: '调用方式' },
      { field: 'createTime', header: '操作时间' },
      { field: 'message', header: '其他信息' },
      { field: 'succeed', header: '状态' }
    ];
    //获取授权的API资源
    if(!sessionStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(sessionStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/log/operationLog/serach/*/*' && element.method =='POST'){
        this.searchDisplay =true;
      };
    })
    this.loading  = true;
    this.startTime = new Date(this.endTime.getFullYear(), this.endTime.getMonth() - 3, this.endTime.getDate());
    if(sessionStorage.getItem('roleCode')=='role_admin'){
      this.getOperationLog();
    }else{
      this.filteredUserName = sessionStorage.getItem('uid');
      this.searchNameDisplay =false;
      this.searchLog();
    }
    
    this.getUserName();
  }
  /* 获取所有日志数据 */
  getOperationLog(){
    this.httpUtil.get('log/operationLog/'+this.pageNumber+'/'+this.pageSize).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        for(let i=0;i<data.length;i++){
          data[i].number = (this.pageNumber-1)*this.pageSize+i +1;
        }
        this.operationLogValue = data;
        this.operationLogTotal = value.data.data.total;
        this.setTableValue(value.data.data.list);
      }
    })
  }
  /* 获取所有用户名称 */
  getUserName(){
    this.httpUtil.get('user/name').then(value=>{
      if (value.meta.code === 6666) {
        this.allUserName = value.data.userNames;
      }
    })
  }

  /* 搜索日志 */
  searchLog(){
    this.httpUtil.post('log/operationLog/search/'+this.pageNumber+'/'+this.pageSize,{
      "startTime": parseInt((this.startTime.getTime()/1000).toString()),
      "endTime": parseInt((this.endTime.getTime()/1000).toString()),
      "userName": this.filteredUserName?this.filteredUserName:''
    }).then(value=>{
      if (value.meta.code === 6666) {
        this.isClickSearch = true;
        let data = value.data.logs.list;
        for(let i=0;i<data.length;i++){
          data[i].number = (this.pageNumber-1)*this.pageSize+i +1;
        }
        this.operationLogValue = data;
        this.operationLogTotal = value.data.logs.total;
        this.setTableValue(value.data.logs.list);
      }
    })
  }
  /* 将服务端的数据处理成表格数据 */
  setTableValue(data){
    for(let i in data){
      //data[i].createTime = data[i].createTime?new Date(data[i].createTime*1000).toLocaleDateString().replace(/\//g, "-"):''
        if(data[i].succeed==1){
          data[i].succeed = '成功'
        }

    }
    this.operationLogValue = data;
    this.loading  = false;
  }

  /* 表格切换页码 */
  pageChange(event){
    this.pageNumber = event.page+1;
    this.pageSize = event.rows;
    if(this.filteredUserName){
      this.searchLog();
    }else{
      this.getOperationLog();
    }
    
  }

  /* 过滤显示用户名 */
  filteredName(event){
    this.filteredUser = [];
    for(let i in this.allUserName){
      let brand = this.allUserName[i];
      if(brand.toLowerCase().indexOf(event.query.toLowerCase()) >-1) {
          this.filteredUser.push(brand);
      }
    }
  }

  
}
