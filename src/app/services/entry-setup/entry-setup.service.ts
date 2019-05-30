import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertInput } from '@ionic/core';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class EntrySetupService {

  private subjects: AlertInput[];
  private teachers: AlertInput[];

  constructor(private alertController: AlertController, private dataService: DataService) {
    this.subjects = [{type: 'radio', label: 'Mathematik', value: 'ma'}, {type: 'radio', label: 'Deutsch', value: 'd'}];
    this.teachers = [{type: 'radio', label: 'Bültmann', value: 'BÜ'}, {type: 'radio', label: 'Horn', value: 'HN'}];

    //TODO Fragen: Erst Fach (hard gecodete Liste) und dann Lehrer sortieren ODER Erst Lehrer (dynamisch) und dann dynamisch nur die Fachkürzel anzeigen
  }

  async setup(id: string) {
    let result;
    const alert = await this.alertController.create({
      header: 'Fach auswählen',
      inputs: this.subjects,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Weiter',
          handler: (data) => {
            if (data === undefined || data === '') {
              alert.message = 'Bitte wähle ein Fach aus';
              return false;
            } else {
              alert.dismiss(data);
            }
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then(data => result = data);
    if(typeof result.data == "object" || result.role == "backdrop") return undefined;
    return this.setupTeacher(id, result.data);
  }

  private async setupTeacher(id: string, subject: string) {
    let result;
    const alert = await this.alertController.create({
      header: 'Lehrer auswählen',
      inputs: this.dataService.teacherList,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Weiter',
          handler: (data) => {
            if (data === undefined || data === '') {
              alert.message = 'Bitte wähle einen Lehrer aus';
              return false;
            } else {
              alert.dismiss(data);
            }
          }
        }
      ] 
    });
    await alert.present();
    await alert.onDidDismiss().then(data => result = data);
    if(typeof result.data == "object" || result.role == "backdrop") return undefined;
    return this.setupRoom(id, subject, result.data)
  }

  private async setupRoom(id: string, subject: string, teacher: string) {
    let result;
    const alert = await this.alertController.create({
      header: 'Raum eingeben',
      inputs: [{
        type: 'text',
        label: 'Raumnummer',
        name: 'value'
      }],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: (data) => {alert.dismiss("-1")}
        },
        {
          text: 'Fertigstellen',
          handler: (data) => {
            if(!isNaN(+data.value) && (data.value + "").length === 3) {
              alert.dismiss(+data.value);
              return true;
            } else {
              if (data.value === 'SP1' || data.value === 'SP2' ||data.value === 'SP3') {
                alert.dismiss(data.value);
                return true;
              }
              alert.message = 'Bitte gib eine Nummer an oder eine der folgenden Optionen ein: SP1, SP2, SP3'
              return false;
            }
            // bLNtTmmmPdBZwrB5trgQ
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then(data => result = data);
    if(typeof result.data == "object" || result.role == "backdrop") return undefined;
    return {id: id, subject: subject, teacher: teacher, room: result.data}
  }

}
