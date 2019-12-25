import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { LoginService } from '../../login/login.service';
import { RegisterService } from '../../register/register.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  items: MenuItem[];
  public userTableTitle;//用户列表标题
  public userTableValue;//用户列表数据
  public userTotal;//用户列表总数
  public userRoleSelect;//角色下拉框值
  public selectedUserRole;//已选择的角色数据
  public userRoleDisplay = false;//用户角色是否显示
  public roleValue;//角色数据
  public roleTitle;//角色标题
  selectedRole;//已选择的角色
  roleTotal;//角色总数
  public LIMIT_LOGIN=10;//列表每页显示数量
  public selectUser;//已选择用户
  pageSize = 10;//列表每页数量
  pageNumber = 1;//列表第几页
  userTitle;//弹出框标题

  addDisplay = false;//添加用户角色
  modifyDisplay = false;//修改用户角色
  deleteDisplay = false;//删除用户角色
  searchDisplay = false;//搜索用户按钮

  filteredUserName;//输入的用户名
  filteredUser:any[];//搜索框下拉的用户名
  allUserName;//所有用户名字
  loading: boolean;//列表加载动画显示
  userDisplay = false;//用户弹出框
  accountName;//账户名名称
  userName;//用户 名称
  password;//密码
  userRowData;//用户当行数据
  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private loginService: LoginService,
              private registerService: RegisterService) { }

  ngOnInit() {
    this.getTableValue();
  }

  /* 用户列表初始化 */
  getTableValue(){
    this.userTableTitle =[
      { field: 'number', header: '序号' },
      { field: 'username', header: '用户名' },
      { field: 'role', header: '角色' },
      { field: 'createTime', header: '创建时间' },
      { field: 'operation', header: '操作' },
    ];
    this.roleTitle = [
      { field: 'number', header: '序号' },
      { field: 'name', header: '名称' },
      { field: 'code', header: '编码' },
      { field: 'status', header: '状态' },
    ];

    this.items = [
      {label: '删除角色', command: (e) => {
        this.setUserRole('','deleteRole')
      }},
      {label: '修改用户', command: () => {
          //this.delete();
      }},
      {label: '删除用户',  url: 'http://angular.io'}
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
      if(element.uri ==='/user/authority/role' && element.method =='POST'){
        this.addDisplay =true;
      };
      if(element.uri ==='/user/update/role' && element.method =='POST'){
        this.modifyDisplay =true;
      };
      if(element.uri ==='/user/authority/role/*/*' && element.method =='DELETE'){
        this.deleteDisplay =true;
      };
      if(element.uri ==='/user/search/*/*' && element.method =='POST'){
        this.searchDisplay =true;
      }
      
    });
    if(!this.deleteDisplay){
      this.items.splice(1,this.items.length)
    }
    if(!this.modifyDisplay && !this.deleteDisplay){
      this.userTableTitle.splice(this.userTableTitle.length-1,1);
    }
    this.getUserValue();
    this.getUserName();
  }

  /* 获取用户数据 */
  getUserValue(){
      this.httpUtil.get('user/list/'+this.pageNumber+'/'+this.pageSize).then(value=>{
        if (value.meta.code === 6666) {
          let data = value.data.pageInfo.list;
          this.userTotal = value.data.pageInfo.total;
          for(let i=0; i<data.length;i++){
            data[i].number = (this.pageNumber-1)*this.pageSize+i +1;
            if(data[i].succeed==1){
              data[i].succeed = '成功'
            }
            
        }
        this.userTableValue = data;
        this.loading = false;
        }
      }).then(()=>{
        this.getRoleValue();
      });
      
  }

  /* 获取所有用户名称 */
  getUserName(){
    this.httpUtil.get('user/name').then(value=>{
      if (value.meta.code === 6666) {
        this.allUserName = value.data.userNames;
      }
    })
  }

  getRoleValue(){
    //获取角色数据
    this.httpUtil.get('role/'+this.pageNumber+'/'+this.pageSize).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        this.roleTotal = value.data.data.total;
        for(let i=0; i< data.length;i++){
          data[i].number = (this.pageNumber-1)*this.pageSize+i +1;
          if(data[i].status==1){
            data[i].status = '正常'
          }else{
            data[i].status = '禁用'
          }
          
      }
      this.roleValue = data;
      for(let i in  this.userTableValue){
          for(let j in data){
            if(this.userTableValue[i].roleId == data[j].id){
              this.userTableValue[i].role = data[j].name;
            }
          }
      }
      }
    });
  }

  /* 通过用户名搜索用户 */
  getFilteredUser(){
    this.httpUtil.post('user/search/'+this.pageNumber+'/'+this.pageSize,{
      userName: this.filteredUserName?this.filteredUserName:''
    }).then(value=>{
      let data = value.data.users.list;
      this.userTotal = value.data.users.total;
      for(let i=0; i<data.length;i++){
        data[i].number = (this.pageNumber-1)*this.pageSize+i +1;
          if(data[i].succeed==1){
            data[i].succeed = '成功'
          }
            
      }
      this.userTableValue = data;
    }).then(()=>{
      this.getRoleValue();
    });
  }

  /* 获取用户角色 */
  setUserRole(value,type){
    if(!value){
      value = this.userRowData;
    }
    this.selectUser = value;
    /* 搜索用户名 */
    if(type=='filtered'){
      this.getFilteredUser();
      return;
    }

    if(type=='add'){
      this.userDisplay = true;
      return;
    }
    if(type=='modify'){
      this.userName = value.userName;
      this.accountName = value.uid;
      return;
    }
    if(type =='deleteRole'){
      this.confirmationService.confirm({
        message: '确认删除该用户('+value.username+')的角色('+value.role+')吗?',
        header: '删除角色',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('user/authority/role/'+value.uid+'/'+value.roleId).then(value=>{
            if (value.meta.code === 6666) {
              this.getUserValue();
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除角色成功'});
            }
          })
        },
        reject: () => {
        
        }
      });
    }else{
      this.userTitle = '用户角色管理('+value.username+')';
      this.userRoleDisplay = true;
      this.selectedRole = '';
    }
    

  }
  /* 保存角色 */
  saveRole(){
    this.selectedRole;
    if(this.selectUser.roleId){
      //修改角色
        this.httpUtil.post('user/update/role',{
          uid:this.selectUser.uid.toString(),
          oldRoleId:this.selectUser.roleId.toString(),
          newRoleId:this.selectedRole.id.toString()
        }).then(value=>{
          if (value.meta.code === 6666) {
            this.getUserValue();
            this.userRoleDisplay = false;
            this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '修改角色成功'});
          }
        })
    }else{
      //添加角色
      this.httpUtil.post('user/authority/role',{
        uid:this.selectUser.uid.toString(),
        roleId:this.selectedRole.id.toString()
      }).then(value=>{
        if (value.meta.code === 6666) {
          this.getUserValue();
          this.userRoleDisplay = false;
          this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加角色成功'});
        }
        
      })
    }
  }

  /* 切换列表页 */
  pageChange(event,type){
    this.pageNumber = event.page+1;
    this.pageSize = event.rows;
      if(this.filteredUserName){
        this.getFilteredUser();
      }
      if(type==='user'){
        this.getUserValue();
      }else{
        this.getRoleValue();
      }
  }

  /* 过滤显示用户名 */
  filteredUsers(event){
    this.filteredUser = [];
    for(let i in this.allUserName){
      let brand = this.allUserName[i];
      if(brand.toLowerCase().indexOf(event.query.toLowerCase()) >-1) {
          this.filteredUser.push(brand);
      }
    }
  }

  /* 添加用户 */
  saveOwner(){
    this.password = this.password
    const getToken$ = this.registerService.getTokenKey().subscribe(
      data => {

        if (data.data.tokenKey !== undefined) {
          const tokenKey = data.data.tokenKey;
          const userKey = data.data.userKey;
          getToken$.unsubscribe();
            const register$ = this.registerService.register(this.accountName, this.userName, this.password, tokenKey, userKey).subscribe(
              data2=> {
                // 注册成功返回
                if (data2.meta.code === 2002) {
                  this.getUserValue();
                  this.messageService.add({key: 'tc', severity:'success', summary: '提示', detail: '用户添加成功'});
                  this.userDisplay = false;
                  register$.unsubscribe();
                } else {
                  this.messageService.add({key: 'tc', severity:'warn', summary: '警告', detail: '该用户已存在'});
                  register$.unsubscribe();
                }
              },
              () => {
                this.messageService.add({key: 'tc', severity:'error', summary: '警告', detail: '服务器开小差了'});
                register$.unsubscribe();
              })
          }
      })
  }

  aaa(event){
    let aa;
  }
}
