import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertInput } from '@ionic/core';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class EntrySetupService {

  private subjects: AlertInput[];

  constructor(private alertController: AlertController, private dataService: DataService) {
    this.subjects = [{type: 'radio', label: 'Biologie', value: 'BI'}, {type: 'radio', label: 'Chemie', value: 'CH'},
    {type: 'radio', label: 'Deutsch', value: 'D'}, {type: 'radio', label: 'Englisch', value: 'E'},
    {type: 'radio', label: 'Erdkunde ', value: 'EK'}, {type: 'radio', label: 'Evangelische Religion', value: 'ER'},
    {type: 'radio', label: 'Französisch', value: 'F'}, {type: 'radio', label: 'Geschichte', value: 'G'},
    {type: 'radio', label: 'Informatik', value: 'IF'}, {type: 'radio', label: 'Katholische Religion', value: 'KR'},
    {type: 'radio', label: 'Kunst', value: 'KU'}, {type: 'radio', label: 'Latein', value: 'L'},
    {type: 'radio', label: 'Literatur', value: 'LI'}, {type: 'radio', label: 'Mathematik', value: 'MA'},
    {type: 'radio', label: 'Musik', value: 'MU'}, {type: 'radio', label: 'Niederländisch', value: 'N'},
    {type: 'radio', label: 'Pädagogik', value: 'PA'}, {type: 'radio', label: 'Physik', value: 'PH'},
    {type: 'radio', label: 'Philosophie', value: 'PL'}, {type: 'radio', label: 'Sport', value: 'SP'},
    {type: 'radio', label: 'Sozialwissenschaften', value: 'SW'}];
    if (this.dataService.isTeacher) {
      this.subjects.push({type: 'radio', label: 'Elternsprechstunde', value: 'ESP'},
      {type: 'radio', label: 'Ergänzungsstunde', value: 'EZ'},
      {type: 'radio', label: 'Junior-Ingenieur-Akademie', value: 'JIA'}, {type: 'radio', label: 'Präsenzbereitschaft', value: 'PB'},
      {type: 'radio', label: 'Politik', value: 'PK'}, {type: 'radio', label: 'Praktische Philosophie', value: 'PP'},
      {type: 'radio', label: 'Schulleitungsrunde', value: 'ESL'}, {type: 'radio', label: 'Schwimmen', value: 'SCH'},
      {type: 'radio', label: 'Soziales Lernen', value: 'SL'}, {type: 'radio', label: 'Sprachförderung', value: 'SPFÖ'},
      {type: 'radio', label: 'Vertretungsbereitschaft', value: 'VB'});
    }
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
    if (typeof result.data === 'object' || result.role === 'backdrop') { return undefined; }
    return this.setupTeacher(id, result.data);
  }

  private async setupTeacher(id: string, subject: string) {
    let result;

    let teacherShortcuts = this.dataService.rawTeacherList.filter(rawTeacher => rawTeacher['subjects'].includes(subject))
    .map(teacher => teacher['shortcut']);
    if (teacherShortcuts.length === 0) {
      teacherShortcuts = this.dataService.rawTeacherList.map(teacher => teacher['shortcut']);
    }
    const alert = await this.alertController.create({
      header: 'Lehrer auswählen',
      inputs: this.dataService.teacherList.filter(teacher => teacherShortcuts.includes(teacher['value'])),
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
    if (typeof result.data === 'object' || result.role === 'backdrop') { return undefined; }
    return this.setupRoom(id, subject, result.data);
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
          handler: (data) => { alert.dismiss('-1'); }
        },
        {
          text: 'Fertigstellen',
          handler: (data) => {
            if (!isNaN(+data.value) && (data.value + '').length === 3) {
              alert.dismiss(+data.value);
              return true;
            } else {
              if (data.value === 'SP1' || data.value === 'SP2' || data.value === 'SP3') {
                alert.dismiss(data.value);
                return true;
              }
              alert.message = 'Bitte gib eine Nummer an oder eine der folgenden Optionen ein: SP1, SP2, SP3';
              return false;
            }
            // bLNtTmmmPdBZwrB5trgQ
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then(data => result = data);
    if (typeof result.data === 'object' || result.role === 'backdrop') { return undefined; }
    return {id: id, subject: subject, teacher: teacher, room: result.data};
  }

}
