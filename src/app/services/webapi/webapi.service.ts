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
    const data = await this.getTeacherData(username, password, key);
    const result = !data.includes('-ERR');
    this.dataService.teacherList = [];
    if (result) {
      data.split("\n").forEach((row, i) => {
        if (i <= 3) return;
        const splitData = row.split(";");
        if (splitData[1] == undefined) return;
        this.dataService.teacherList.push({type: 'radio', label: splitData[1] + ` (${splitData[0]})`, value: splitData[0]})
      });

      const plan = await this.getPlanData(username, password, key);
      const success = !plan.includes('-ERR');
      if (success) {
        // TODO: categorize plan data and put into DataService
      }
      
      const value = await this.storage.get(StorageKeys.ENTRIES)
      this.dataService.entries = value;
    }
    return result;
  }

  getPlanData(username: string, password: string, key?: string): Promise<string> {
    console.log(username + ', ' + password + ', ' + key);

    const data = new FormData();
    data.append('user_name', username);
    data.append('user_pwd', password);
    if (key !== undefined) {
      data.append('common_key', key);
    }

    return this.httpClient.post('https://api.mkg-wegberg.de/vplan.php', data, {responseType: 'text'}).toPromise();
  }

  getTeacherData(username: string, password: string, key?: string): Promise<string> {
    console.log(username + ', ' + password + ', ' + key);

    const data = new FormData();
    data.append('user_name', username);
    data.append('user_pwd', password);
    if (key !== undefined) {
      data.append('common_key', key);
    }

    return this.httpClient.post('https://api.mkg-wegberg.de/teacher.php', data, {responseType: 'text'}).toPromise();
  }

}
