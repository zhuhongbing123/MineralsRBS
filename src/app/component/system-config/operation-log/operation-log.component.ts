import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';

@Component({
  selector: 'app-operation-log',
  templateUrl: './operation-log.component.html',
  styleUrls: ['./operation-log.component.css']
})
export class OperationLogComponent implements OnInit {

  public operationLogTitle: any;// 操作日志列表标题
  public operationLogValue: any;// 操作日志列表数据
  public operationLogTotal;//操作日志列表总数
  public LIMIT_LOGIN=10;//操作日志列表每页显示数量
  constructor(private httpUtil: HttpUtil) { }

  ngOnInit() {
    this.getTableValue();
  }

  //初始化列表数据
  getTableValue(){
    this.operationLogTitle = [
      { field: 'id', header: 'ID' },
      { field: 'logName', header: '日志类型' },
      { field: 'userId', header: '用户标识' },
      { field: 'api', header: '调用API' },
      { field: 'method', header: '调用方式' },
      { field: 'createTime', header: '操作时间' },
      { field: 'message', header: '其他信息' },
      { field: 'succeed', header: '状态' }
    ];
    this.getLoginLog();
  }
  getLoginLog(){
    this.httpUtil.get('log/operationLog/1/10').then(value=>{
      if (value.meta.code === 6666) {
        this.operationLogValue = value.data.data.list;
        this.operationLogTotal = value.data.data.total;
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
    }
    this.operationLogValue = data;
  }

  /* 表格切换页码 */
  pageChange(event){
    let page = event.page+1;
    let rows = event.rows;
    this.httpUtil.get('log/operationLog/'+page+'/'+rows).then(value=>{
      if (value.meta.code === 6666) {
        this.operationLogValue = value.data.data.list;
        this.operationLogTotal = value.data.data.total;
        this.setTableValue(value.data.data.list);
      }
    })
  }

}
