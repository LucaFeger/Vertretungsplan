import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Storage } from '@ionic/storage';
import { StorageKeys } from '../enums/storagekeys.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthenticationService, private router: Router, private storage: Storage) {}

  canActivate() {
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
