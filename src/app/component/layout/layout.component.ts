import {Component, AfterViewInit, ElementRef, Renderer2, ViewChild, OnDestroy} from '@angular/core';
import {ScrollPanel} from 'primeng/primeng';

enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
}

@Component({
  selector: 'app-root',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements AfterViewInit {

    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    darkMenu = false;

    profileMode = 'inline';

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    resetMenu: boolean;

    menuHoverActive: boolean;

    @ViewChild('layoutMenuScroller', { static: true }) layoutMenuScrollerViewChild: ScrollPanel;

    constructor(public renderer: Renderer2) {}

    ngAfterViewInit() {
        setTimeout(() => {this.layoutMenuScrollerViewChild.moveBar(); }, 100);
        let that = this;
         window.onbeforeunload = function(e) {
             if(e.type=='beforeunload'){
                that.onbeforeunload();
             }
        }
        
    
    }

    /* 关闭浏览器清除登录信息 */
    onbeforeunload(){
    localStorage.clear();
  }
    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive; } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive; }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if (!this.isHorizontal()) {
            setTimeout(() => {this.layoutMenuScrollerViewChild.moveBar(); }, 450);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null; } else {
            this.activeTopbarItem = item; }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    hideOverlayMenu() {
        this.rotateMenuButton = false;
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    isSlim() {
        return this.layoutMode === MenuOrientation.SLIM;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    changeToSlimMenu() {
        this.layoutMode = MenuOrientation.SLIM;
    }
/* 注销 */
onLogout() {
  // this.confirmationService.confirm({
  //   message: "注销后，需要重新登录，是否继续?",
  //   header: "注销",
  //   icon: "pi pi-info-circle",
  //   accept: () => {
  //     this.commonService.logout("exit").then(value => {
  //       if (value.code === 200) {
  //         this.router.navigate(["/"]);
  //       }
  //     });
  //   },
  //   reject: () => { }
  // });
}
}
