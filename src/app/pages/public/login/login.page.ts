import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { WebApiService } from 'src/app/services/webapi/webapi.service';
import { ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StorageKeys } from 'src/app/enums/storagekeys.enum';
import { setupConfig } from '@ionic/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  public type: any;

  private subscription;

  constructor(private authService: AuthenticationService, private router: Router, private formBuilder: FormBuilder
    , private webApi: WebApiService, private toastCtrl: ToastController, private platform: Platform, private storage: Storage) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
      password: ['', Validators.required],
      type: ['', Validators.required]
    });
    this.setup();
  }

  ngOnInit() {}

  async setup() {
    const username = await this.storage.get(StorageKeys.USERNAME);
    const password = await this.storage.get(StorageKeys.PASSWORD);
    const type = await this.storage.get(StorageKeys.TYPE);

    if (username === undefined || password === undefined || type === undefined) { return; }

    this.loginForm.setValue({username: username, password: password, type: type});
    if (type === 'teacher') {
      const key = await this.storage.get(StorageKeys.TEACHER_KEY);
      if (key === undefined) { return; }
      this.loginForm.setValue({username: username, password: password, type: type, key: key});
    }
  }

  async login() {
    /**
    this.authService.login();
    return;
    **/
    let success: boolean;
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    let key = '';

    if (this.type === 'teacher') {
      key = this.loginForm.get('key').value;
      success = await this.webApi.validateCredentials(username, password, key);
    } else {
      success = await this.webApi.validateCredentials(username, password);
    }
    if (success) {
      const toast = await this.toastCtrl.create({
        message: 'Die Logindaten wurden verifiziert',
        duration: 1500,
        cssClass: 'toastSuccess'
      });
      toast.present();
      this.authService.login();

      this.storage.set(StorageKeys.USERNAME, username);
      this.storage.set(StorageKeys.PASSWORD, password);
      this.storage.set(StorageKeys.TEACHER_KEY, key);
      this.storage.set(StorageKeys.TYPE, this.type);
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Die Logindaten sind ungültig',
        duration: 1500,
        cssClass: 'toastFailure'
      });
      toast.present();
    }
  }

  changeType() {
    if (this.type === 'teacher') {
      this.loginForm.addControl('key', new FormControl('', Validators.required));
      this.loginForm.controls['username'].setValidators([Validators.required]);
    } else {
      this.loginForm.removeControl('key');
      this.loginForm.controls['username'].setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
    }
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
