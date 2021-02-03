import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineryService } from '../machinery.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  countMachine: any;
  profileUrl: string = 'profile';
  profile;
  user
  activePage:string = 'dashboard';


  constructor(private _machineryService: MachineryService, private route: Router) { }

  ngOnInit() {
    this.profile = '';
    this.user = JSON.parse(localStorage.getItem('user')).result; 
    this.profile = JSON.parse(localStorage.getItem('profile'));
    this.getProfile();
  }

  getProfile() {
    //delay sidebar active
    setTimeout(()=>{
      this.activePage = localStorage.getItem('activePage');      
    }, 100);
    this._machineryService.getData(this.profileUrl, `?token=${this.user.token}`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
        alert(res['message']);
      } else {
        console.log('Profile: ', res);
        this.profile = res['result']
        localStorage.setItem('profile', JSON.stringify(this.profile));
      }
    }, err => {
      console.log(err);
    });
  }

  logout(){
    localStorage.clear();
    this.route.navigateByUrl('/login');
  }

}
