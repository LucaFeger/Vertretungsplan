import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Storage } from '@ionic/storage';
import { AlertController, Platform } from '@ionic/angular';
import { StorageKeys } from 'src/app/enums/storagekeys.enum';
import { EntrySetupService } from 'src/app/services/entry-setup/entry-setup.service';
import { DataService } from 'src/app/services/data/data.service';
import { PlanTypes } from 'src/app/enums/plantypes.enum';
import { InfoalertService } from 'src/app/services/infoalert/infoalert.service';
import { WebApiService } from 'src/app/services/webapi/webapi.service';

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
    , private platform: Platform, private entrySetup: EntrySetupService, private dataService: DataService
    , private infoAlert: InfoalertService, private webApi: WebApiService) { }

  async ngOnInit() {
    const value = await this.storage.get(StorageKeys.LINES);
    if (value == null) {
      this.storage.set(StorageKeys.LINES, 8);
      this.numbers = Array.from(Array(8)).map((e, i) => i + 1);
    } else {
      this.numbers = Array.from(Array(value)).map((e, i) => i + 1);
    }
  }

  loadData() {
    this.dataService.substitutes = [];
    Object.entries(this.dataService.entries).forEach(([key, value]) => {
      if (document.getElementById(key) == null) { return; }
      document.getElementById(key).innerHTML = value['subject'] + '<br>' + value['teacher'] + '<br>' + value['room'];
      const matches = this.dataService.vplanData.filter(vplan =>
        vplan['oldTeacher'] === value['teacher']
          && vplan['oldSubject'] === value['subject']
          && key.split('-')[1] === vplan['hour']
          && this.isDateValid(vplan['date'])
          && this.getDayInWeek(vplan['date']) === +key.split('-')[0] // Is the day correct
      );
      if (matches.length > 0) {
        matches.forEach(vplan => { // check for duplicates
          if (this.dataService.substitutes.filter(data => data['subject'] === value['subject'] &&
          data['room'] === value['room'] && data['teacher'] === value['teacher'] && Math.abs(+data['hour'] - +key.split('-')[1]) !== 1)
          .length > 0) {
            this.dataService.duplicateWarning = true;
            return;
          }

          const object = {subject: value['subject'], room: value['room'], teacher: value['teacher'], info: vplan['info']
          , hour: vplan['hour']};
          if (vplan['type'] === 'eigenverantwortliches Arbeiten') {
            Object.assign(object, {'key': key, 'type': PlanTypes.CANCELLED});
            document.getElementById(key).classList.add('red');
          } else if (vplan['type'] === 'Klausur') {
              return; // ignore due to time
          } else if (vplan['oldRoom'] !== vplan['newRoom'] || vplan['type'] === 'Raum-Vtr.') {
            // Raumvertretung
            Object.assign(object, {'key': key, 'type': PlanTypes.ROOM, 'newRoom': vplan['newRoom']});
            document.getElementById(key).classList.add('yellow');
          } else if (vplan['oldTeacher'] !== vplan['newTeacher']) {
            Object.assign(object, {'key': key, 'type': PlanTypes.SUBSTITUTE, 'newTeacher': vplan['newTeacher']});
            document.getElementById(key).classList.add('green');
          }

          this.dataService.substitutes.push(object);
        });
      }
    });
  }

  editEntry(event) {
    if (event.srcElement.innerHTML === '') {
      const result = this.entrySetup.setup(event.srcElement.id);
      result.then(data => {
        if (data === undefined) { return; }
        document.getElementById(data.id).innerHTML = data.subject + '<br>' + data.teacher + '<br>' + data.room;
        delete data.id;
        this.dataService.addEntryToStorage(event.srcElement.id, data);
      });
    } else {
      const list = this.dataService.substitutes.filter(temp => temp['key'] === event.srcElement.id);
      if (list.length > 0) {
        this.infoAlert.showDetailedAlert(list[0]);
      } else {
        const data = this.dataService.entries[event.srcElement.id];
        data['key'] = event.srcElement.id;
        this.infoAlert.showNormalAlert(data);
      }
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

  async ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
        navigator['app'].exitApp();
    });
    const value = await this.storage.get(StorageKeys.LINES);
    if (value == null) {
      this.storage.set(StorageKeys.LINES, 8);
      this.numbers = Array.from(Array(8)).map((e, i) => i + 1);
    } else {
      this.numbers = Array.from(Array(value)).map((e, i) => i + 1);
    }
    this.loadData();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  public isDateValid(dateString: string): boolean {
    const date = new Date();

    const day = dateString.slice(-2);
    const month = dateString.slice(4, 6);
    const year = dateString.slice(0, 4);

    const dayDifference = Math.floor((Date.UTC(+year, +month - 1, +day)
    - Date.now()) / (1000 * 60 * 60 * 24)); // convert timestamp difference to days

    if (date.getDay() === 0 || date.getDay() === 6) { // Sunday or Saturday
      return date.getDay() === 0 ? (dayDifference >= 1 && dayDifference <= 5) : (dayDifference >= 2 && dayDifference <= 6);
    } else {
      return dayDifference <= 5 - date.getDay();
    }
  }

  public getDayInWeek(dateString: string): number {
    const day = +dateString.slice(-2);
    const month = +dateString.slice(4, 6);
    const year = +dateString.slice(0, 4);

    return new Date(year, month - 1, day).getDay();
  }

  public async doRefresh(event) {
    const credentials = this.dataService.loginData;
    const result = await this.webApi.validateCredentials(credentials.username, credentials.password, credentials.key);
    console.log(result);
    this.loadData();
    event.target.complete();
  }

}
