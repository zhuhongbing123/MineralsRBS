import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService, Message } from 'primeng/api';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  msgs: Message[] = [];
  public roleTitle: any;// 角色列表标题
  public roleValue: any;// 角色列表数据
  public roleTotal;//登录日志列表总数
  public LIMIT_LOGIN=10;//登录日志列表每页显示数量
  public roleLink;//角色关联模块
  public selectedLinkModule;//已选择的角色关联模块
  public selectedRole;//已选择的角色
  public clickRoleName;//已选择的角色名称
  public linkTableValue;//关联模块列表数据
  public linkTotal;//关联模块列表总数
  public roleTableDisplay = true;//是否显示角色关联模块
  public linkTableDisplay = false;//是否显示关联模块列表
  public roleOpreationDisplay = false;//角色编辑弹出框是否显示
  public roleOpreationHeader;//角色编辑弹出框标题
  public roleStatus;//角色状态下拉选项值
  public selectedroleStatus;//已选角色状态值
  public roleCode;//角色编码
  public roleName;//角色名称
  public addLinkDisplay=false;//关联模块弹出框是否显示
  public selectedLink;//已选择的关联列表数据
  public addLinkValue;//添加关联模块列表的数据
  public addLinkTitle;//添加关联模块列表标题
  public selectedAddLink;//已选择添加关联模块列表值
  public addLinkHeader;//添加角色关联模块弹出框标题
  public addLinkTotal;//添加角色列表总数
  public addLinkUrl = 'role/api';//添加角色列表获取数据的url
  constructor(private httpUtil: HttpUtil,
              private messageService:MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getTableValue();
  }

  //初始化列表数据
  getTableValue(){
    this.roleTitle = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: '名称' },
      { field: 'code', header: '编码' },
      { field: 'status', header: '状态' },
      { field: 'link', header: '关联模块' },
      { field: 'operation', header: '操作' }

    ];
    this.roleLink = [
      {label: '授权API', value: '授权API'},
      {label: '授权菜单', value: '授权菜单'},
      {label: '关联用户', value: '关联用户'}
    ];
    this.roleStatus = [
      {label: '正常', value: '正常'},
      {label: '禁用', value: '禁用'}
    ];
    
    this.getRoleValue();
    this.getLinkUrl();
  }
  /* 获取角色数据 */
  getRoleValue(){
    this.httpUtil.get('role/1/10').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        this.roleTotal = value.data.data.total;

        for(let i in data){
          if(data[i].status==1){
            data[i].status = '正常';
          }else{
            data[i].status = '禁用';
          }
        }
        this.roleValue = data;
      }
    })
  }



  /* 角色表格切换页码 */
  rolePageChange(event){
    let page = event.page+1;
    let rows = event.rows;
    this.httpUtil.get('role/'+page+'/'+rows).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        this.roleTotal = value.data.data.total;

        for(let i in data){
          if(data[i].status==1){
            data[i].status = '成功'
          }
        }
        this.roleValue = data;
      }
    })
  }

  /* 右侧关联表格页码切换 */
  linkPageChange(event,type){
    let page = event.page+1;
    let rows = event.rows;
    let url;
    url = this.addLinkUrl+'-/'+this.selectedRole.id;
    /* if(type=='add'){
      url = this.addLinkUrl+'-/'+this.selectedRole.id;
    }else if(type=='link'){
      url = 'role/menu/'+this.selectedRole.id;
    } */
    
    this.httpUtil.get(url+'/'+page+'/'+rows).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.data.list;

        for(let i in data){
          if(data[i].status==1){
            data[i].status = '有效'
          }
        }
        if(type=='add'){
          this.addLinkTotal = value.data.data.total;
          this.addLinkValue = data;
        }else{
          this.linkTotal = value.data.data.total;
          this.linkTableValue = data;
        }
        
      }
    })
  }
  /* 点击角色列表单选按钮 */
  clickRole(data){
    if(this.selectedRole){
      this.clickRoleName = data.name;
      //当右侧列表显示并且已选择关联模块时
      if(this.linkTableDisplay && this.selectedLinkModule){
        this.getLinkValue(data.id);
      }
    }else{
      this.clickRoleName = '';
    }
  }

  /* 获取右侧关联列表数据 */
  getLinkValue(id){
    this.httpUtil.get(this.addLinkUrl+id+'/1/10').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        this.linkTotal = value.data.data.total;

        for(let i in data){
          if(data[i].status==1){
            data[i].status = '有效'
          }
        }
        this.linkTableValue = data;
      }
    })
  }


  /* 角色列表的操作 */
  setRole(type,value?){
    this.roleCode = '';
    this.roleName = '';
    this.selectedroleStatus = '';
    if(type =='add'){
      this.roleOpreationHeader = '添加角色';
      this.roleOpreationDisplay = true;
      return;
    }
    this.selectedRole = value;
    if(this.selectedRole){
      if(type=='modify'){
        this.roleOpreationHeader = '修改角色('+value.name+')';
        this.roleOpreationDisplay = true;
        this.roleCode = this.selectedRole.code;
        this.roleName = this.selectedRole.name;
        this.selectedroleStatus = this.selectedRole.status;
      }else{
        this.confirmationService.confirm({
          message: '确认删除该角色('+value.name+')吗?',
          header: '删除角色',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel:'确定',
          rejectLabel:'取消',
          accept: () => {
            this.httpUtil.delete('role/'+this.selectedRole.id).then(value=>{
              if (value.meta.code === 6666) {
                this.getRoleValue();
              }
            })
          },
          reject: () => {
          
          }
        });
      }
      
    }else{
      this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '请选择角色'});
    }
    
  }

  /* 新增修改角色保存 */
  saveRole(){
    if(this.roleOpreationHeader =='添加角色'){
      this.httpUtil.post('role',{
        code:this.roleCode,
        name:this.roleName,
        status:this.selectedroleStatus=='正常'?1:0
      }).then(value=>{
        if (value.meta.code === 6666) {
            this.getRoleValue();
            this.roleOpreationDisplay = false;
            this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '新增角色成功'});
        }
      })
    }else{
      this.httpUtil.put('role',{
        code:this.roleCode,
        name:this.roleName,
        status:this.selectedroleStatus=='正常'?1:0,
        createTime: this.selectedRole.createTime,
        id: this.selectedRole.id,
        updateTime: this.selectedRole.updateTime
      }).then(value=>{
        if (value.meta.code === 6666) {
            this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改角色成功'});
            this.getRoleValue();
            this.roleOpreationDisplay = false;
        }
      })
    }
    
  }

  /* 右侧关联模块列表的操作 */
  setLink(type,value?){
    let title =  this.selectedLinkModule.slice(2);
    this.addLinkHeader = '添加'+title;
    
    if(value){
      this.selectedLink = value;
    }
    this.getLinkUrl();
    if(type=='add'){
      this.httpUtil.get(this.addLinkUrl+'-/'+this.selectedRole.id+'/1/10').then(value=>{
        
        if (value.meta.code === 6666) {
          let data = value.data.data.list;
          this.addLinkTotal = value.data.data.total;

          for(let i in data){
            if(data[i].status==1){
              if(this.selectedLinkModule==='关联用户'){
                data[i].status = '正常';
              }else{
                data[i].status = '有效';
              }
              
            }
          }
          this.addLinkValue = data;
          this.addLinkDisplay = true;
        }
      })
      
    }else{
      let url;
      if(this.addLinkUrl =='role/user/'){
        url = 'user/authority/role/'+this.selectedLink.uid+'/'+this.selectedRole.id;
       
      }else{
        url = 'role/authority/resource/'+this.selectedRole.id+'/'+this.selectedLink.id;
    
      }
      this.confirmationService.confirm({
        message: '确认删除吗?',
        header: '删除'+title,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete(url).then(value=>{
            if (value.meta.code === 6666) {
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
              this.getLinkValue(this.selectedRole.id);
            }
          })
        },
        reject: () => {
        
        }
      });
    }
  }

  /* 设置关联模块的url和标题 */
  getLinkUrl(){
    if(this.selectedLinkModule==='授权API'){
      this.addLinkUrl = 'role/api/';
      this.addLinkTitle = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: '名称' },  
        { field: 'uri', header: 'URI' },
        { field: 'method', header: '访问方式' },
        { field: 'status', header: '状态' },
        { field: 'operation', header: '操作' }
      ]
    }else if(this.selectedLinkModule==='授权菜单'){
      this.addLinkUrl = 'role/menu/';
      this.addLinkTitle = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: '名称' },  
        { field: 'code', header: '编码' },
        { field: 'uri', header: 'URI' },
        { field: 'status', header: '状态' },
        { field: 'operation', header: '操作' }
      ]
    }else{
      this.addLinkUrl = 'role/user/';
      this.addLinkTitle = [
        { field: 'uid', header: 'UID' },
        { field: 'username', header: '名称' },  
        { field: 'phone', header: '电话' },
        { field: 'email', header: '邮箱' },
        { field: 'status', header: '状态' },
        { field: 'operation', header: '操作' }
      ]
    }
  }
  /* 保存添加的关联模块 */
  saveAddLink(){
      let url,body;
     
      if(this.selectedAddLink){
        if(this.addLinkUrl =='role/user/'){
          url = 'user/authority/role';
          body = {
            uid:this.selectedAddLink.uid.toString(),
            roleId:this.selectedRole.id.toString()
          }
        }else{
          url = 'role/authority/resource';
          body  = {
            resourceId:this.selectedAddLink.id.toString(),
            roleId:this.selectedRole.id.toString()
          }
        }
          this.httpUtil.post(url,body).then(value=>{
            if (value.meta.code === 6666) {
              this.getLinkValue(this.selectedRole.id);
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '授权添加成功'});
              this.addLinkDisplay = false;
            }else{
              this.messageService.add({key: 'tc', severity:'error', summary: '警告', detail: '授权添加失败'});
            }
          })
      }
  }

  /* 点击选择角色关联 */
  clickLink(value,type){
    this.linkTableDisplay = true;
    this.selectedLinkModule = type;
    this.selectedRole = value;
    this.getLinkUrl();
    this.clickRole(this.selectedRole);
  }

  /* 返回到角色列表 */
  backRole(){
    this.linkTableDisplay = false;
    this.roleTableDisplay = true;
  }
}
