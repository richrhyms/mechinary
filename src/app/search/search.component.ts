import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineryService } from '../machinery.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  SearchmachineriesUrl: string = 'search-machines';
  categoriesUrl: string = 'categories';
  searchData;
  category:string;
  location:string;
  categories: any;

  constructor(private routes: Router, private _machineryService: MachineryService) { }
  

  ngOnInit() {
    this.getCategories();
    
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
      // this.networkError = true;
      console.log(err);
    });
  }

  searchMachineries() {
    let data = {
      "category": this.category,
      "location": this.location,
      "classified": false
    }
    if(!data.category){
      delete data.category;
    } else if(!data.location){
      delete data.location;
    }
    console.log(data);
    
    localStorage.setItem('data', JSON.stringify(data));
    window.location.href = '/machines';
    //this._machineryService.getData(this.machineriesUrl, `?data=${}`)
  }

}
