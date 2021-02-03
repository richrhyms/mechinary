import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineryService } from '../../machinery.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  profileUrl: string = 'profile';
  fileUploadUrl: string = 'https://machinery-ng.herokuapp.com/upload/upload';


  user;
  profileDetails = {
    'data': {
      'company_name': '',
      'email': '',
      'password': '',
      'phone': '',
      'certificate': '',
      'location': '',
      'about': '',
      'address': '',
      '_id': ''
    },
    'find': {
      '_id': ''
    },
    'token': ''
  }
  profile
  loader:boolean = false;
  photoLoader
  activePage:string = 'profile'

  constructor(private _machineryService: MachineryService, private route: Router,
    private _http: HttpClient) { }

  ngOnInit() {
    localStorage.setItem('activePage', this.activePage);    
    console.log('Profile details: ', this.profileDetails);
    this.user = JSON.parse(localStorage.getItem('user')).result;
    this.getProfile();
  }

  grabFile(event: Event) {
    this.photoLoader = true
    //set disabled to update profile
    let upBtn = document.getElementById('upBtn');
    upBtn.setAttribute('disabled', '');

    let myFormData = new FormData();
    let file = event.target["files"][0]
    myFormData.append('files', file)
    console.log("File grabbed ", myFormData.getAll('files'));
    this._http.post(`${this.fileUploadUrl}?token=${this.user.token}`, myFormData).subscribe(
      res => {
        if (!res['secure_url']) {
          upBtn.removeAttribute('disabled');
          alert('error adding your file.');
          this.photoLoader = false;
        } else {
          console.log(res);
          upBtn.removeAttribute('disabled');
          this.profileDetails.data.certificate = res['secure_url'];
          this.photoLoader = false;
        }

      }, err => {
        console.log(err);
        upBtn.removeAttribute('disabled');
        alert('Please, check network connection and refresh page!');
        this.photoLoader = false;
      });
  }

  getProfile() {
    this._machineryService.getData(this.profileUrl, `?token=${this.user.token}`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
      } else {
        console.log(res);
        this.profileDetails.data = res['result'];
      }
    }, err => {
      console.log(err);
      alert('Please, check network connection and refresh page!');
    });
  }

  updateProfile() {
    this.loader = true;
    this.profileDetails.token = this.user.token;
    this.profileDetails.find._id = this.profileDetails.data._id
    console.log(this.profileDetails);
    this._machineryService.putData(`${this.profileUrl}?token=${this.user.token}`, this.profileDetails).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
        alert(res['message']);
        this.loader = false;
      } else {
        console.log(res);
        alert(res['message']);
        this.loader = false;
        this.getProfile();
      }
    }, err => {
      console.log(err);
      alert('Please, check network connection and refresh page!');
      this.loader = false;
    });
  }
}
