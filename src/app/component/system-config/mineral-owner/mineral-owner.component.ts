import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoginService } from '../../login/login.service';
declare let PDFObject;
@Component({
  selector: 'app-mineral-owner',
  templateUrl: './mineral-owner.component.html',
  styleUrls: ['./mineral-owner.component.scss']
})
export class MineralOwnerComponent implements OnInit {
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数
  ownerTotal;//列表总数
  mineralOwnerTitle;//矿权人列表标题
  mineralOwnerValue;//矿权人列表数据
  mineralOwner={
  id:'',
  ownerName: ''
  };//矿权人名称
  ownerDisplay = false;//矿权人弹出框是否显示
  modifyOwner = false;//是否修改矿权人

  addDisplay = false;//增加按钮显示
  modifyDisplay = false;//修改按钮显示
  deleteDisplay = false;//删除按钮显示
  queryDisplay = false;//查询按钮显示

  filteredOwner: string[];//搜索时显示的下拉框矿权人名字
  allOwnerName: any[];//所有矿权人名字
  filteredOwnerName:string;//搜索矿权人名字
  loading: boolean;//列表加载动画显示

  constructor(private httpUtil: HttpUtil,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private loginService: LoginService) { }

  ngOnInit() {
    this.setTableValue();
  }

  /* 初始化表格 */
  setTableValue(){
    this.mineralOwnerTitle = [
      { field: 'ownerName', header: '矿权人名称' },
      { field: 'operation', header: '操作' },
    ];
    this.loading = true;
    //获取授权的API资源
    if(!localStorage.getItem('api')){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请重新登录'});
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(localStorage.getItem('api')).forEach(element => {
      if(element.uri ==='/mineral-owner' && element.method =='POST'){
          this.addDisplay =true;
      }
      if(element.uri ==='/mineral-owner' && element.method =='PUT'){
        this.modifyDisplay =true;
      }
      if(element.uri ==='/mineral-owner/*' && element.method =='DELETE'){
        this.deleteDisplay =true;
      }
      if(element.uri ==='/mineral-owner/search/*/*' && element.method =='POST'){
        this.queryDisplay =true;
    }
    
    });

    if(!this.modifyDisplay && !this.deleteDisplay){
      this.mineralOwnerTitle.splice(1,1)
    }
    this.getMineralOwnerValue();
    this.getgetMineralOwnerName();
  }

  /* 获取矿权人信息 */
  getMineralOwnerValue(){
    this.httpUtil.get('mineral-owner/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
          let data = value.data.mineralOwners.list;
          for(let i=0; i<data.length;i++){
            data[i].number = (this.startPage-1)*this.limit+i +1;
          }
        
          this.mineralOwnerValue = data;
          this.ownerTotal = value.data.mineralOwners.total;
          this.loading = false;
      }
    })
  }

  /* 获取所有矿权人名字 */
  getgetMineralOwnerName(){
    this.httpUtil.get('mineral-owner/name').then(value=>{
      if (value.meta.code === 6666) {
          this.allOwnerName = value.data.ownerNames;

      }
    })
  }

  /* 获取搜索的矿权人信息 */
  getFilteredOwner(){
    this.httpUtil.post('mineral-owner/search/'+this.startPage+'/'+this.limit,{
      ownerName: this.filteredOwnerName?this.filteredOwnerName:''
    }).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralOwners.list;
        for(let i=0; i<data.length;i++){
          data[i].number = (this.startPage-1)*this.limit+i +1;
        }
        this.mineralOwnerValue = data;
        this.ownerTotal = value.data.mineralOwners.total;
        this.loading = false;
      }
    })
  }


  /* 矿权人增加、修改、删除操作 */
  setOwner(type,value?){
    if(type =='add'){
      this.ownerDisplay = true;
      this.mineralOwner.ownerName = '';
      this.modifyOwner = false;
      return;
    }
    if(type =='modify'){
      this.ownerDisplay = true;
      this.mineralOwner = value;
      this.modifyOwner = true;
      return;
    }
    /* 搜索 */
    if(type=='filtered'){
      this.loading = true;
      this.getFilteredOwner();
      return;
    }
    if(type == 'delete'){
      this.confirmationService.confirm({
        message: '确认删除该矿权人('+value.ownerName+')吗?',
        header: '删除矿权人',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-owner/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
              this.startPage = 1;//列表开始的页数
              this.limit = 10;//列表每页的行数
              this.filteredOwnerName = '';
              this.getMineralOwnerValue();
            }
          })
        },
        reject: () => {
        
        }
      });
    }
  }
  /* 保存矿权人 */
  saveOwner(){
    if(!this.mineralOwner.ownerName){
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '矿权人名称不能为空'});
        return;
    }
    if(this.modifyOwner){
      this.httpUtil.put('mineral-owner',{
        id: this.mineralOwner.id,
        ownerName:this.mineralOwner.ownerName
      }).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
          this.getMineralOwnerValue();
          this.ownerDisplay = false;
          this.filteredOwnerName = '';
        }
      })
    }else{
      this.httpUtil.post('mineral-owner',{
        ownerName:this.mineralOwner.ownerName
      }).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
          this.getMineralOwnerValue();
          this.ownerDisplay = false;
          this.filteredOwnerName = '';
        }
      })
    }
  }
   /* 角色表格切换页码 */
   pageChange(event){
    this.startPage = event.page+1;
    this.limit = event.rows;
    if(this.filteredOwnerName){
      this.getFilteredOwner();
    }else{
      this.getMineralOwnerValue();
    }
    
   }

   /* 搜索矿权人 */
   filterOwners(event){
    this.filteredOwner = [];
    for(let i in this.allOwnerName){
      let brand = this.allOwnerName[i];
      if(brand.toLowerCase().indexOf(event.query.toLowerCase())>-1) {
          this.filteredOwner.push(brand);
      }
    }
   }
}
