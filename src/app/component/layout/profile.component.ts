import {Component} from '@angular/core';
import {trigger, state, transition, style, animate} from '@angular/animations';

@Component({
    selector: 'profile',
    template: `
        

        <ul id="profile-menu" class="layout-menu" [@menu]="active ? 'visible' : 'hidden'">
            <li role="menuitem">
                <a href="#" [attr.tabindex]="!active ? '-1' : null">
                    <i class="fa fa-fw fa-user"></i>
                    <span>Profile</span>
                </a>
                <div class="layout-menu-tooltip">
                    <div class="layout-menu-tooltip-arrow"></div>
                    <div class="layout-menu-tooltip-text">Profile</div>
                </div>
            </li>
            <li role="menuitem">
                <a href="#" [attr.tabindex]="!active ? '-1' : null">
                    <i class="fa fa-fw fa-user-secret"></i>
                    <span>Privacy</span>
                </a>
                <div class="layout-menu-tooltip">
                    <div class="layout-menu-tooltip-arrow"></div>
                    <div class="layout-menu-tooltip-text">Privacy</div>
                </div>
            </li>
            <li role="menuitem">
                <a href="#" [attr.tabindex]="!active ? '-1' : null">
                    <i class="fa fa-fw fa-cog"></i>
                    <span>Settings</span>
                </a>
                <div class="layout-menu-tooltip">
                    <div class="layout-menu-tooltip-arrow"></div>
                    <div class="layout-menu-tooltip-text">Settings</div>
                </div>
            </li>
            <li role="menuitem">
                <a href="#" [attr.tabindex]="!active ? '-1' : null">
                    <i class="fa fa-fw fa-sign-out"></i>
                    <span>Logout</span>
                </a>
                <div class="layout-menu-tooltip">
                    <div class="layout-menu-tooltip-arrow"></div>
                    <div class="layout-menu-tooltip-text">Logout</div>
                </div>
            </li>
        </ul>
    `,
    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class ProfileComponent {

    active: boolean;

    onClick(event) {
        this.active = !this.active;
        event.preventDefault();
    }
}
