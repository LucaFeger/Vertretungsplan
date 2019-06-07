import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageKeys } from 'src/app/enums/storagekeys.enum';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public teacherList: Array<{}>;
  public entries;
  public dashboardLoaded: boolean = false;

  constructor(private storage: Storage) { }


  public addEntryToStorage(id: string, data: {}): void {
    this.storage.get(StorageKeys.ENTRIES).then(value => {
      if(value == null) {
        value = {};
        value[id] = data;
        this.storage.set(StorageKeys.ENTRIES, value);
      } else {
        value[id] = data;
        this.storage.set(StorageKeys.ENTRIES, value);
      }
    })
  }

}
