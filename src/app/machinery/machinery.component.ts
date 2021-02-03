import { Component, OnInit } from '@angular/core';
import { MachineryService } from '../machinery.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrls: ['./machinery.component.css']
})
export class MachineryComponent implements OnInit {
  machineryUrl: String = 'machine';
  SearchmachineriesUrl: string = 'search-machines';
  classifiedUrl: string = 'classified';
  categoriesUrl: string = 'categories';
  machineUrl: string = 'machines';
  classifieds = [];
  machinery;
  sub;
  id;
  user;
  relatedMachineries
  categories

  loader: boolean = true;
  networkError: boolean = false;
  filterData = {
    "category": "",
    "location": "",
    "classified": true
  }

  constructor(private _machineryService: MachineryService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // this.user = JSON.parse(localStorage.getItem('user')).result;        
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    })
    this.machinery = {}
    this.getCategories();
    this.getMachinery();
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

  getMachinery() {
    let id = JSON.stringify({ '_id': this.id });
    this._machineryService.getData(this.machineryUrl, `?data=${id}`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
        this.loader = false;
      } else {
        console.log(res);
        this.machinery = res['result'][0];
        this.getClassified();
        let data = {
          "category": this.machinery.category,
          // "location": this.machinery.location,
          "classified": this.machinery.classified
        }
        this.getRelatedMachines(data);
        this.loader = false;
      }
    }, err => {
      alert('Please, check network connection and refresh');
      this.loader = false;
      this.networkError = true;
      console.log(err);
    });
  }

  showNumber() {
    let x = document.getElementById("phone");
    if (x.innerHTML === "Show number") {
      x.innerHTML = "Swapped text!";
    } else {
      x.innerHTML = `<h5>${this.machinery.contact_phone}</h4>`;
    }
  }

  getClassified() {
    this._machineryService.getData(this.classifiedUrl, `?data={"advert_area":"Side"}&page=0&order=-updated_at`).subscribe(res => {
      if (res['error'] == true) {
        console.log(res);
      } else {
        console.log(res);
        this.classifieds = res['result'];
      }
    }, err => {
      console.log(err);
      // alert('Please, check network connection and refresh page!');
    });
  }

  getRelatedMachine(id){
    window.location.href = `/machine/${id}`;
  }

  getRelatedMachines(searchData) {
    console.log(searchData);
    this._machineryService.getData(`machines`, `?data=${JSON.stringify(searchData)}&page=0&limit=4`).subscribe(res => {
      if (res['error'] == true) {
        console.log('related: ', res);
      } else {
        console.log('related: ', res);
        this.relatedMachineries = res['result'];
      }
    }, err => {
      console.log('related: ', err);
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

  searchCategory(item) {
    let data = {
      "category": item.category,
      "classified": false
    }
    if(item.classified==false){
        localStorage.setItem('data', JSON.stringify(data));
        window.location.href = '/machines';
    } else {
      localStorage.setItem('data', JSON.stringify(data));
      window.location.href = '/classified';
    }
    
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
    let request = `?data=${data}&page=0&limit=20&order=-updated_at`;
    console.log(data);
    console.log(url+request);
    this._machineryService.getData(url, request).subscribe(res => {
      if (res['error'] == true) {
        this.loader = false;
      } else {
        console.log('classified: ', res)
        localStorage.setItem('searchClassified', JSON.stringify(res['result']));
        this.router.navigateByUrl('/classified');
      }
    }, err => {
      alert('Please, check network and refresh page!');
      this.loader = false;
      this.networkError = true;

    });
    this.filterData = {
      "category": "",
      "location": "",
      "classified": true
    }
  }
}


