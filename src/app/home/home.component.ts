import { Component, OnInit } from '@angular/core';
import { MachineryService } from '../machinery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  machineUrl:string = 'machines';
  classifiedUrl:string = 'classified';
  machineries;
  classifieds = [];
  user;
  loader: boolean = true;
  networkError: boolean;
  page = 'home';
  categories: any;

  constructor(private _machineryService:MachineryService, private route: Router) { }

  ngOnInit() {
    //check user state
    if(!this.user){
      this.user = false;
    } else {
      this.user = JSON.parse(localStorage.getItem('user')).result;      
    }


    this.getClassified();

    this.machineries = []
    this.getMachineries();
  }

  getMachineries() {
    console.log(this.machineUrl);
    let data = JSON.stringify({"classified":false});
    this._machineryService.getData(this.machineUrl, `?data${data}&page=0&limit=4&order=-updated_at`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
        this.loader = false;
      } else {
        console.log(res);
        this.machineries = res['result'];
        this.getCategory();
        this.loader = false;
      }
    }, err => {
      console.log(err);
      alert('Please, check network connection and refresh page!');
      this.loader = false;
      this.networkError = true;
    });
  }

  getCategory(){
    let categoryUrl:string = 'categories';
    this._machineryService.getData(categoryUrl, `?page=0&limit=4&order=-updated_at`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
      } else {
        console.log('Home categories: ',res);
        this.categories = res['result'];
      }
    }, err => {
      console.log(err);
    });

  }

  getMachinery(id){
    this.route.navigateByUrl('/machine',id)
  }

  //modify machine name
  stringCount(x){
    let x_array = [];
    x_array = x.split('');
    if(x_array.length > 25){
      x_array.splice(25, 100, "...")
    }
    return x_array.join('');
  }

  getClassified(){this._machineryService.getData(this.classifiedUrl, `?data={}&page=0&order=-updated_at`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
      } else {
        console.log('Classified:',res);
        this.classifieds = res['result'];
      }
    }, err => {
      console.log(err);
      // alert('Please, check network connection and refresh page!');
    });
  }

  machineryCategory(category) {
    let data = {
      "category": category,
      "classified": false
    }

    console.log(data);
    
    localStorage.setItem('data', JSON.stringify(data));
    window.location.href = '/machines';
  }

  allCategories(){
    window.location.href = '/machines';
  }
}
