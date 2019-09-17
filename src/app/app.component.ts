import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ZKCX';
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
  }
  ngOnDestroy() {
    sessionStorage.setItem('aaa', '离开项目')
  }
}
