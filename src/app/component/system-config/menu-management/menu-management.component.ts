import {Component, OnInit, TemplateRef} from '@angular/core';
import { MenuTreeNode } from '../../pojo/MenuTreeNode';
import {BsModalRef} from 'ngx-bootstrap';
import { AlertEnum } from '../../../common/alert-enum.enum';
import { AppConfig } from '../../../common/util/app-config';
import { HttpUtil } from '../../../common/util/http-util';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {
   menu: MenuTreeNode = new MenuTreeNode();
   menuTree: any[];
   menuList: any[] = [];
   public setMenuDisplay =false;
   selectedMenu: any;
   appMenuIcon: any[] = [
    'fa fa-share',
    'fa fa-pie-chart',
    'fa fa-th',
    'fa fa-folder',
    'fa fa-cog',
    'fa fa-heart',
    'fa fa-random',
    'fa-youtube-play',
    'fa fa-table',
    'fa fa-area-chart',
    'fa fa-bar-chart',
    'fa fa-adjust',
    'fa fa-cloud',
    'fa fa-picture-o',
    'fa fa-rss-square',
    'fa fa-send',
    'fa fa-share-alt',
    'fa fa-tag',
    'fa fa-user',
    'fa fa-wrench'
  ];//图标

  menuTableTitle;//菜单列表标题
  menuTableValue=[];//菜单列表数据
  modalName;//菜单模态框名称
  lastSelect;//最后选择的菜单
  constructor(private httpUtil: HttpUtil,
              private confirmationService: ConfirmationService) {
  }
   ngOnInit() {
    this.menuTableTitle =[
      { field: 'id', header: 'ID' },
      { field: 'name', header: '名称' },
      { field: 'code', header: '编码' },
      { field: 'uri', header: 'URI' },
      { field: 'parentName', header: '父菜单' },
      { field: 'status', header: '状态' },
      { field: 'operation', header: '操作' }
     ]
     this.getMenuValue();
     
   }
   getMenuValue(type?){
      this.httpUtil.get('resource/menus').then(value=>{
        if (value.meta.code === 6666) {
          let data = value.data.menuTree;
          this.menuList = [];
          this.getMenuTree(data);
          this.menuTree = this.getMenuList(this.menuList,-1);
          //为了刷新删除后的菜单列表
          if(type){
            this.getSelectedMenu(this.lastSelect)
          }
          let menuList = JSON.parse(JSON.stringify(this.menuList));
          for(let i in this.menuList){
            for(let j in menuList){
                if(this.menuList[i].parentId ===menuList[j].id){
                  this.menuList[i]['parentName'] = menuList[j].name;
                }
            }
          }
        } else if (value.meta.code === 1008) {
        
        }
      });
      
   }
    getMenuTree(data){
        data.forEach(menu => {
          menu['label']=menu.name;
          menu['value']=menu.id;
          this.menuList.push(menu);
          if (menu.children != null || menu.children === '') {
            this.getMenuTree(menu.children);
          }
        });
    }

    getMenuList(data,pid){
      var  temp,result=[];
      for(var i in data){
          if(data[i].parentId==pid){
            result.push(data[i]);
            data[i]['label']=data[i].name
              temp = this.getMenuList(data,data[i].id);           
              if(temp.length>0){
                  data[i].items=temp;
              }           
          }       
      }
      return result;
    }
 
    /* 保存菜单 */
    saveMenu(){
      
      if(this.modalName =='添加菜单'){
        this.httpUtil.post('resource/menu',this.menu).then(data=>{
          if (data.meta.code === 6666) {
            this.getMenuValue();
            this.setMenuDisplay = false;
            this.selectedMenu = this.menu.name;
          }
        });
      }else{
        this.httpUtil.put('resource/menu',this.menu).then(data=>{
          if (data.meta.code === 6666) {
            this.getMenuValue();
            this.setMenuDisplay = false;
            this.selectedMenu = this.menu.name;
          }
        });
      }
      
    }
    /* 点击菜单 */
    public getSelectedMenu(event: any) {
      this.lastSelect = event;
      if(event.target.innerText && event.target.innerText.indexOf('\n')<0){
        this.selectedMenu = event.target.innerText;
        this.menuTableValue=[];
        
        for(let i in this.menuList){
            if(this.selectedMenu === this.menuList[i].name){
                this.menuTableValue.push(this.menuList[i])
                this.getSelectedMenuList(this.menuList[i].children);
            }
        }
      }
    }

    /* 右侧列表数据实现 */
    getSelectedMenuList(data){
      for(let i in data){
        this.menuTableValue.push(data[i]);
        if (data[i].children != null || data[i].children === '') {
          this.getSelectedMenuList(data[i].children);
        }
      }
    }

    /* 对菜单进行编辑 */
    setMenu(type,value){
      if(type=='add'){
        this.modalName = '添加菜单';
        this.menu = new MenuTreeNode();
        this.setMenuDisplay = true;
        return;
      }
      if(type=='modify'){
        this.modalName = '修改菜单';
        this.setMenuDisplay = true;
        this.menu = value;
      }else{
        this.confirmationService.confirm({
          message: '确认删除该菜单吗?',
          header: '删除菜单',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel:'确定',
          rejectLabel:'取消',
          accept: () => {
            this.httpUtil.delete('resource/menu/'+value.id).then(value=>{
              if (value.meta.code === 6666) {
                this.getMenuValue('delete');
                
              }
            })
          },
          reject: () => {
          
          }
        });
      }
    }
}
