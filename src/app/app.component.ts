import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication/authentication.service';
import { Router, RouterEvent, NavigationEnd, NavigationStart } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';
import { StorageKeys } from './enums/storagekeys.enum';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { DataService } from './services/data/data.service';
import { DashboardPage } from './pages/intern/dashboard/dashboard.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  pages: Array<{title: string, path: string, icon: string, top: boolean}>;

  constructor(private platform: Platform, private statusBar: StatusBar, private storage: Storage, private headerColor: HeaderColor,
    private authenticationService: AuthenticationService, private router: Router, private splashScreen: SplashScreen
    , private dataService: DataService, private dashboardPage: DashboardPage) {
      this.initializeApp();
      this.pages = [
        { title: 'Startseite', path: '/intern/dashboard', icon: 'home', top: true},
        { title: 'Unterrichtszeiten', path: '/intern/schedule', icon: 'time', top: true},
        { title: 'App-Info', path: '/intern/info', icon: 'information', top: true},
        { title: 'Rechtliches', path: '/intern/legal', icon: 'help', top: false},
        { title: 'Ausloggen', path: '/login', icon: 'key', top: false},
      ];
    }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
      this.headerColor.tint('#DF1800');
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.pages.map(page => {
          return page['active'] = (event.url === page.path);
        });
      } else if (event instanceof NavigationStart) {
        if (event.url === '/login') {
          this.authenticationService.authenticationState.next(false);
          this.storage.set(StorageKeys.LOGGED_IN, false);
        }
      }
    });
  }

  getPages(top: boolean) {
    return this.pages.filter(page => page.top === top);
  }

}
