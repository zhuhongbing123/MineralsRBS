import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-api-manage',
  templateUrl: './api-manage.component.html',
  styleUrls: ['./api-manage.component.scss']
})
export class ApiManageComponent implements OnInit {

  public apiTableTitle;//api列表标题
  public apiTableValue;//api列表数据
  public apiTotal;//api列表总数
  public LIMIT_LOGIN=10;//api列表每页显示数量
  public apiClassify=[{
    label:'全部',
    value:0
  }];//api分类
  public selectTeamId: number = 0;//api分类ID 0表示获取全部
  currentPage: number = 1;//当前页码
  pageSize: number = 10;//分页总数
  public apiEditor={
    code:'',
    name:'',
    uri:'',
    classify:0,
    type:'2',
    method:'',
    status:'1'
  };//api弹出框编辑信息
  public apiEditorDisplay = false;//是否显示api编辑弹出框
  public accessMethod;//访问方式
  public apiStatus;//api状态
  public apiType;//api类型;
  public selectApiClassify;//已选择的资源类别
  public selectApiValue;//当前操作的api数据
  public saveType;//保存类型
  apiTitle;//弹出框标题
  constructor(private httpUtil: HttpUtil,
              private messageService:MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getTableValue();
  }

  /* 列表初始化 */
  getTableValue(){
    this.apiTableTitle = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: '名称' },
      { field: 'code', header: '编码' },
      { field: 'uri', header: 'URI' },
      { field: 'classify', header: '资源类别'},
      { field: 'method', header: '访问方式' },
      { field: 'status', header: '状态' },
      { field: 'operation', header: '操作' }

    ];
    this.accessMethod = [
      {label: 'POST', value: 'POST'},
      {label: 'GET', value: 'GET'},
      {label: 'PUT', value: 'PUT'},
      {label: 'DELETE', value: 'DELETE'},
      {label: 'PATCH', value: 'PATCH'}
    ];
    this.apiStatus = [
      {label: '正常', value: '1'},
      {label: '禁用', value: '9'}
    ];
    this.apiType = [
      {label: '--API资源--', value: '2'},
      {label: '--API类别--', value: '3'}
    ]
    this.getApiValue();
    this.getApiClassify();
  }

  /* 获取API分类 */
  getApiClassify(){
      this.httpUtil.get('resource/api/-1/1/10000').then(value=>{
        if (value.meta.code === 6666) {
          let data = value.data.data;
          for(let i in data){
            this.apiClassify.push({
              label:data[i].name,
              value:data[i].id
            })
          }

        }else if (value.meta.code === 1008) {
          this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '您无此api权限'});
        }  else {
          this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '获取失败'});
        }
      });

      
  }
  /* 获取api数据 */
  getApiValue(){
    this.httpUtil.get('resource/api/'+this.selectTeamId+'/'+this.currentPage+'/'+this.pageSize).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        this.apiTotal = value.data.data.total;

        for(let i in data){
          if(data[i].status==1){
            data[i].status = '正常'
          }
          if(data[i].status==9){
            data[i].status = '禁用'
          }
          for(let j in this.apiClassify){
              if(data[i].parentId ==this.apiClassify[j].value){
                data[i]['classify'] = this.apiClassify[j].label;
              }
          }
        }
        this.apiTableValue = data;
      }
    })
  }
  /* 切换表格页 */
  pageChange(event){
    this.currentPage = event.page+1;
    this.pageSize = event.rows;
    this.getApiValue();
  }
/* 对表格的操作 */
  setApi(type,value){
      this.selectApiValue = value;
      this.saveType = type;
      if(type ==='add'){
        this.apiEditor.code = '';
        this.apiEditor.name = '';
        this.apiEditor.uri = '';
        this.apiEditor.classify = 0;
        this.apiEditor.type = '2';
        this.apiEditor.method = 'post';
        this.apiEditor.status = '1';
        this.apiTitle = '添加API';
        this.apiEditorDisplay = true;
        return;
      }
      if(type==='delete'){
        this.confirmationService.confirm({
          message: '确认删除该API('+value.name+')吗?',
          header: '删除API',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel:'确定',
          rejectLabel:'取消',
          accept: () => {
            this.httpUtil.delete('resource/api/'+value.id).then(value=>{
              if (value.meta.code === 6666) {
                this.currentPage = 1;
                this.pageSize =10;
                this.getApiValue();
                this.getApiClassify();
              }
            })
          },
          reject: () => {
          
          }
        });
      }else{
        this.apiEditorDisplay = true;
        this.apiEditor.code = value.code;
        this.apiEditor.name = value.name;
        this.apiEditor.uri = value.uri;
        this.apiEditor.classify = value.parentId;
        this.apiEditor.type = value.type;
        this.apiEditor.method = value.method;
        this.apiEditor.status = value.status=='正常'?'1':'9';
        this.apiTitle = '修改API('+value.name+')';
      }
  }

  /* 选择资源类别 */
  selectClassify(){
    this.currentPage = 1;
    this.pageSize = 10;
    this.selectTeamId = this.selectApiClassify;
    this.getApiValue();
  }

  saveAPI(){
    let type = this.saveType;
    if(type ==='add'){
      this.httpUtil.post('resource/api',{
        code: this.apiEditor.code,
        method: this.apiEditor.method,
        name: this.apiEditor.name,
        parentId: this.apiEditor.classify,
        status: this.apiEditor.status,
        type: this.apiEditor.type,
        uri: this.apiEditor.uri
      }).then(value=>{
        this.getApiValue();
        this.getApiClassify();
        this.apiEditorDisplay = false;
        this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
      })
    }else{
      this.httpUtil.put('resource/api',{
        code: this.apiEditor.code,
        createTime: this.selectApiValue.createTime,
        icon: this.selectApiValue.icon,
        id: this.selectApiValue.id,
        method: this.apiEditor.method,
        name: this.apiEditor.name,
        parentId: this.apiEditor.classify,
        status: JSON.parse(this.apiEditor.status),
        type: JSON.parse(this.apiEditor.type),
        updateTime: this.selectApiValue.updateTime,
        uri: this.apiEditor.uri
      }).then(value=>{
        this.getApiValue();
        this.getApiClassify();
        this.apiEditorDisplay = false;
        this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
      })
    }
    
  }
}
