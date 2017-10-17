import {Component, NgZone} from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SpinnerDialog} from "@ionic-native/spinner-dialog";
import {DevicePage} from "../device/device";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  msg: string = 'Tap scan to scan for devices';
  button: string = 'SCAN FOR DEVICES';
  scanning: BehaviorSubject<boolean> = new BehaviorSubject(false);
  devices: any[] = [];
  buttonClass: string;

  constructor(public navCtrl: NavController,
              private spinner: SpinnerDialog,
              private alertCtrl: AlertController,
              private ble: BLE,
              private platform: Platform,
              private ngZone: NgZone,
              private storage: Storage) {


    this.scanning
      .subscribe((scanning) => {
        if (!scanning) {
          this.msg = 'Tap scan to scan for devices';
          this.button = 'SCAN FOR DEVICES';
          this.buttonClass = 'primary';
        } else {
          this.msg = 'Scanning for devices...';
          this.button = 'Scanning ... Tap to stop';
          this.buttonClass = 'danger';
        }
      });

    // check if device in storage and check if connected lah
    this.storage.get('device')
      .then(dev => {
        if(dev){
          let device = JSON.parse(dev);
          if(this.ble.isConnected(device.id)) {
            this.navCtrl.push(DevicePage,{device: device});
          }
        }
      })
  }

  checkBluetooth(): boolean {
    if (this.ble.isEnabled()) {
      return true;
    }

    if (this.platform.is('ios')) {
      this.showError('Bluetooth is not enabled on your device.');
      return false;
    } else if (this.platform.is('android')) {
      this.ble.showBluetoothSettings();
      return false;
    } else {
      this.showError('Must be iOS or android');
      return false;
    }

  }

  showError(message): void {
    this.alertCtrl.create({
      title: 'Error',
      message: message,
      buttons: ['Dismiss']
    }).present();
  }

  scan(): void {

    if (this.scanning.value) { // toggle the string entities
      this.ble.stopScan();
      this.scanning.next(false);
      return;
    }

    if (!this.checkBluetooth()) {
      return;
    }

    this.spinner.show();

    this.devices = [];
    this.scanning.next(true);

    this.ble.startScan([])
      .subscribe(
        dev => this.deviceDiscovered(dev),
       e =>  this.deviceError(e)
      );
  }

  deviceError(err): any {
    this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Error scanning for Bluetooth low energy devices',
      message:err,
      buttons: ['Dismiss']
    }).present();
  }

  deviceDiscovered(dev): void {

    if (this.spinner) {
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
    this.ngZone.run(() => {
      this.devices.push(dev);
    });

  }

  connect(device: any): void {
    this.scanning.next(false);
    this.navCtrl.push(DevicePage, {device: device});
  }


  stuff(message): string {

    let jj: any = message;
    return JSON.stringify(jj, undefined, 2);
  }

}
