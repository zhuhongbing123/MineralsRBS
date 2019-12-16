import { Component, Input, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/primeng';

import { RouterLink, Router } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HttpUtil } from '../../common/util/http-util';

@Component({
  selector: 'menu',
  template: `
        <ul app-submenu [item]="model" root="true" class="layout-menu layout-main-menu clearfix"
            [reset]="reset" visible="true" parentActive="true"></ul>
    `
})
export class MenuComponent implements OnInit {

  @Input() reset: boolean;

  models: any[];
  model: any[];

  theme = 'blue';

  layout = 'blue';

  version = 'v3';
  menuList = [];//左侧菜单
  menuTree = [];
  constructor(public app: LayoutComponent, 
              private router: Router,
              private httpUtil: HttpUtil) { }

  ngOnInit() {
   // this.getMenuValue();
    this.models = [
     
      {
        label: '矿业权政策', icon: 'fa fa-file-text',
        items: [
          { label: '矿业权政策文件分类', icon: 'fa fa-file-text-o', routerLink: ['/layout/mineralPolicy/policyFile'] },
          { label: '矿业权政策报告', icon: 'fa fa-file-text-o', routerLink: ['/layout/mineralPolicy/policyReport'] }
        ]
      },
      {
        label: '探矿权', icon: 'fa fa-fw  fa-tags',
        items: [
          { label: '探矿权文件分类', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/explorationRight/explorationFile'] },
          { label: '探矿权信息', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/explorationRight/explorationInfo'] }
        ]
      },
      {
        label: '采矿权', icon: 'fa fa-fw  fa-tags',
        items: [
          { label: '采矿权文件分类', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/miningRight/miningFile'] },
          { label: '采矿权信息', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/miningRight/miningInfo'] }
        ]
      },
      {
        label: '矿权管理', icon: 'fa fa-fw  fa-tags',
        items:[
          {label: '矿权项目管理', icon: 'fa fa-fw  fa-tags',routerLink: ['/layout/mineralManage/mineralProject']},
          {label: '矿权人管理', icon: 'fa fa-fw  fa-tags',routerLink: ['/layout/systemConfig/mineralOwner']} 
        ]
        
      },
      {
        label: '地图', icon: 'fa fa-fw  fa-map',
        items: [
          { label: '矿权地图', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/mapManage/outDoor'] }
        ]
      },
      {
        label: '系统配置', icon: 'fa fa-fw  fa-tags', 
        items: [
          { label: '角色管理', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/systemConfig/roleManage'] },
          { label: '用户管理', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/systemConfig/userManage'] },
          { label: 'API授权管理', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/systemConfig/apiManage'] },
          /* { label: '菜单管理', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/systemConfig/menuManage'] }, */
          { label: '登录日志', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/systemConfig/loginLog'] },
          { label: '操作日志', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/systemConfig/operationLog'] }
          
        ]

      }
    ];
    let menuData = JSON.parse(localStorage.getItem('menu'))
    let parentIds = []
    let childrens = []
    let menu = []
    // menuData.filter((itemA, indexA) => {
    //   if (itemA.pId === null) {
    //     let item = {
    //       'label': itemA.name,
    //       'icon': itemA.icon,
    //       'itemId': indexA
    //     }
    //     if (itemA.name === '首页') {
    //       item['routerLink'] = ['']
    //     }
    //     menu.push(item)
    //     parentIds.push(itemA.id)
    //   } else {
    //     itemA.itemId = indexA
    //     childrens.push(itemA)
    //   }
    // })
    parentIds.map((itemA, indexA) => {
      let arr = []
      childrens.map(itemB => {
        if (itemA === parseInt(itemB.pId)) {
          let value = {
            label: itemB.name,
            icon: itemB.icon,
            routerLink: [itemB.url],
            itemId: itemB.itemId
          }
          arr.push(value)
        }
      })
      if (itemA !== 1) {
        menu[indexA]['items'] = arr
      }
    })
    this.model = this.models
  }

  /* 获取左侧菜单数据 */
  getMenuValue(){
    this.httpUtil.get('resource/menus').then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.menuTree;
        this.getMenuTree(data);
        //this.model = this.getMenuList(this.menuList,-1)
      }
    })
  }
  getMenuTree(data){
    data.forEach(menu => {
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

  changeTheme(theme: string) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');

    if (this.version === 'v3') {
      themeLink.href = 'assets/theme/theme-' + theme + '.css';
    } else {
      themeLink.href = 'assets/theme/theme-' + theme + '-v4' + '.css';
    }

    this.theme = theme;

  }

  changeLayout(layout: string, special?: boolean) {
    const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');

    if (this.version === 'v3') {
      layoutLink.href = 'assets/layout/css/layout-' + layout + '.css';
    } else {
      layoutLink.href = 'assets/layout/css/layout-' + layout + '-v4' + '.css';
    }

    this.layout = layout;

    if (special) {
      this.app.darkMenu = true;
    }
  }

  changeVersion(version: string) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
    const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');

    if (version === 'v3') {
      this.version = 'v3';
      themeLink.href = 'assets/theme/theme-' + this.theme + '.css';
      layoutLink.href = 'assets/layout/css/layout-' + this.layout + '.css';
    } else {
      themeLink.href = 'assets/theme/theme-' + this.theme + '-v4' + '.css';
      layoutLink.href = 'assets/layout/css/layout-' + this.layout + '-v4' + '.css';
      this.version = '-v4';
    }

  }
}

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-submenu]',
  /* tslint:enable:component-selector */
  template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass" *ngIf="child.visible === false ? false : true">
                <a data-id='child.itemId' [href]="child.url||'#'" (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)"
                   class="ripplelink" *ngIf="!child.routerLink"
                    [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i [ngClass]="child.icon"></i><span>{{child.label}}</span>
                    <i class="fa fa-fw fa-angle-down menuitem-toggle-icon" *ngIf="child.items"></i>
                    <span data-id='child.itemId' class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>

                <a data-id='child.itemId' (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink" *ngIf="child.routerLink"
                    [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                   [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i [ngClass]="child.icon"></i><span>{{child.label}}</span>
                    <i class="fa fa-fw fa-angle-down menuitem-toggle-icon" *ngIf="child.items"></i>
                    <span data-id='child.itemId' class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>
                <div class="layout-menu-tooltip">
                    <div class="layout-menu-tooltip-arrow"></div>
                    <div class="layout-menu-tooltip-text">{{child.label}}</div>
                </div>
                <div class="submenu-arrow" *ngIf="child.items"></div>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset" [parentActive]="isActive(i)"
                    [@children]="(app.isSlim()||app.isHorizontal())&&root ? isActive(i) ?
                     'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
  animations: [
    trigger('children', [
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        display: 'block'
      })),
      state('hidden', style({
        display: 'none'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class SubMenuComponent {

  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  _parentActive: boolean;

  activeIndex: number;

  constructor(public app: LayoutComponent, private router: Router) { }

  itemClick(event: Event, item: MenuItem, index: number) {
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    this.activeIndex = (this.activeIndex === index) ? null : index;

    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        this.app.layoutMenuScrollerViewChild.moveBar();
      }, 450);
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      if (this.app.isHorizontal() || this.app.isSlim()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }
      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
    let localUrl = window.location.href
    let key = Object.keys(item)
    // 判断是否为二级菜单
    // if (key.includes('routerLink')) {
    //   window.sessionStorage.removeItem('local');//清除轨迹的session值
    //   // 判断是否点击第二次导航
    //   let URl = localUrl.split('/')
    //   let clickURl = item.routerLink[0].split('/')
    //   if (URl[URl.length - 1] === clickURl[clickURl.length - 1]) {
    //     this.router.navigate(['layout/intermediary-route/intermediary-route'])
    //   }
    // }
  }

  onMouseEnter(index: number) {
    if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())
      && !this.app.isMobile() && !this.app.isTablet()) {
      this.activeIndex = index;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input() get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
      this.activeIndex = null;
    }
  }

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }

  set parentActive(val: boolean) {
    this._parentActive = val;

    if (!this._parentActive) {
      this.activeIndex = null;
    }
  }
}
