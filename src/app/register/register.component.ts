import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineryService } from '../machinery.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerUrl:string = 'register';
  page;
  loader:boolean = false;

  userReg = {
    'data' : {
      'company_name': '',
      'email': '',
      'phone': '',
      'password': '',
    },
    'find' : {
      'email': ''
    }
  }
  profile: any;
  profileUrl: any = 'profile';

  constructor(private _machineryService: MachineryService, private router: Router) { }

  ngOnInit() {
    this.page = 'register';
  }

  register(){
    this.loader = true;
    this.userReg.find.email = this.userReg.data.email;
    console.log(this.userReg);
    this._machineryService.postData(this.registerUrl, this.userReg).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
        alert(res['message']);
        this.loader = false;
      } else {
        console.log(res);
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
        }
      }

    }, err => {
    });
  }

}
