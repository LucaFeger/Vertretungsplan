import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  constructor(private httpClient: HttpClient) { }

  async validateCredentials(username: string, password: string, key?: string): Promise<boolean> {
    const data = await this.getPlanData(username, password, key);
    const result = !data.includes('-ERR');
    if (result) {
      // TODO: Save to App Preferences
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

}
