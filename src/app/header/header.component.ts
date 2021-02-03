import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  inputs: ['status', 'page'],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  status = 'home';
  isLoggedIn = false;
  page;

  constructor(private router: Router) { }


  ngOnInit() {
    if(localStorage.getItem('user')){
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  listMachinery(){
    if(this.isLoggedIn){
      this.router.navigateByUrl('/profile/dashboard');
    } else {
      this.router.navigateByUrl('/register');
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

}
