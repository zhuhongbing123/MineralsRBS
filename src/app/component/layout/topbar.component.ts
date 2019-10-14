import { Component } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from '../login/login.component';
import { ConfirmationService } from 'primeng/api';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'topbar',
  template: `
        <div class="topbar clearfix">
            <div class="topbar-left">
            矿业权管理系统 
            </div>

            <div class="topbar-right">
                <a id="menu-button" href="#" (click)="app.onMenuButtonClick($event)"
                   [ngClass]="{'menu-button-rotate': app.rotateMenuButton}">
                    <i class="fa fa-angle-left"></i>
               </a>

                <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
                    <i class="fa fa-bars"></i>
                </a>
                
                <ul class="topbar-items fadeInDown" [ngClass]="{'topbar-items-visible': app.topbarMenuActive}">
                    <span style='color:white'>{{loginName}}</span>
                    <li #profile class="profile-item" *ngIf="app.profileMode==='top'||app.isHorizontal()"
                        [ngClass]="{'active-top-menu':app.activeTopbarItem === profile}">

                        <a href="#" (click)="app.onTopbarItemClick($event,profile)">
                            <img class="profile-image" src="assets/layout/images/avatar.png" />
                            <span class="topbar-item-name">Isabel Lopez</span>
                            <span class="topbar-item-role">Marketing</span>
                        </a>

                        <ul class="layout-menu fadeInDown">
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="fa fa-fw fa-user"></i>
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="fa fa-fw fa-user-secret"></i>
                                    <span>Privacy</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="fa fa-fw fa-cog"></i>
                                    <span>Settings</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="app.onTopbarSubItemClick($event)">
                                    <i class="fa fa-fw fa-sign-out"></i>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li #settings [ngClass]="{'active-top-menu':app.activeTopbarItem === settings}">
                        <a href="#" (click)="app.onTopbarItemClick($event,settings)">
                            <i class="topbar-icon fa fa-fw fa-cog"></i>
                            <span class="topbar-item-name">Settings</span>
                        </a>
                        <ul class="layout-menu fadeInDown">
                           
                            <li role="menuitem">
                                <a>
                                    <i class="fa fa-fw fa-picture-o"></i>
                                    <p (click)="logout()">注销注销</p>
                                </a>
                            </li>
                        </ul>
                    </li>
                   
                </ul>
            </div>
        </div>
        
    `,
  styles: [`
        .topbar-left{
          color:#fff;
          font-size:20px;
          font-weight:600;
        }
        .version{
          font-size:12px; 
          line-height:20px;
        }
    `],
})
export class TopBarComponent {

   public loginName =   sessionStorage.getItem('name');
  constructor(public app: LayoutComponent,
    public loginService: LoginService
  ) { }
  /* 注销 */
  logout() {
    this.loginService.logout();
  }

}
