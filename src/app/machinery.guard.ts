import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MachineryGuard implements CanActivate {

  constructor(private router:Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(!localStorage.getItem('user')||localStorage.getItem('user')==null){
        console.log('MachineryGuard working')
        alert('Please, login to view page!');
        this.router.navigateByUrl('/login');

      } else {
        return true;
      }
      
  }
}
