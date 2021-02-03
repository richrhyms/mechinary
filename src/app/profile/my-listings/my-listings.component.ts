import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineryService } from '../../machinery.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.css']
})
export class MyListingsComponent implements OnInit {
  profileUrl: string = 'profile';
  subscriptionUrl: any= 'subscription-packages';
  machinesUrl: string = 'own-machines';
  machineUrl: string = 'machine';
  categoriesUrl: string = 'categories';
  fileUploadUrl: string = 'https://machinery-ng.herokuapp.com/upload/upload';
  modal;
  modal_2;
  profile;
  machines;
  activePage: string = 'list';
  subscription: any;

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
  categories: any = [];

  loader: boolean = true;
  loader_2: boolean = false;
  networkError: boolean = false;
  photoLoader: boolean = false;

  editMachine;

  constructor(private _machineryService: MachineryService, private route: Router,
    private _http: HttpClient) { }

  ngOnInit() {
    this.activePage = 'list';
    localStorage.setItem('activePage', this.activePage);
    this.user = JSON.parse(localStorage.getItem('user')).result;
    this.getProfile();
  }

  getProfile() {
    this._machineryService.getData(this.profileUrl, `?token=${this.user.token}`).subscribe(res => {
      if (res['error'] == true) {
      } else {
        this.profile = res['result']
        localStorage.setItem('profile', JSON.stringify(this.profile));
        this.getMachines();
        this.getSubscription(this.profile.subscription_package);
        this.getCategories();
      }
    }, err => {
    });
  }

  getMachines() {
    let data = JSON.stringify({});
    this._machineryService.getData(this.machinesUrl, `?token=${this.user.token}&data=${data}&limit=50&page=0&order=-updated_at`).subscribe(res => {
      if (res['error'] == true) {
        this.loader = false;
      } else {
        this.machines = res['result'];
        console.log(this.machines);
        this.loader = false;
      }
    }, err => {
      alert('Please, check network connection and refresh page!');
      this.loader = false;
      this.networkError = true;
    });
  }

  getCategories(){
    let token = this.user['token'];
    this._machineryService.getData(this.categoriesUrl, `?token=${token}&page=0&order=-updated_at` ).subscribe(res=> {
      if(res['error']==true){
        console.log(res);
        // this.loader = false;
      } else {
        console.log(res);
        this.categories = res['result'];
        // this.loader = false;
      }
    }, err=>{
      alert('Please, check network connection and refresh page!')
      // this.loader = false;
      this.networkError = true;
      console.log(err);
    });
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

  controlSubscription(){
    console.log(this.subscription);
    if(this.subscription.level==1){
      if(this.machines.length==1){
        alert('Sorry, your package only allow 1 listing.');
      } else {
        this.modal = true;
      }
    } else if (this.subscription.level==2){
      if(this.machines.length==5){
        alert('Sorry, your package only allow 5 listings.');
      } else{
        this.modal = true;
      }
    } else {
      this.modal = true;
    }
  }

   //set attribute to button element
  //  setAttr(){    
  //   setTimeout(()=>{
  //       let adBtn = document.getElementById('adBtn');
  //       adBtn.style.cursor  = 'not-allowed';
  //   },500)
  // }

  grabImage(action, event: Event) {
    this.photoLoader = true;
    // set disable to submit botton on photo upload
    let artt:number;
    let adBtn;
    let edBtn;
    
    if(action==1){
     //  set add button
     adBtn = document.getElementById('adBtn');
     if(!adBtn.hasAttribute('disabled')){
       adBtn.setAttribute('disabled','');
       artt = 0;
     } else{
       artt = 1;
     }
    } else {
       // set edit button
       edBtn = document.getElementById('edBtn');
       if(!edBtn.hasAttribute('disabled')){
         artt = 0;      
         edBtn.setAttribute('disabled','');
       } else {
         artt = 1;
       }
     }
    let myFormData = new FormData();
    let file = event.target["files"][0]
    myFormData.append('files', file)
    this._http.post(`${this.fileUploadUrl}?token=${this.user.token}`, myFormData).subscribe(
      res => {
        //check if action is  add or edit
        if (action == 1) {
          this.machine.data.image = res['secure_url'];
          if(artt==0){
            adBtn.removeAttribute('disabled');
          }
        } else {
          this.editMachine.image = res['secure_url'];
          if(artt==0){
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
    adBtn.setAttribute('disabled','');
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
    this.editMachine = machine
  }

  updateMachine() {
    this.loader_2 = true;
    let data = {
      'data': this.editMachine,
      'token': this.user.token
    }
    this._machineryService.putData(this.machineUrl, data).subscribe(res => {
      if (res['error'] == true) {
        alert(res['message']);
        this.loader_2 = false;
        this.modal_2 = false;
      } else {
        alert(res['message']);
        this.loader_2 = false;
        this.modal_2 = false;
        this.getMachines();
      }
    }, err => {      
      alert('Please, check network connection and refresh page!');
      this.loader_2 = false;
      this.modal_2 = false;
    });

  }

  deleteMachine(id){
    let data =  {
      'data': {
       '_id': id
      },
      'token': this.user.token
     }
     if(confirm('Are you sure you want to delete this Machine?')){
       this._machineryService.deleteData(this.machineUrl, data).subscribe(res => {
         if (res['error'] == true) {
           alert(res['message']);
         } else {
           alert(res['message']);
           this.getMachines();
         }
       }, err => {
         alert('Please, check network connection and refresh page!');
       });
     } else {
     }
 
   }

}
