import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineryService } from '../machinery.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  subscriptionUrl: string = 'subscription-packages';
  paymentUrl: string = 'initialize-payment';
  activePage: string;
  user: any = {};
  subscriptions: any;
  bronze: any;
  gold: any;
  platinum: any;
  subscribe: any = {
    "token": "",
    "sub_id": "",
    "voucher_code": "",
    "email": ""
  }

  //store in local storage
  packageDetails = {
    "data": null,
    "voucher_code": null,
    "token": null
  }
  userProfile: any = {};
  greeting: boolean = false;
  profile: any;
  page = 'home';
  message: boolean;

  constructor(private _machineryService: MachineryService, private route: Router) { }

  ngOnInit() {
    //handle acceptions
    //for user token
    try{
      this.user = JSON.parse(localStorage.getItem('user'))['result'];
    } catch(err){
      return null
    }
    this.profile = JSON.parse(localStorage.getItem('profile'));
    this.checkUserSubscription(this.profile)
    console.log('profile: ', this.profile);
    this.getSubscription();
  }
  checkUserSubscription(profile){
    console.log(profile);
    if(profile.subscription_package=='None'){
      this.message = true;
    } else {
      this.message = false;
    }
  }

  getSubscription() {
    this._machineryService.getData(this.subscriptionUrl, `?data={}&limit=3`).subscribe(res => {
      if (res['error'] == true) {
        alert(res['message']);
        console.log(res);
      } else {
        console.log(res);
        this.subscriptions = res['result'];
        //compare prices of subscriptions
        //and get the highest and lowest packages
        let x = Math.max(Number(this.subscriptions[0].price), Number(this.subscriptions[1].price), Number(this.subscriptions[2].price));
        let y = Math.min(Number(this.subscriptions[0].price), Number(this.subscriptions[1].price), Number(this.subscriptions[2].price));
        //split subscriptions packages according to highest price
        for (let z = 0; z < this.subscriptions.length; z++) {
          if (x == Number(this.subscriptions[z].price)) {
            this.platinum = this.subscriptions[z];
          } else if (y == Number(this.subscriptions[z].price)) {
            this.bronze = this.subscriptions[z];
          } else {
            this.gold = this.subscriptions[z];
          }
        }
      }
    }, err => {
      console.log(err);
      alert('Please, check connection and refresh page!')
    });
  }

  intializePayment(packageName) {
    // check if user is logged in
    if (!localStorage.getItem('user') || localStorage.getItem('user') == null) {
      alert('Please, login to subscribe');
    } else {
      // this.packageDetails.voucher_code =  this.subscribe.voucher_code;
      this.packageDetails.token = this.user.token;
      this.packageDetails.data = packageName._id;
      //set packageDetails to local storage
      //and get go to payment component
      localStorage.setItem('packageDetails', JSON.stringify(this.packageDetails));
      // assign user token and email to subscription model
      this.subscribe.token = this.user.token;
      this.subscribe.email = this.profile.email;
      this.subscribe.sub_id = packageName._id;
      console.log('Subscribe details: ', this.subscribe);

      this._machineryService.postData(this.paymentUrl, this.subscribe).subscribe(res => {
        if (res['error']) {
          console.log(res);
          alert(res['message']);
        } else {
          console.log(res);
          let paymentLink = res['result'].authorization_url;
          //navigate to payment gateway
          window.location.href = paymentLink;
        }
      }, err => {
        console.log(err);
        alert("Please, check connection and refresh page!")
      });
    }

  }


}
