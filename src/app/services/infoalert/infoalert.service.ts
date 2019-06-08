import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataService } from '../data/data.service';
import { PlanTypes } from 'src/app/enums/plantypes.enum';

@Injectable({
  providedIn: 'root'
})
export class InfoalertService {

  private days = ['Fehler!', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];

  constructor(private alertController: AlertController, private dataService: DataService) { }

  public async showNormalAlert(data) {
    const alert = await this.alertController.create({
      header: this.days[+data.key.split('-')[0]] + ' ' + data.key.split('-')[1] + '. Stunde',
      message: '<br>' +
      'Fach: ' + data['subject'] + '<br>' +
      'Lehrer: ' + data['teacher'] + '<br>' +
      'Raum: ' + data['room'] + '<br>' +
      'Info: Keine Änderungen!',
      buttons: [
        {
          text: 'Schließen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: () => {
            document.getElementById(data.key).innerHTML = '';
            this.dataService.removeEntryFromStorage(data.key);
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  public async showDetailedAlert(data) {
    const alert = await this.alertController.create({
      header: this.days[+data.key.split('-')[0]] + ' ' + data.key.split('-')[1] + '. Stunde',
      message: this.generateSubHeader(data),
      cssClass: 'blackMessage',
      buttons: [
        {
          text: 'Schließen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: () => {
            document.getElementById(data.key).innerHTML = '';
            this.dataService.removeEntryFromStorage(data.key);
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  private generateSubHeader(data) {
    if (data['type'] === PlanTypes.CANCELLED) {
      return '<br>' +
      'Fach: <s>' + data['subject'] + '</s><br>' +
      'Lehrer: <s>' + data['teacher'] + '</s><br>' +
      'Raum: <s>' + data['room'] + '</s><br>' +
      'Info: ' + data['info'];
    }
    if (data['type'] === PlanTypes.ROOM) {
      return '<br>' +
      'Fach: ' + data['subject'] + '<br>' +
      'Lehrer: ' + data['teacher'] + '<br>' +
      'Raum: <s>' + data['room'] + '</s> ' + data['newRoom'] + '<br>' +
      'Info: ' + data['info'];
    }
    if (data['type'] === PlanTypes.SUBSTITUTE) {
      return '<br>' +
      'Fach: ' + data['subject'] + '<br>' +
      'Lehrer: <s>' + data['teacher'] + '</s> ' + data['newSubject'] + '<br>' +
      'Raum: ' + data['room'] + '<br>' +
      'Info: ' + data['info'];
    }
  }

}
