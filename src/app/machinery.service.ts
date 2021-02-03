import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MachineryService {
  baseUrl:string = 'https://machinery-ng.herokuapp.com/user/';
  // baseUrl:string = 'http://de1f4e20.ngrok.io/user/';
  
  constructor( private _http: HttpClient) { }

  getData(url, payload){
    return this._http.get( this.baseUrl + url + payload);
  }

  postData(url, payload){
    return this._http.post( this.baseUrl+ url, payload);
  }

  putData(url, payload){
    return this._http.request('put', this.baseUrl + url, {'body': payload} );
  }

  deleteData( url, payload){
    return this._http.request('delete', this.baseUrl + url, {'body': payload});
  }
}
