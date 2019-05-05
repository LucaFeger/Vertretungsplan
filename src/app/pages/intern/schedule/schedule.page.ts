import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  public normal: Boolean = true;
  public type: 'Normaler' | 'Verkürzter' = 'Normaler';
  private subscription;

  constructor(private platform: Platform) { }

  ngOnInit() {
  }

  changeTitle() {
    if (this.type === 'Normaler') {
      this.type = 'Verkürzter';
    } else {
      this.type = 'Normaler';
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
