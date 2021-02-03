import { Component, OnInit } from '@angular/core';
import { MachineryService } from '../machinery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  profileUrl:string = 'profile';
  page: string;
  loginUrl: String = 'login';

  userDetails = {
    'data': {
      'email': '',
      'password': ''
    }
  };

  loader: boolean = false;
  profile: any;

  constructor(private _machineryService: MachineryService, private router: Router) { }

  ngOnInit() {
    this.page = 'login';
  }

  test(){
    console.log('help...!');
  }

  loginUser() {
    this.loader = true;
    console.log(this.userDetails);
    this._machineryService.postData(this.loginUrl, this.userDetails).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
        alert(res['message']);
        this.loader = false;
      } else {
        localStorage.setItem('user', JSON.stringify(res));
        this.getProfile(res['result']['token']);
      }
    }, err => {
      console.log(err);
      alert('Please, check network connection and refresh page');
      this.loader = false;
    });
  }

  getProfile(token) {
    this._machineryService.getData(this.profileUrl, `?token=${token}`).subscribe(res => {
      if (res['error'] == true) {
      } else {
        console.log(res)
        this.profile = res['result'];
        localStorage.setItem('profile',JSON.stringify(this.profile));
        if(this.profile.subscription_package=='None'){
          this.router.navigateByUrl('/pricing');
        } else {
          this.router.navigateByUrl('/profile/dashboard');
        }
      }

    }, err => {
    });
  }

}
