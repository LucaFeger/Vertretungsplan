import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertInput } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class EntrySetupService {

  private subjects: AlertInput[];

  constructor(private alertController: AlertController) {
    this.subjects = [{type: 'radio', label: 'Mathematik', value: 'ma'}, {type: 'radio', label: 'Deutsch', value: 'd'}];
  }

  async setup(id: string) {
    const firstAlert = await this.alertController.create({
      header: 'Fach auswählen',
      inputs: this.subjects,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: (data) => {
            firstAlert.dismiss();
          }
        },
        {
          text: 'Weiter',
          handler: (data) => {
            if (data === undefined || data === '') {
              firstAlert.message = 'Bitte wähle ein Fach aus';
              return false;
            }
          }
        }
      ]
    });
    firstAlert.present();
  }

}
