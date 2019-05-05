import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { StorageKeys } from 'src/app/enums/storagekeys.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router, private storage: Storage) {}

  authenticationState: BehaviorSubject<boolean> = new BehaviorSubject(false);

   login() {
     // TODO: Check provided login data
     this.authenticationState.next(true);
     this.router.navigate(['intern', 'dashboard'], { replaceUrl: true });
     this.storage.set(StorageKeys.LOGGED_IN, true);
   }

   logout() {
     this.authenticationState.next(false);
     this.router.navigate(['login'], { replaceUrl: true });
     this.storage.set(StorageKeys.LOGGED_IN, false);
   }

   isAuthenticated(): boolean {
     return this.authenticationState.value;
   }

}
