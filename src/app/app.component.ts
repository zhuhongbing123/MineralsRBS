import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart  } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  title = 'ZKCX';
  showLoading = false;
  constructor(private router: Router) {

  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // sessionStorage.setItem('msg', '进入项目')
    // let token = sessionStorage.getItem('token')
    // if (token == null) {
    //   this.router.navigate(["/"]);
    
    // }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // 每次路由跳转开始改变状态
        this.showLoading = true;
      
      }
      if (event instanceof NavigationEnd) {
        // 每次路由跳转结束改变状态
        this.showLoading = false;
      }
    });
  }
  ngOnDestroy() { 
    sessionStorage.setItem('aaa', '离开项目')
  }
}
