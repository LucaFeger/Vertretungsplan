import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Storage } from '@ionic/storage';
import { AlertController, Platform } from '@ionic/angular';
import { StorageKeys } from 'src/app/enums/storagekeys.enum';

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

  constructor(private authService: AuthenticationService, private storage: Storage, private alertController: AlertController
    , private platform: Platform) { }

  ngOnInit() {
    this.storage.get(StorageKeys.LINES).then((value) => {
      if (value == null) {
        this.storage.set(StorageKeys.LINES, 8);
        this.numbers = Array.from(Array(8)).map((e, i) => i + 1);
      } else {
        this.numbers = Array.from(Array(value)).map((e, i) => i + 1);
      }
    });
  }

  async editLineAmount() {
    const alert = await this.alertController.create({
      header: 'Bitte gib die neue Stundenanzahl an!',
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
  }
  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
