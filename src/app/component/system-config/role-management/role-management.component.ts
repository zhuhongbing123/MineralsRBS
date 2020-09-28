import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { LoginService } from '../../login/login.service';
import { Paginator } from 'primeng/primeng';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  @ViewChild('clickPaginator', { static: true }) paginator: Paginator; 
  @ViewChild('clickAddPaginator', { static: true }) addPaginator: Paginator;
  msgs: Message[] = [];
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数
  rowsPerPageOptions = [10, 20, 30];
  addLimit = 10;//添加列表每页行数


  public roleTitle: any;// 角色列表标题
  public roleValue: any;// 角色列表数据
  public roleTotal;//登录日志列表总数
  public LIMIT_LOGIN = 10;//登录日志列表每页显示数量
  public LIMIT_LOGIN_ADD = 10;//登录日志列表每页显示数量
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
  public addLinkDisplay = false;//关联模块弹出框是否显示
  public selectedLink;//已选择的关联列表数据
  public addLinkValue;//添加关联模块列表的数据
  public addLinkTitle;//添加关联模块列表标题
  public selectedAddLink;//已选择添加关联模块列表值
  public selectedDeleteLink = [];//已选择删除关联模块列表值
  public addLinkHeader;//添加角色关联模块弹出框标题
  public addLinkTotal;//添加角色列表总数
  public addLinkUrl = 'role/api';//添加角色列表获取数据的url

  addDisplay = false;//新增按钮显示
  modifyDisplay = false;//修改按钮显示
  deleteDisplay = false;//删除按钮显示
  viewAPI = false;//查看授权API按钮显示
  addAPI = false;//新增API按钮显示
  deleteAPI = false;//删除API按钮显示
  viewUser = false;//关联用户按钮显示
  addUser = false;//增加用户按钮显示
  deleteUser = false;//删除用户按钮显示
  searchDisplay = false;//搜索按钮显示
  searchAPIDisplay = false;//API搜索显示
  selectAPIDisplay = false;//API分类下拉框显示

  loading: boolean;//列表加载动画显示
  filteredRole: any[];//搜索时显示下拉框的角色名
  filteredRoleName: string;//搜索的角色名
  allRoleName;//所有角色名

  apiClassify = [{
    label: '全部',
    value: 0
  }];//api分类
  selectApiClassify;//已选择的分类名称
  selectTeamId: number = 0;//api分类ID 0表示获取全部
  filteredAPIName;//搜索API名称
  filteredAPI: any[];//搜索API下拉框值
  isSelect = false;//是否选择下拉框

  constructor(private httpUtil: HttpUtil,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.getTableValue();
  }

  //初始化列表数据
  getTableValue() {
    this.roleTitle = [
      { field: 'name', header: '名称' },
      { field: 'code', header: '编码' },
      { field: 'status', header: '状态' }

    ];
    this.roleLink = [
      { label: '授权API', value: '授权API' },
      { label: '授权菜单', value: '授权菜单' },
      { label: '关联用户', value: '关联用户' }
    ];
    this.roleStatus = [
      { label: '正常', value: '正常' },
      { label: '禁用', value: '禁用' }
    ];

    this.loading = true;
    //获取授权的API资源
    if (!sessionStorage.getItem('api')) {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: '警告', detail: '请重新登录' });
      this.loginService.exit();
      return;
    }
    //获取授权的API资源
    JSON.parse(sessionStorage.getItem('api')).forEach(element => {
      if (element.uri === '/role' && element.method == 'POST') {
        this.addDisplay = true;
      };
      if (element.uri === '/role' && element.method == 'PUT') {
        this.modifyDisplay = true;
      };
      if (element.uri === '/role/*' && element.method == 'DELETE') {
        this.deleteDisplay = true;
      };
      if (element.uri === '/role/api/*/*/*' && element.method == 'GET') {
        this.viewAPI = true;
      }

      if (element.uri === '/role/user/*/*/*' && element.method == 'GET') {
        this.viewUser = true;
      }
      if (element.uri === '/role/search/*/*' && element.method == 'POST') {
        this.searchDisplay = true;
      }
      if (element.uri === '/resource/search/-/*/*/*/*' && element.method == 'POST') {
        this.searchAPIDisplay = true;
      }
      if (element.uri === '/resource/api/*/*/*' && element.method == 'GET') {
        this.selectAPIDisplay = true;
      }


    });
    if (!this.deleteDisplay && !this.modifyDisplay) {
      this.roleTitle.splice(this.roleTitle.length - 1, 1)
    }
    if (!this.viewAPI && !this.viewUser) {
      this.roleTitle.splice(this.roleTitle.length - 1, 1)
    }
    this.getRoleValue();
    this.getLinkUrl();
    this.getRoleName();
  }
  /* 获取角色数据 */
  getRoleValue() {
    this.httpUtil.get('role/' + this.startPage + '/' + this.limit).then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        this.roleTotal = value.data.data.total;

        for (let i = 0; i < data.length; i++) {
          data[i].number = (this.startPage - 1) * this.limit + i + 1;
          if (data[i].status == 1) {
            data[i].status = '正常';
          } else {
            data[i].status = '禁用';
          }
        }
        this.roleValue = data;
        this.loading = false;
      }
    })
  }

  /* 获取角色名字 */
  getRoleName() {
    this.httpUtil.get('role/name').then(value => {
      if (value.meta.code === 6666) {
        this.allRoleName = value.data.roleNames;
      }
    })
  }

  /* 获取搜索的角色 */
  getFilteredRole() {
    this.httpUtil.post('role/search/' + this.startPage + '/' + this.limit, {
      roleName: this.filteredRoleName ? this.filteredRoleName : ''
    }).then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.roles.list;
        this.roleTotal = value.data.roles.total;

        for (let i = 0; i < data.length; i++) {
          data[i].number = (this.startPage - 1) * this.limit + i + 1;
          if (data[i].status == 1) {
            data[i].status = '正常';
          } else {
            data[i].status = '禁用';
          }
        }
        this.roleValue = data;
        this.loading = false;
      }
    })
  }

  /* 获取API分类 */
  getApiClassify() {
    this.httpUtil.get('resource/api/-1/1/10000').then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.data;
        this.apiClassify = [{
          label: '全部',
          value: 0
        }];
        for (let i in data) {
          if (data[i].name !== '分类集合(API类别请放入此集合)') {
            this.apiClassify.push({
              label: data[i].name,
              value: data[i].id
            })
          }

        }

      }
    });


  }

  /* 角色表格切换页码 */
  rolePageChange(event) {
    this.startPage = event.page + 1;
    this.limit = event.rows;
    if (this.filteredRoleName) {
      this.loading = true;
      this.getFilteredRole();
    } else {
      this.getRoleValue();
    }

  }

  /* 右侧关联表格页码切换 */
  linkPageChange(event, type) {
    let page = event.page + 1;
    let rows = event.rows;
    let url;
    if (this.isSelect) {//是否选择的下拉框
      this.isSelect = false;
      return;
    }
      
    //url = this.addLinkUrl+'-/'+this.selectedRole.id;
    if (type == 'add') {
      url = this.addLinkUrl + '-/' + this.selectedRole.id;
      if (this.selectTeamId !== 0) {
        url = 'role/api/-/' + this.selectedRole.id + '/' + this.selectTeamId + '/';
      }
      this.filteredAPIName = '';
      this.addLimit = rows;
    } else if (type == 'link') {
      url = this.addLinkUrl + this.selectedRole.id;
    }

  
    this.selectTeamId = this.selectApiClassify ? this.selectApiClassify:0;
      this.startPage = event.page + 1;
      this.limit = event.rows;
      //选择下拉框后切换页码
    if (this.selectApiClassify){
      this.getFilteredApi(type);
      //this.selectApiClassify = '';
      return;
    }
   

    this.httpUtil.get(url + '/' + page + '/' + rows).then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.data.list;

        for (let i = 0; i < data.length; i++) {
          data[i].number = (this.startPage - 1) * this.limit + i + 1;
          if (data[i].status == 1) {
            data[i].status = '有效'
          }
        }
        if (type == 'add') {
          this.addLinkTotal = value.data.data.total;
          this.addLinkValue = data;
        } else {
          this.linkTotal = value.data.data.total;
          this.linkTableValue = data;
        }

      }
    })
  }
  /* 点击角色列表单选按钮 */
  clickRole(data) {
    if (this.selectedRole) {
      this.clickRoleName = data.name;
      //当右侧列表显示并且已选择关联模块时
      if (this.linkTableDisplay && this.selectedLinkModule) {
        this.getLinkValue(data.id);
      }
    } else {
      this.clickRoleName = '';
    }
  }

  /* 获取右侧关联列表数据 */
  getLinkValue(id, type?) {
    this.httpUtil.get(this.addLinkUrl + id + '/' + this.startPage + '/' + this.limit).then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        this.linkTotal = value.data.data.total;

        for (let i = 0; i < data.length; i++) {
          data[i].number = (this.startPage - 1) * this.limit + i + 1;
          if (data[i].status == 1) {
            data[i].status = '有效'
          }
        }
        this.linkTableValue = data;
        //更新当前角色的授权API
        if (type && this.addLinkUrl == 'role/api/' && id == JSON.parse(sessionStorage.getItem('roleId'))) {
          this.httpUtil.get(this.addLinkUrl + id).then(value => {
            if (value.meta.code === 6666) {
              let data = value.data.data;
              sessionStorage.setItem('api', JSON.stringify(data));
            }
          })
        }
      }
    })
  }


  /* 角色列表的操作 */
  setRole(type, value?) {
    this.roleCode = '';
    this.roleName = '';
    this.selectedroleStatus = '';
    if (type == 'add') {
      this.roleOpreationHeader = '添加角色';
      this.roleOpreationDisplay = true;
      return;
    }
    /* 搜索角色 */
    if (type === 'filtered') {
      this.getFilteredRole();
      return;
    }
    this.selectedRole = value;
    if (this.selectedRole) {
      if (type == 'modify') {
        this.roleOpreationHeader = '修改角色(' + value.name + ')';
        this.roleOpreationDisplay = true;
        this.roleCode = this.selectedRole.code;
        this.roleName = this.selectedRole.name;
        this.selectedroleStatus = this.selectedRole.status;
      } else {
        this.confirmationService.confirm({
          message: '确认删除该角色(' + value.name + ')吗?',
          header: '删除角色',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: '确定',
          rejectLabel: '取消',
          accept: () => {
            this.httpUtil.delete('role/' + this.selectedRole.id).then(value => {
              if (value.meta.code === 6666) {
                this.getRoleValue();
              }
            })
          },
          reject: () => {

          }
        });
      }

    } else {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: '警告', detail: '请选择角色' });
    }

  }

  /* 新增修改角色保存 */
  saveRole() {
    if (!this.roleCode) {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: '警告', detail: '角色名称不能为空' });
      return;
    }
    if (this.roleOpreationHeader == '添加角色') {
      this.httpUtil.post('role', {
        code: this.roleCode,
        name: this.roleName,
        status: this.selectedroleStatus == '正常' ? 1 : 0
      }).then(value => {
        if (value.meta.code === 6666) {
          this.getRoleValue();
          this.roleOpreationDisplay = false;
          this.messageService.add({ key: 'tc', severity: 'success', summary: '信息', detail: '新增角色成功' });
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: '信息', detail: value.meta.msg });
          return;
        }
      })
    } else {
      this.httpUtil.put('role', {
        code: this.roleCode,
        name: this.roleName,
        status: this.selectedroleStatus == '正常' ? 1 : 0,
        createTime: this.selectedRole.createTime,
        id: this.selectedRole.id,
        updateTime: this.selectedRole.updateTime
      }).then(value => {
        if (value.meta.code === 6666) {
          this.messageService.add({ key: 'tc', severity: 'success', summary: '信息', detail: '修改角色成功' });
          this.getRoleValue();
          this.roleOpreationDisplay = false;
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: '信息', detail: value.meta.msg });
          return;
        }
      })
    }

  }

  /* 右侧关联模块列表的操作 */
  setLink(type, value?) {
    let title = this.selectedLinkModule.slice(2);
    this.addLinkHeader = this.clickRoleName + '--添加' + title;
    //批量删除
    if (type == 'deleteMore') {
      let resourceIds = [];
      for (let i in this.selectedDeleteLink) {
        resourceIds.push(this.selectedDeleteLink[i].id);
      }
      this.confirmationService.confirm({
        message: '确认删除授权的API吗?',
        header: '删除' + title,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: '确定',
        rejectLabel: '取消',
        accept: () => {
          this.httpUtil.delete('role/authority/resources', {
            "resourceIds": resourceIds,
            "roleId": this.selectedRole.id

          }).then(value => {
            if (value.meta.code === 6666) {
              this.messageService.add({ key: 'tc', severity: 'success', summary: '信息', detail: '删除成功' });
              this.getLinkValue(this.selectedRole.id, 'delete');
            }
          })
        },
        reject: () => {

        }
      });
      return;
    }
    if (value) {
      this.selectedLink = value;
    }

    this.getLinkUrl();
    if (type == 'add') {
    
      this.httpUtil.get(this.addLinkUrl + '-/' + this.selectedRole.id + '/1/' + this.addLimit).then(value => {

        if (value.meta.code === 6666) {
          let data = value.data.data.list;
          this.addLinkTotal = value.data.data.total;
          
          for (let i = 0; i < data.length; i++) {
            data[i].number = (this.startPage - 1) * this.limit + i + 1;
            if (data[i].status == 1) {
              if (this.selectedLinkModule === '关联用户') {
                data[i].status = '正常';
              } else {
                data[i].status = '有效';
              }

            }
          }
          this.addLinkValue = data;
          this.selectedAddLink = '';
         // this.LIMIT_LOGIN_ADD = 20;
          this.selectApiClassify = 0;
          this.addLinkDisplay = true;
        }
      })

    } else {
      let url, message;
      if (this.addLinkUrl == 'role/user/') {
        url = 'user/authority/role/' + this.selectedLink.uid + '/' + this.selectedRole.id;
        message = '确认删除用户(' + value.username + ')吗?'
      } else {
        url = 'role/authority/resource/' + this.selectedRole.id + '/' + this.selectedLink.id;
        message = '确认删除API(' + value.name + ')吗?'
      }
      this.confirmationService.confirm({
        message: message,
        header: '删除' + title,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: '确定',
        rejectLabel: '取消',
        accept: () => {
          this.httpUtil.delete(url).then(value => {
            if (value.meta.code === 6666) {
              this.messageService.add({ key: 'tc', severity: 'success', summary: '信息', detail: '删除成功' });
              this.getLinkValue(this.selectedRole.id, 'delete');
            }
          })
        },
        reject: () => {

        }
      });
    }
  }

  /* 设置关联模块的url和标题 */
  getLinkUrl() {
    if (this.selectedLinkModule === '授权API') {
      this.addLinkUrl = 'role/api/';
      this.addLinkTitle = [
        { field: 'name', header: '名称' },
        { field: 'uri', header: 'URI' },
        { field: 'method', header: '访问方式' },
        { field: 'status', header: '状态' },
        { field: 'operation', header: '操作' }
      ]
    } else if (this.selectedLinkModule === '授权菜单') {
      this.addLinkUrl = 'role/menu/';
      this.addLinkTitle = [
        { field: 'name', header: '名称' },
        { field: 'code', header: '编码' },
        { field: 'uri', header: 'URI' },
        { field: 'status', header: '状态' },
        { field: 'operation', header: '操作' }
      ]
    } else {
      this.addLinkUrl = 'role/user/';
      this.addLinkTitle = [
        { field: 'username', header: '名称' },
        { field: 'phone', header: '电话' },
        { field: 'email', header: '邮箱' },
        { field: 'status', header: '状态' },
        { field: 'operation', header: '操作' }
      ]
    }
  }
  /* 保存添加的关联模块 */
  saveAddLink() {
    let url, body;

    if (this.selectedAddLink) {
      if (this.addLinkUrl == 'role/user/') {
        url = 'user/authority/role';
        let uid = [];
        for (let i in this.selectedAddLink) {
          uid.push(parseInt(this.selectedAddLink[i].uid));
        }
        body = {
          uid: uid,
          roleId: this.selectedRole.id
        }
      } else {
        //添加API
        url = 'role/authority/resources';
        let resourceId = [];
        for (let i in this.selectedAddLink) {
          resourceId.push(this.selectedAddLink[i].id);
        }
        body = {
          resourceIds: resourceId,
          roleId: this.selectedRole.id.toString()
        }
      }
      this.httpUtil.post(url, body).then(value => {
        if (value.meta.code === 6666) {
          this.getLinkValue(this.selectedRole.id, 'add');
          this.messageService.add({ key: 'tc', severity: 'success', summary: '信息', detail: '授权添加成功' });
          this.addLinkDisplay = false;
        } else {
          this.messageService.add({ key: 'tc', severity: 'error', summary: '警告', detail: '授权添加失败' });
        }
      })
    }
  }

  /* 点击选择角色关联 */
  clickLink(value, type) {
    this.linkTableDisplay = true;
    this.selectApiClassify = '';
    this.selectedLinkModule = type;
    this.selectedRole = value;
    this.addAPI = false;
    this.deleteAPI = false;
    this.addUser = false;
    this.deleteUser = false;
    this.selectedDeleteLink = [];
    JSON.parse(sessionStorage.getItem('api')).forEach(element => {
      if (element.uri === '/role/authority/resource' && element.method == 'POST' && type == '授权API') {
        this.addAPI = true;
      }
      if (element.uri === '/role/authority/resource/*/*' && element.method == 'DELETE' && type == '授权API') {
        this.deleteAPI = true;
      }
      if (element.uri === '/user/authority/role' && element.method == 'POST' && type == '关联用户') {
        this.addUser = true;
      }
      if (element.uri === '/user/authority/role/*/*' && element.method == 'DELETE' && type == '关联用户') {
        this.deleteUser = true;
      }
    })
    this.getLinkUrl();
    this.getApiClassify();
    this.clickRole(this.selectedRole);
  }

  /* 返回到角色列表 */
  backRole() {
    this.linkTableDisplay = false;
    this.roleTableDisplay = true;
  }

  /* 搜索角色名 */
  filteredRoles(event) {
    this.filteredRole = [];
    for (let i in this.allRoleName) {
      let brand = this.allRoleName[i];
      if (brand.toLowerCase().indexOf(event.query.toLowerCase()) > -1) {
        this.filteredRole.push(brand);
      }
    }
  }

  /* 选择资源类别 */
  selectClassify(type?) {
    this.startPage = 1;
    this.limit = 10;
    this.isSelect = true;
    if (!this.addLinkDisplay){
      this.paginator.changePage(0);
    }else{
      this.addPaginator.changePage(0);
    }
    
    this.selectTeamId = this.selectApiClassify;
    this.filteredAPIName = '';
    this.getApiValue(type);
  }

  /* 获取api数据 */
  getApiValue(type?) {
    let url;
    this.linkTotal = 0;
    this.addLinkTotal = 0;
    if(type){//已经添加的API
      if (this.selectTeamId == 0) {
        url = 'role/api/' + this.selectedRole.id + '/' + this.startPage + '/' + this.limit
      } else {
        url = 'role/api/' + this.selectedRole.id + '/' + this.selectTeamId + '/' + this.startPage + '/' + this.limit
      }
    }else{
      if (this.selectTeamId == 0) {
        url = 'role/api/-/' + this.selectedRole.id + '/' + this.startPage + '/' + this.limit
      } else {
        url = 'role/api/-/' + this.selectedRole.id + '/' + this.selectTeamId + '/' + this.startPage + '/' + this.limit
      }
    }
    
    this.httpUtil.get(url).then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.data.list;
        
        if (type) {
          this.linkTotal = value.data.data.total;
        } else {
          this.addLinkTotal = value.data.data.total;
        }
        for (let i = 0; i < data.length; i++) {
          data[i].number = (this.startPage - 1) * this.limit + i + 1;
          if (data[i].status == 1) {
            data[i].status = '正常'
          }
          if (data[i].status == 9) {
            data[i].status = '禁用'
          }
          for (let j in this.apiClassify) {
            if (data[i].parentId == this.apiClassify[j].value && data[i].type !== 3) {
              data[i]['classify'] = this.apiClassify[j].label;
            }
          }
        } 
        if(type){
          this.linkTableValue = data;
        }else{
          this.addLinkValue = data;
        }
        
      }
    })
  }
  /* 通过名称搜索API */
  getFilteredApi(type) {
    let url;
    if(type=='link'){
      url = 'resource/search/' + this.selectedRole.id + '/' + this.selectTeamId + '/' + this.startPage + '/' + this.limit;
    }else{
      url = 'resource/search/-/' + this.selectedRole.id + '/' + this.selectTeamId + '/' + this.startPage + '/' + this.limit;
    }
    

    this.httpUtil.post(url, {
      resourceName: this.filteredAPIName ? this.filteredAPIName : ''
    }).then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.resources.list;
       

        for (let i = 0; i < data.length; i++) {
          data[i].number = (this.startPage - 1) * this.limit + i + 1;
          if (data[i].status == 1) {
            data[i].status = '正常'
          }
          if (data[i].status == 9) {
            data[i].status = '禁用'
          }
          for (let j in this.apiClassify) {
            if (data[i].parentId == this.apiClassify[j].value) {
              data[i]['classify'] = this.apiClassify[j].label;
            }
          }
        }
        if(type =='link'){
          this.linkTableValue = data;
          this.linkTotal = value.data.resources.total;
        }else{
          this.addLinkValue = data;
          this.addLinkTotal = value.data.resources.total;
        }
        
      }
    })
  }


}
