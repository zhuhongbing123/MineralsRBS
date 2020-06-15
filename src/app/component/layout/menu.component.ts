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
   let api = JSON.parse(sessionStorage.getItem('api'));
   let policyFile = false;//政策文件
   let policyReport = false;//政策报告
   let explorationFile = false;//探矿权文件
   let explorationInfo = false;//探矿权报告
   let miningFile = false;//采矿权文件
   let miningInfo = false;//采矿权报告
   let mineralProject = false;//矿业权名录
   let mineralOwner = false;//矿权人名录
   let roleManage = false;
   let userManage = false;
   let apiManage = false;
   let loginLog = false;
   let operationLog = false;
   let greenMining = false;
    this.models = [
      {
        label: '矿业权基本信息', icon: 'iconfont iconironstone',
        items: [
          { label: '矿业权名录', icon: 'iconfont iconxiangmu', routerLink: ['/layout/mineralManage/mineralProject'] },
          { label: '矿权人名录', icon: 'iconfont iconkuanggong', routerLink: ['/layout/systemConfig/mineralOwner'] }
        ]

      },
     
      {
        label: '矿业权政策', icon: 'iconfont iconzhengce',
        items: [
          { label: '分类目录', icon: 'iconfont iconbaogaoguanli', routerLink: ['/layout/mineralPolicy/policyFile'] },
          { label: '文件列表', icon: 'iconfont iconbaogao', routerLink: ['/layout/mineralPolicy/policyReport'] }
        ]
      },
      {
        label: '探矿权', icon: 'iconfont icontankuangquancaikuangquanpinggu',
        items: [
          { label: '资料类别目录', icon: 'iconfont iconbaogaoguanli', routerLink: ['/layout/explorationRight/explorationFile'] },
          { label: '探矿权信息', icon: 'iconfont iconkuangquanleixinggengzheng', routerLink: ['/layout/explorationRight/explorationInfo'] }
        ]
      },
      {
        label: '采矿权', icon: 'iconfont iconmineral',
        items: [
          { label: '资料类别目录', icon: 'iconfont iconbaogaoguanli', routerLink: ['/layout/miningRight/miningFile'] },
          { label: '采矿权信息', icon: 'iconfont iconcaikuangquanzhaopaiguachurangjieguogongshi', routerLink: ['/layout/miningRight/miningInfo'] }
        ]
      },
      
      {
        label: '远程监控', icon: 'iconfont iconjiankongshuju',
        items:[
          {label: '电量监控', icon: 'iconfont icondianliang',routerLink: ['/layout/remoteMonitoring/powerMonitoring']},
          {label: '安全监控', icon: 'iconfont iconjiankongshexiangtou-xian',routerLink: ['/layout/remoteMonitoring/cameraMonitoring']},
          {label: '环境监控', icon: 'iconfont iconhuanjingjiance',routerLink: ['/layout/remoteMonitoring/environmentMonitoring']},
          {label: '灾害监控', icon: 'iconfont icondizhizaihai',routerLink: ['/layout/remoteMonitoring/disasterMonitoring']},
          
        ]
        
      },
      {
        label: '绿色矿山', icon: 'iconfont iconkuangshan',
        items: [
          { label: '绿色矿山建设统计', icon: 'iconfont iconshujufenxi', routerLink: ['/layout/greenMining/miningStatistics'] },
         /*  {label: '数据导入导出', icon: 'iconfont iconziyuanbaosongshujudaoru',routerLink: ['/layout/greenMining/dataImportExport']},
          {label: '数据分析', icon: 'iconfont iconshujufenxi',routerLink: ['/layout/greenMining/dataAnalyze']} */
          
        ]
      },
      {
        label: '矿区地理位置', icon: 'fa fa-fw  fa-map',
        items: [
          { label: '矿权地图', icon: 'iconfont iconmap', routerLink: ['/layout/mapManage/outDoor'] },
          { label: '矿山地图', icon: 'iconfont iconmap', routerLink: ['/layout/mapManage/threeMap'] }
        ]
      },
      {
        label: '系统配置', icon: 'iconfont iconxitongguanli', 
        items: [
          { label: '角色管理', icon: 'iconfont iconjiaoseguanli', routerLink: ['/layout/systemConfig/roleManage'] },
          { label: '用户管理', icon: 'iconfont icontenantuser', routerLink: ['/layout/systemConfig/userManage'] },
          { label: 'API授权管理', icon: 'iconfont iconAPI', routerLink: ['/layout/systemConfig/apiManage'] },
          /* { label: '菜单管理', icon: 'fa fa-fw fa-tag', routerLink: ['/layout/systemConfig/menuManage'] }, */
          { label: '登录日志', icon: 'iconfont icondenglurizhi-', routerLink: ['/layout/systemConfig/loginLog'] },
          { label: '操作日志', icon: 'iconfont iconcaozuorizhi', routerLink: ['/layout/systemConfig/operationLog'] }
          
        ]

      }
    ];
    
    for(let i in api){
     
      switch(api[i].uri){
        case '/mineral-report-category/type/*/*/*':
          policyFile = true;
          explorationFile = true;
          miningFile = true;
          continue;
        case '/mineral-policy/list/*/*':
          policyReport = true;
          continue; 
        case '/mineral-project/type/*/*/*':
          explorationInfo = true;
          miningInfo = true;
          continue; 
        case '/mineral-project/list/*/*':
          mineralProject = true;
          continue;
        case '/mineral-owner/list/*/*':
          mineralOwner = true;
          continue; 
        case '/user/list/*/*':
          userManage = true;
          continue;   
        case '/resource/api/*/*/*':
          apiManage = true;
          continue;   
        case '/log/accountLog/*/*':
          loginLog = true;
          continue;    
        case '/log/operationLog/*/*':
          operationLog = true;
          continue;  
        case '/mineral-green-mining/list/*/*':
          greenMining = true;
          continue;
      }
    }

    if(!policyFile){
      this.models[1].items.splice(0,1)
     }
    if(!policyReport && this.models[1].items.length==2){
      this.models[1].items.splice(1,1)
    }else if(!policyReport){
      this.models[1].items.splice(0,1)
    }
   /*  if(!policyFile && !policyReport){
      this.models.splice(0,1)
    } */
    if(!explorationFile){
      this.models[2].items.splice(0,1);
    }
    if(!explorationInfo && this.models[2].items.length==2){
      this.models[2].items.splice(1,1)
    }else if(!explorationInfo){
      this.models[2].items.splice(0,1)
    }
    /* if(!explorationInfo && !explorationFile){
      this.models.splice(1,1)
    } */
    if(!miningFile){
      this.models[3].items.splice(0,1)
    }
    if(!miningInfo && this.models[3].items.length==2){
      this.models[3].items.splice(1,1)
    }else if(!miningInfo){
      this.models[3].items.splice(0,1)
    }
   /*  if(!miningFile && !miningInfo){
      this.models.splice(2,1)
    } */
    if(!mineralProject){
      this.models[0].items.splice(0,1)
    }
    if(!mineralOwner && this.models[0].items.length==2){
      this.models[0].items.splice(1,1)
    }else if(!mineralOwner){
      this.models[0].items.splice(0,1)
    }
  /*   if(!mineralProject && !mineralOwner){
      this.models.splice(3,1)
    } */
    if (!greenMining){
      this.models[5].items.splice(0,1)
    }
    if(!userManage){
      this.models[7].items.splice(1,1)
    }
    if(!apiManage && this.models[7].items.length==5){
      this.models[7].items.splice(2,1)
    }else if(!apiManage){
      this.models[7].items.splice(1,1)
    }
    if(!loginLog  || sessionStorage.getItem('roleCode')!=="role_admin"){
      if(this.models[7].items.length==5){
        this.models[7].items.splice(3,1)
      }else if(this.models[7].items.length==4){
        this.models[7].items.splice(2,1)
      }else{
        this.models[7].items.splice(1,1)
      }
      
    }
    if(!operationLog){
      if(this.models[7].items.length==5 ){
        this.models[7].items.splice(4,1)
      }else if(this.models[7].items.length==4){
        this.models[7].items.splice(3,1)
      }else if(this.models[7].items.length==3){
        this.models[7].items.splice(2,1)
      }else{
        this.models[7].items.splice(1,1)
      }
      
    }



    let menuData = JSON.parse(sessionStorage.getItem('menu'))
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
