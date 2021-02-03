import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { MachineryService } from '../machinery.service';

@Component({
  selector: 'app-classified',
  templateUrl: './classified.component.html',
  styleUrls: ['./classified.component.css']
})
export class ClassifiedComponent implements OnInit {
  categoriesUrl: string = 'categories';
  machineUrl: string = 'machines';
  searchMachineriesUrl: string = 'search-machines';
  categories: any;
  networkError: boolean;
  disablePrev: boolean = false;
  disableNext: boolean = false;
  loader: boolean;
  machineries: any;
  network: any;
  page:string = 'classified';
  page1: number = 0;
  status: string;
  location: any;
  category: any;
  filterData = {
    "category": "",
    "location": "",
    "classified": true
  };
  searchData
  search: boolean;

  constructor(private _machineryService: MachineryService, private route: Router) { }

  ngOnInit() {
    this.status = 'home';
    this.getCategories();
    if(localStorage.getItem('searchClassified')){
      this.machineries = JSON.parse(localStorage.getItem('searchClassified'));
    } else {
      this.getClassified();
    }
    this.searchData = localStorage.getItem('data');

  }

  //modify machine name
  stringCount(x) {
    let x_array = [];
    x_array = x.split('');
    if (x_array.length > 20) {
      x_array.splice(20, 100, "...")
    }
    return x_array.join('');
  }

  getClassified() {
    let url;
    let request
    this.loader = true;
    if(this.searchData){
        console.log("search data: ", this.searchData);
        this.search = true;
        //search classified
        url = this.machineUrl;
        request = `?data=${this.searchData}&page=${this.page}&limit=20&order=-updated_at`;
        console.log('search Item: ', request);
        localStorage.removeItem('data');
    } else {
      //default classified call
      let data = JSON.stringify({ "classified": true });
      let url = this.machineUrl;
      let request = `?data=${data}&page=${this.page1}&limit=20&order=-updated_at`;
    }
    
    this._machineryService.getData(url, request).subscribe(res => {
      if (res['error'] == true) {
        this.loader = false;
      } else {
        console.log('classified: ', res)
        this.machineries = res['result'];
        //manage next pagination
        if (this.machineries.length == 0 || this.machineries.length < 20) {
          this.disableNext = true;
          if (this.page1 != 0) {
            this.disablePrev = false;
          }
        } else {
          this.disableNext = false;
        }
        this.loader = false;
      }
    }, err => {
      alert('Please, check network and refresh page!');
      this.loader = false;
      this.network = true;

    });
  }


  getCategories() {
    this._machineryService.getData(this.categoriesUrl, `?page=0&order=-updated_at`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
        // this.loader = false;
      } else {
        console.log('Categories: ', res);
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

  pagination(page) {

    if (page >= 0) {
      this.page1 = page;
    }
    if (this.page1 == 0) {
      this.disablePrev = true;
    } else {
      this.disablePrev = false;
    }
      this.getClassified();
  }

  searchMachineries() {
    this.loader = true;
    if(!this.filterData.category){
      delete this.filterData.category
    } else if (!this.filterData.location){
      delete this.filterData.location
    }
    let data = JSON.stringify(this.filterData);
    let url = this.machineUrl;
    let request = `?data=${data}&page=${this.page1}&limit=20&order=-updated_at`;
    console.log(data);
    console.log(url+request);
    this._machineryService.getData(url, request).subscribe(res => {
      if (res['error'] == true) {
        this.loader = false;
      } else {
        console.log('classified: ', res)
        this.machineries = res['result'];
        //manage next pagination
        if (this.machineries.length == 0 || this.machineries.length < 20) {
          this.disableNext = true;
          if (this.page1 != 0) {
            this.disablePrev = false;
          }
        } else {
          this.disableNext = false;
        }
        this.loader = false;
      }
    }, err => {
      alert('Please, check network and refresh page!');
      this.loader = false;
      this.network = true;

    });
    this.filterData = {
      "category": "",
      "location": "",
      "classified": true
    }
  }

}
