import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

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
  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getTableValue();
  }

  /* 用户列表初始化 */
  getTableValue(){
    this.userTableTitle =[
      { field: 'uid', header: 'UID' },
      { field: 'username', header: '用户名' },
      { field: 'role', header: '角色' },
      { field: 'createTime', header: '创建时间' },
      { field: 'operation', header: '操作' },
    ];
    this.roleTitle = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: '名称' },
      { field: 'code', header: '编码' },
      { field: 'status', header: '状态' },
    ]
    this.getUserValue();
  }

  /* 获取用户数据 */
  getUserValue(){
      this.httpUtil.get('user/list/'+this.pageNumber+'/'+this.pageSize).then(value=>{
        if (value.meta.code === 6666) {
          let data = value.data.pageInfo.list;
          this.userTotal = value.data.pageInfo.total;
          for(let i in data){
            if(data[i].succeed==1){
              data[i].succeed = '成功'
            }
            
        }
        this.userTableValue = data;
        }
      }).then(()=>{
        this.getRoleValue();
      });
      
  }

  getRoleValue(){
    //获取角色数据
    this.httpUtil.get('role/'+this.pageNumber+'/'+this.pageSize).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        this.roleTotal = value.data.data.total;
        for(let i in data){
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
  /* 获取用户角色 */
  setUserRole(value,type){
    this.selectUser = value;
    if(type =='delete'){
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
        this.httpUtil.put('user/update/role',{
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
      if(type==='user'){
        this.getUserValue();
      }else{
        this.getRoleValue();
      }
  }
}
