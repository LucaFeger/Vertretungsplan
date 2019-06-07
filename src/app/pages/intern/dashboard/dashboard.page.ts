import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Storage } from '@ionic/storage';
import { AlertController, Platform } from '@ionic/angular';
import { StorageKeys } from 'src/app/enums/storagekeys.enum';
import { EntrySetupService } from 'src/app/services/entry-setup/entry-setup.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public numbers: number[];
  public online: Boolean = true;
  public dateObject: Date = new Date();
  private subscription;

  public counter = 0;

  constructor(private authService: AuthenticationService, private storage: Storage, private alertController: AlertController
    , private platform: Platform, private entrySetup: EntrySetupService, private dataService: DataService) { }

  async ngOnInit() {
    const value = await this.storage.get(StorageKeys.LINES)
    if (value == null) {
      this.storage.set(StorageKeys.LINES, 8);
      this.numbers = Array.from(Array(8)).map((e, i) => i + 1);
    } else {
      this.numbers = Array.from(Array(value)).map((e, i) => i + 1);
    }
  }

  loadDataFromHTML(last: boolean) {
    // TODO: Load after page swichting again.
    if(!last) return;
    this.counter++;
    if(this.counter < 8) return;
    console.log("WOHOOO BEHIND COUNTER")
    if(this.dataService.entries == null) return;
    console.log("YEAAAHHH NOT NULL")
    this.loadData();
    this.counter = 0;
    console.log("reseted to 0 :(")
  }

  loadData() {
    Object.entries(this.dataService.entries).forEach(([key, value]) => {
      //if(document.getElementById(key) == null) {console.log('null'); return};
      console.log("last element: " + document.getElementById(key))
      document.getElementById(key).innerHTML = value["subject"] + "<br>" + value["teacher"] + "<br>" + value["room"];
    })
    console.log("YEAAAH DONE WITH LOADING")
    this.dataService.dashboardLoaded = true;
  }
  
  editEntry(event) {
    if (event.srcElement.innerHTML === "") {
      let result = this.entrySetup.setup(event.srcElement.id);
      result.then(data => {
        if (data == undefined) return;
        document.getElementById(data.id).innerHTML = data.subject + "<br>" + data.teacher + "<br>" + data.room;
        delete data.id;
        this.dataService.addEntryToStorage(event.srcElement.id, data);
      })
    } else {
      console.log('else');
      // show information
    }
  }

  async editLineAmount() {
    const alert = await this.alertController.create({
      header: 'Gib deine tägliche Stundenzahl ein!',
      inputs: [
        { name: 'rows',
          type: 'number',
          value: this.numbers.length }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.rows >= 6 && data.rows <= 10) {
              this.numbers = Array.from(Array(+data.rows)).map((e, i) => i + 1);
              this.storage.set(StorageKeys.LINES, +data.rows);
            } else {
              alert.message = 'Gib eine Zahl zwischen 8 und 10 Stunden ein.';
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
        navigator['app'].exitApp();
    });
    console.log("entering again")
    console.log(document)
    this.loadData();
  }
  ionViewWillLeave() {
    this.subscription.unsubscribe();
    console.log("will leave")
  }

}
