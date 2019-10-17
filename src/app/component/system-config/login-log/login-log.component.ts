import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';

@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.scss']
})
export class LoginLogComponent implements OnInit {

  public loginLogTitle: any;// 登录日志列表标题
  public loginLogValue: any;// 登录日志列表数据
  public loginLogTotal;//登录日志列表总数
  public LIMIT_LOGIN=10;//登录日志列表每页显示数量
  constructor(private httpUtil: HttpUtil) { }

  ngOnInit() {
    this.getTableValue();
  }

  //初始化列表数据
  getTableValue(){
    this.loginLogTitle = [
      { field: 'id', header: 'ID' },
      { field: 'logName', header: '日志类型' },
      { field: 'userId', header: '用户标识' },
      { field: 'ip', header: '用户终端IP' },
      { field: 'createTime', header: '操作时间' },
      { field: 'message', header: '其他信息' },
      { field: 'succeed', header: '状态' }
    ];
    this.getLoginLog();
  }
  getLoginLog(){
    this.httpUtil.get('log/accountLog/1/10').then(value=>{
      if (value.meta.code === 6666) {
        this.loginLogValue = value.data.data.list;
        this.loginLogTotal = value.data.data.total;
        this.setTableValue(value.data.data.list);
      }
    })
  }

  /* 将服务端的数据处理成表格数据 */
  setTableValue(data){
    for(let i in data){
        if(data[i].succeed==1){
          data[i].succeed = '成功'
        }
        /* let date = data[i].createTime;
        //时间转换
        let newDate = date.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').split('.')[0];
        data[i].createTime = newDate; */
    }
    this.loginLogValue = data;
  }

  /* 表格切换页码 */
  pageChange(event){
    let page = event.page+1;
    let rows = event.rows;
    this.httpUtil.get('log/accountLog/'+page+'/'+rows).then(value=>{
      if (value.meta.code === 6666) {
        this.loginLogValue = value.data.data.list;
        this.loginLogTotal = value.data.data.total;
        this.setTableValue(value.data.data.list);
      }
    })
  }
}