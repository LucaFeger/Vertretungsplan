import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageKeys } from 'src/app/enums/storagekeys.enum';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public teacherList: Array<Object>;
  public rawTeacherList: Array<Object>;
  public entries: {};
  public vplanData: Array<Object>;
  public substitutes: Array<Object> = [];
  public loginData: {username, password, key?};

  public duplicateWarning = false;
  public updateTime: string;
  public isTeacher = false;

  constructor(private storage: Storage) { }


  public addEntryToStorage(id: string, data: {}): void {
    this.storage.get(StorageKeys.ENTRIES).then(value => {
      if (value == null) {
        value = {};
        value[id] = data;
        this.storage.set(StorageKeys.ENTRIES, value);
      } else {
        value[id] = data;
        this.storage.set(StorageKeys.ENTRIES, value);
      }
      this.entries = value;
    });
  }

  public removeEntryFromStorage(id: string) {
    if (this.entries == null) {  return; }
    document.getElementById(id).className = '';
    delete this.entries[id];
    this.storage.set(StorageKeys.ENTRIES, this.entries);
  }

}
