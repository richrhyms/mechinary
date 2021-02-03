import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineryService } from '../../machinery.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tester = "false";
  countMachine: any;
  profileUrl: string = 'profile';
  machinesUrl: string = 'own-machines';
  machineUrl: string = 'machine';
  categoriesUrl: string = 'categories';
  countMachineUrl: string = 'count-machines';
  fileUploadUrl: string = 'https://machinery-ng.herokuapp.com/upload/upload';
  modal;
  modal_2;
  profile;
  machines;
  categories: any = [];

  machine = {
    'data': {
      'name': '',
      'description': '',
      'category': '',
      'features': {

      },
      'image': '',
      'location': '',
      'address': '',
      'price': '',
      'contact_phone': '',
      'contact_email': '',
      'classified': false
    },
    'token': ''
  }

  user

  loader: boolean = true;
  loader_2: boolean = false;
  networkError: boolean = false;
  photoLoader: boolean = false;
  activePage: string = 'dashboard';

  editMachine;
  sub_end: any;
  subscriptionUrl: any= 'subscription-packages';
  subscription: any;

  constructor(private _machineryService: MachineryService, private route: Router,
    private _http: HttpClient) { }

  ngOnInit() {
    localStorage.setItem('activePage', this.activePage);
    this.user = JSON.parse(localStorage.getItem('user')).result;
    this.getProfile();
  }

  getCategories() {
    let token = this.user['token'];
    this._machineryService.getData(this.categoriesUrl, `?token=${token}&page=0&order=-updated_at`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
        // this.loader = false;
      } else {
        console.log(res);
        this.categories = res['result'];
        // this.loader = false;
      }
    }, err => {
      alert('Please, check network connection and refresh page!')
      // this.loader = false;
      this.networkError = true;
      console.log(err);
    });
  }

  //set attribute to add machine button element
  // setAttr(){    
  //   setTimeout(()=>{
  //       let adBtn = document.getElementById('adBtn');
  //       adBtn.style.cursor  = 'not-allowed';
  //   },500);
  // }

  getProfile() {
    this._machineryService.getData(this.profileUrl, `?token=${this.user.token}`).subscribe(res => {
      if (res['error'] == true) {
      } else {
        this.profile = res['result']
        localStorage.setItem('profile', JSON.stringify(this.profile));
        this.sub_end = this.getSubscriptionValidity(this.profile.subscription_end_date);
        this.getCountMachine();
        this.getMachines();
        this.getSubscription(this.profile.subscription_package);
        this.getCategories();
      }

    }, err => {
    });
  }

  getSubscriptionValidity(endDate) {
    let milliSecToDay = (1000 * 60 * 60 * 24);
    let subTime = new Date(endDate).getTime();
    let days = subTime / milliSecToDay;
    let currentTime = new Date().getTime() / milliSecToDay;
    return Math.round(days - currentTime);
  }

  getSubscription(sub_package) {
    let subscription = JSON.stringify({
      "subscription_package": sub_package
    });
    this._machineryService.getData(this.subscriptionUrl, `?data=${subscription}`).subscribe(res => {
      if (res['error'] == true) {
        alert(res['message']);
        console.log(res);
      } else {
        console.log(res);
        this.subscription = res['result'][0];
      }
    }, err => {
      console.log(err);
    });
  }

  getCountMachine() {
    this._machineryService.getData(this.countMachineUrl, `?token=${this.user.token}`).subscribe(res => {
      if (res['error'] == true) {
      } else {
        this.countMachine = res['result'];
      }
    }, err => {
    });
  }

  controlSubscription(){
    console.log(this.subscription);
    if(this.subscription.level==1){
      if(this.countMachine==1){
        alert('Sorry, your package only allow 1 listing.');
      } else {
        this.modal = true;
      }
    } else if (this.subscription.level==2){
      if(this.countMachine==5){
        alert('Sorry, your package only allow 5 listings.');
      } else{
        this.modal = true;
      }
    } else {
      this.modal = true;
    }
  }

  getMachines() {
    let data = JSON.stringify({});
    this._machineryService.getData(this.machinesUrl, `?token=${this.user.token}&data=${data}&limit=50&page=0&order=-updated_at`).subscribe(res => {
      if (res['error'] == true) {
        this.loader = false;
      } else {
        this.machines = res['result'];
        this.loader = false;
      }
    }, err => {
      alert('Please, check network connection and refresh page!');
      this.loader = false;
      this.networkError = true;
    });
  }

  grabImage(action, event: Event) {
    this.photoLoader = true;
    // set disable to submit botton on photo upload
    let artt: number;
    let adBtn;
    let edBtn;

    if (action == 1) {
      //  set disabled to add machine button
      adBtn = document.getElementById('adBtn');
      if (!adBtn.hasAttribute('disabled')) {
        adBtn.setAttribute('disabled', '');
        // adBtn.style.cursor  = 'not-allowed';
        artt = 0;
      } else {
        artt = 1;
      }
    } else {
      // set disabled to edit machine button
      edBtn = document.getElementById('edBtn');
      if (!edBtn.hasAttribute('disabled')) {
        artt = 0;
        edBtn.setAttribute('disabled', '');
        edBtn.style.cursor = 'not-allowed';
      } else {
        artt = 1;
      }
    }

    let myFormData = new FormData();
    let file = event.target["files"][0]
    myFormData.append('files', file)
    this._http.post(`${this.fileUploadUrl}?token=${this.user.token}`, myFormData).subscribe(
      res => {
        if (!res['secure_url']) {
          alert('Upload failed!');
          this.photoLoader = false;
          //check if action is add or edit
        } else if (action == 1) {
          this.machine.data.image = res['secure_url'];
          if (artt == 0) {
            adBtn.removeAttribute('disabled');
          }
        } else {
          this.editMachine.image = res['secure_url'];
          if (artt == 0) {
            edBtn.removeAttribute('disabled');
          }
        }
        this.photoLoader = false;
      }, err => {
        alert('Please, check network connection and refresh page!');
        this.photoLoader = false;
      });
  }

  addMachine() {
    this.loader_2 = true;
    let adBtn = document.getElementById('adBtn');
    adBtn.setAttribute('disabled', '');
    //assign the profile properties below to machine
    this.machine.data.address = this.profile.address;
    this.machine.data.contact_phone = this.profile.phone;
    this.machine.data.contact_email = this.profile.email;
    this.machine.token = this.user.token;
    this._machineryService.postData(this.machineUrl, this.machine).subscribe(res => {
      if (res['error'] == true) {
        alert(res['message']);
        this.loader_2 = false;
        this.modal = true;
        adBtn.removeAttribute('disabled');
      } else {
        alert(res['message']);
        adBtn.removeAttribute('disabled');
        this.loader_2 = false;
        this.modal = false;
        this.getMachines();
        this.getCountMachine();
        this.machine = {
          'data': {
            'name': '',
            'description': '',
            'category': '',
            'features': {

            },
            'image': '',
            'location': '',
            'address': '',
            'price': '',
            'contact_phone': '',
            'contact_email': '',
            'classified': false
          },
          'token': ''
        }
      }
    }, err => {
      adBtn.removeAttribute('disabled');
      alert('Please, check network connection and refresh page!');
      this.loader_2 = false;
      this.modal = true;
    });
  }

  viewMachine(machine) {
    this.modal_2 = true;
    this.editMachine = machine;
  }

  updateMachine() {
    this.loader_2 = true;
    let data = {
      'data': this.editMachine,
      'find': {
        '_id': this.editMachine._id
      },
      'token': this.user.token
    }
    this._machineryService.putData(this.machineUrl, data).subscribe(res => {
      if (res['error'] == true) {
        alert(res['message']);
        this.loader_2 = false;
        this.modal_2 = true;
      } else {
        alert(res['message']);
        this.loader_2 = false;
        this.modal_2 = false;
        this.getMachines();
      }
    }, err => {
      alert('Please, check network connection and refresh page!');
      this.loader_2 = false;
      this.modal_2 = true;
    });

  }

  deleteMachine(id) {
    let data = {
      'data': {
        '_id': id
      },
      'token': this.user.token
    }
    if (confirm('Are you sure you want to delete this Machine?')) {
      this._machineryService.deleteData(this.machineUrl, data).subscribe(res => {
        if (res['error'] == true) {
          alert(res['message']);
          console.log(res);
        } else {
          alert(res['message']);
          this.getCountMachine();
          this.getMachines();
        }
      }, err => {
        alert('Please, check network connection and refresh page!');
      });
    } else {
    }

  }

  viewListings() {
    window.location.href = `/profile/my-listings`;
  }

}
