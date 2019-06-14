import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { DataService } from '../data/data.service';
import { StorageKeys } from 'src/app/enums/storagekeys.enum';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  constructor(private httpClient: HttpClient, private storage: Storage, private dataService: DataService) { }

  async validateCredentials(username: string, password: string, key?: string): Promise<boolean> {
    this.dataService.loginData = {username: username, password: password, key: key};
    const data = await this.getTeacherData(username, password, key);
    const result = !data.includes('-ERR');
    this.dataService.teacherList = [];
    this.dataService.rawTeacherList = [];
    if (result) {
      data.split('\n').forEach((row, i) => {
        if (i <= 3) { return; }
        const splitData = row.split(';');
        if (splitData[1] === undefined) { return; }
        this.dataService.teacherList.push({type: 'radio', label: splitData[1] + ` (${splitData[0]})`, value: splitData[0]});
        this.dataService.rawTeacherList.push({name: splitData[1], shortcut: splitData[0], subjects: splitData[3].split(',')});
      });

      const plan = await this.getPlanData(username, password, key);
      const success = !plan.includes('-ERR');
      if (success) {
        this.dataService.vplanData = [];
        plan.split('\n').forEach((row, i) => {
          if (i === 2) {
            this.dataService.updateTime = row.split(': ')[1].split(' � ')[1];
          }
          if (i <= 4) { return; }
          const splitData = row.split(';');
          const resultObject = {};
          resultObject['date'] = splitData[0];
          resultObject['oldSubject'] = splitData[3].split(' ')[0];
          resultObject['oldTeacher'] = splitData[4];
          resultObject['newSubject'] = splitData[5].split(' ')[0];
          resultObject['newTeacher'] = splitData[6];
          if (/\d/.test(resultObject['oldRoom'])) { // has numbers?
            resultObject['oldRoom'] = splitData[7].match(/\d/g).join(''); // Filter Numbers
          } else {
            resultObject['oldRoom'] = splitData[7];
          }

          if (/\d/.test(resultObject['newRoom'])) { // has numbers?
            resultObject['newRoom'] = splitData[8].match(/\d/g).join(''); // Filter Numbers
          } else {
            resultObject['newRoom'] = splitData[8];
          }
          resultObject['info'] = splitData[9];
          resultObject['type'] = splitData[10];

          const hour = splitData[2].replace(' ', '');
          if (hour.includes('-')) {
            const splitted = hour.split('-');
            const newObject = Object.assign({}, resultObject);
            newObject['hour'] = splitted[0].replace(' ', '');
            resultObject['hour'] = splitted[1].replace(' ', '');

            this.dataService.vplanData.push(resultObject, newObject);
          } else {
            resultObject['hour'] = hour;
            this.dataService.vplanData.push(resultObject);
          }
        });
      }

      const value = await this.storage.get(StorageKeys.ENTRIES);
      this.dataService.entries = value;
    }
    if (key !== undefined) {
      this.dataService.isTeacher = true;
    }
    return result;
  }

  getPlanData(username: string, password: string, key?: string): Promise<string> {
    const data = new FormData();
    data.append('user_name', username);
    data.append('user_pwd', password);
    if (key !== undefined) {
      data.append('common_key', key);
    }

    return this.httpClient.post('https://api.mkg-wegberg.de/vplan.php', data, {responseType: 'text'}).toPromise();
  }

  getTeacherData(username: string, password: string, key?: string): Promise<string> {
    const data = new FormData();
    data.append('user_name', username);
    data.append('user_pwd', password);
    if (key !== undefined) {
      data.append('common_key', key);
    }

    return this.httpClient.post('https://api.mkg-wegberg.de/teacher.php', data, {responseType: 'text'}).toPromise();
  }

}
