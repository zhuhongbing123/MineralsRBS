import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { ConfirmationService, MessageService } from 'primeng/api';

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
 
  constructor(private httpUtil: HttpUtil,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.setTableValue();
  }

  /* 初始化表格 */
  setTableValue(){
    this.mineralOwnerTitle = [
      { field: 'ownerName', header: '矿权人名称' },
      { field: 'operation', header: '操作' },
    ];
    this.getMineralOwnerValue();
  }

  /* 获取矿权人信息 */
  getMineralOwnerValue(){
    this.httpUtil.get('mineral-owner/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
          this.mineralOwnerValue = value.data.mineralOwners.list;
          this.ownerTotal = value.data.mineralOwners.total;

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
    if(type == 'delete'){
      this.confirmationService.confirm({
        message: '确认删除该矿权人吗?',
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
    if(this.modifyOwner){
      this.httpUtil.put('mineral-owner',{
        id: this.mineralOwner.id,
        ownerName:this.mineralOwner.ownerName
      }).then(value=>{
        if (value.meta.code === 6666) {
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改成功'});
          this.getMineralOwnerValue();
          this.ownerDisplay = false;
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
        }
      })
    }
  }
   /* 角色表格切换页码 */
   pageChange(event){
    this.startPage = event.page+1;
    this.limit = event.rows;
    this.getMineralOwnerValue();
   }
}
