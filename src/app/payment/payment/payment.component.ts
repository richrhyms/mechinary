import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MachineryService } from '../../machinery.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  user: any;
  profileUrl: string = 'profile';
  subscribeUrl:string = 'subscribe';
  subscriptionDetails:any = {
    "data": {
      "sub_id": "",
      "transaction_ref": "",
      "voucher_code": ""
    },
    "token": ""
  };
  page = 'home';

  loader:boolean = false;

  sub
  packageDetails: any;
  activePage: string;
  profile: any;
  loader2: boolean;

  constructor(private _machineService: MachineryService, private routes: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activePage = 'pricing';
    this.user = JSON.parse(localStorage.getItem('user'));
    this.sub = this.activatedRoute.queryParams.subscribe( queryParams =>{
      this.subscriptionDetails.data.transaction_ref = queryParams['trxref'];
      console.log(this.subscriptionDetails.data.transaction_ref);
    });
    this.postSubscription();
  }

  postSubscription(){
    //get packageDetails from pricing or home
    //assign to subscriptionDetails
    this.packageDetails= JSON.parse(localStorage.getItem('packageDetails'));
    console.log('Package Details: ',this.packageDetails);
    //assign variables
    // this.subscriptionDetails.data.voucher_code = this.packageDetails.voucher_code;
    this.subscriptionDetails.data.sub_id = this.packageDetails.data;
    this.subscriptionDetails.token = this.packageDetails.token;
    console.log('Subscription Details: ',this.subscriptionDetails);
    //call server
    this._machineService.postData(this.subscribeUrl,this.subscriptionDetails).subscribe( res=> {
      if(res['error']){
        console.log(res);
        this.loader = true;
        this.loader2 = true;
        alert(res['message']);
      } else {
        console.log(res);
        this.loader = false;
        this.loader2 = true;
      }
    }, err=> {
      console.log(err);
      this.loader = true;
      this.loader2 = true;

      alert("Please, check connection and refresh page!")
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
