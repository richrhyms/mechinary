import { Component, OnInit } from '@angular/core';
import { MachineryService } from '../machinery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-machineries',
  templateUrl: './machineries.component.html',
  styleUrls: ['./machineries.component.css']
})
export class MachineriesComponent implements OnInit {
  disableFilter: boolean = false;
  disableFilter_2: boolean = false;
  network: any;
  machineUrl: string = 'machines';
  searchMachineriesUrl: string = 'search-machines';
  categoriesUrl: string = 'categories';
  machineries;
  searchData;
  user;
  search: boolean = false;
  loader: boolean = true;
  minPrice: any;
  maxPrice: any;
  filterData = {
    'category': '',
    'location': '',
    'classified': false
  }
  priceRange = [
    {
      "field": "price",
      "min": 0,
      "max": 0
    }
  ];
  priceMax
  page = 0;
  disablePrev: boolean = false;
  disableNext: boolean = false;
  filterActive: boolean = false;

  active: number = 1;
  active2: number;
  categories: any;
  networkError: boolean;
  constructor(private _machineryService: MachineryService, private route: Router) { }

  ngOnInit() {
    // this.user = JSON.parse(localStorage.getItem('user')).result;   
    this.searchData = localStorage.getItem('data');
    this.getMachineries();
    this.getCategories();
  }

  //modify machine name
  stringCount(x) {
    let x_array = [];
    x_array = x.split('');
    if (x_array.length > 25) {
      x_array.splice(25, 100, "...")
    }
    return x_array.join('');
  }

  getMachineries(x?) {
    let data = JSON.stringify({ "classified": false });
    let request;
    let url;
    //call getmachineries() from machines template
    if (x == 1) {
      this.loader = true;
      url = this.machineUrl;
      request = `?data=${data}&page=${this.page}&limit=20&order=-updated_at`;
      // this.disableFilter = true;
      this.resetFilterVariables();
    } else {
      if (this.searchData) {
        console.log("search data: ", this.searchData);
        this.search = true;
        //search machineries
        url = this.machineUrl;
        request = `?data=${this.searchData}&page=${this.page}&limit=20&order=-updated_at`;
        console.log('search Item: ', request);
        localStorage.removeItem('data');
      } else {
        //get all machines
        url = this.machineUrl;
        request = `?data=${data}&page=${this.page}&limit=20&order=-updated_at`;
        console.log('Machines: ', request);

      }
    }//call to the serve
    this._machineryService.getData(url, request).subscribe(res => {
      if (res['error'] == true) {
        this.loader = false;
      } else {
        this.machineries = res['result'];
        this.filterActive = false;
        //manage next pagination
        this.manageNextPagination();
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

  //Manage prev pagination
  pagination(page) {

    if (page >= 0) {
      this.page = page;
    }
    if (this.page == 0) {
      this.disablePrev = true;
    } else {
      this.disablePrev = false;
    }
    //check for filter
    if (!this.filterActive) {
      this.getMachineries();
      console.log('Machineries');
    } else {
      this.filterSearch();
      console.log('Filter');
    }
  };

  manageNextPagination() {
    if (this.machineries.length == 0 || this.machineries.length < 20) {
      this.disableNext = true;
      if (this.page != 0) {
        this.disablePrev = false;
      }
    } else {
      this.disableNext = false;
    }
  }

  //filter params {category, location}
  filterParams(x, category) {
    if (x == 2) {
      this.filterData.category = '';
    } else if (x == 0) {
      this.filterData.category = category;
    } else {
      this.filterData.location = event.srcElement['innerText'];
    }
  }

  //set filter price
  filterPrice() {
    if (this.priceRange[0].min == 0) {
      this.priceRange[0].min = 50000;
    }
    if (this.priceRange[0].max == 0) {
      this.priceRange[0].max = 300000;
    }
    this.disableFilter = false;
  }


  //Filter
  filterSearch() {
    //remove search data from localstorage
    localStorage.removeItem('data');
    //set params
    let url = this.machineUrl;
    let data = JSON.stringify(this.filterData);
    // let req = `?data=${data}&range=${range}&page=${this.page}&limit=20&order=-updated_at`;
    this.loader = true;
    console.log(this.filterData);

    // flexible filter 0: empty params
    if ((this.filterData.location == "" && this.filterData.category == "") && this.priceRange[0].min < 1) {
      alert("Please, select items to filter");
      this.loader = false;

      // flexible filter 1: works with either location or category but no price
    } else if ((this.filterData.location == '' || this.filterData.category == '') && this.priceRange[0].min < 1) {
      this.filterOne(url);

      // semi flexible filter 2: works with location and category but no price
    } else if ((this.filterData.location && this.filterData.category) && this.priceRange[0].min < 1) {
      this.filterTwo(url);

      //semi flexible filter 3: filter with only price
    } else if ((this.filterData.location == "" && this.filterData.category == "") && this.priceRange[0].min > 1) {
      this.filterThree(url);

      // semi flexible filter 4: works with either location and price or category and price
    } else if ((this.filterData.location  && this.filterData.category == "") || (this.filterData.category && this.filterData.location == "") && this.priceRange[0].min > 1) {
      this.filterFour(url);

      //full filter
    } else if((this.filterData.location && this.filterData.category)&& this.priceRange[0].min > 1){
      this.filterFive(url);
    }
  }

  filterCallServer(url, req) {
    this._machineryService.getData(url, req).subscribe(res => {
      if (res['error'] == true) {
        this.loader = false;
        alert(res['message']);
        // this.disableFilter = true;
      } else {
        this.machineries = res['result'];
        //manage next pagination
        this.manageNextPagination();
        this.filterActive = true;
        // this.disableFilter = true;
        this.loader = false;
      }
    }, err => {
      alert("Please, check network and refresh page!")
      this.loader = false;
      this.network = true;
    });
  }

  // flexible filter 1: works with either location or category but no price
  filterOne(url) {
    console.log('first filter')
    let req;
    if (this.filterData.location == '') {
      delete this.filterData.location;
      req = `?data=${JSON.stringify(this.filterData)}&page=${this.page}&limit=20&order=-updated_at`;
    } else {
      delete this.filterData.category;
      req = `?data=${JSON.stringify(this.filterData)}&page=${this.page}&limit=20&order=-updated_at`;
    };
    console.log(this.filterData);
    this.filterCallServer(url, req);
    // this.filterData = {
    //   'category': '',
    //   'location': '',
    //   'classified': false
    // }
  }

  // semi flexible filter 2: works with location and category but no price
  filterTwo(url) {
    console.log('Second filter')
    let req = `?data=${JSON.stringify(this.filterData)}&page=${this.page}&limit=20&order=-updated_at`;
    console.log(this.filterData);
    this.filterCallServer(url, req);
  }

  //semi flexible filter 3: filter with only price
  filterThree(url) {
    this.priceRange[0].min = Number(this.priceRange[0].min);
    this.priceRange[0].max = Number(this.priceRange[0].max);
    console.log('only price filter: ', this.priceRange);
    let range = JSON.stringify(this.priceRange);
    let req = `?data=${JSON.stringify({ "classified": false })}&range=${range}&page=${this.page}&limit=20&order=-updated_at`;
    this.filterCallServer(url, req);
    // this.priceRange = [
    //   {
    //     "field": "price",
    //     "min": 0,
    //     "max": 0
    //   }
    // ];

  }

  // semi flexible filter 4: works with either location and price or category and price
  filterFour(url) {
    let req;
    this.priceRange[0].min = Number(this.priceRange[0].min);
    this.priceRange[0].max = Number(this.priceRange[0].max);
    let range = JSON.stringify(this.priceRange);
    console.log('one other and price filter');
    if (this.filterData.location == '') {
      delete this.filterData.location;
      req = `?data=${JSON.stringify(this.filterData)}&range=${range}&page=${this.page}&limit=20&order=-updated_at`;
    } else {
      delete this.filterData.category;
      req = `?data=${JSON.stringify(this.filterData)}&range=${range}&page=${this.page}&limit=20&order=-updated_at`;
    }
    console.log(this.filterData, this.priceRange);
    this.filterCallServer(url, req);
    // this.filterData = {
    //   'category': '',
    //   'location': '',
    //   'classified': false
    // }
  }

  //Full filter
  filterFive(url){
    console.log('full filter')
    let req;
    this.priceRange[0].min = Number(this.priceRange[0].min);
    this.priceRange[0].max = Number(this.priceRange[0].max);
    let range = JSON.stringify(this.priceRange);
    req = `?data=${JSON.stringify(this.filterData)}&range=${range}&page=${this.page}&limit=20&order=-updated_at`;
    console.log(this.filterData, this.priceRange);
    this.filterCallServer(url, req);
    // this.filterData = {
    //   'category': '',
    //   'location': '',
    //   'classified': false
    // }
  }

  resetFilterVariables() {
    this.filterData = {
      'category': '',
      'location': '',
      'classified': false
    };
    this.priceRange = [
      {
        "field": "price",
        "min": 0,
        "max": 0
      }
    ];
  }

}
