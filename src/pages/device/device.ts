import {Component, NgZone} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import {Storage} from "@ionic/storage";
import {HomePage} from "../home/home";
import {Vibration} from "@ionic-native/vibration";
import {LocalNotifications} from "@ionic-native/local-notifications";

// Bluetooth UUIDs
const BUTTON_SERVICE = 'FFF0';
const BUTTON_STATE_CHARACTERISTIC = 'FFF1';

@Component({
  selector: 'page-device',
  templateUrl: 'device.html',
})
export class DevicePage {

  device: any;
  id: string;
  peripheral: any = {};
  statusMessage: string;
  buttonState: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ble: BLE,
              private ngZone: NgZone,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private storage: Storage,
              private vibration: Vibration,
              private localNotifications: LocalNotifications,
              private platform: Platform) {


    this.device = this.navParams.get('device');
    this.setStatus('Connecting to ' + this.device.name || this.device.id);

    this.storage.set('device', JSON.stringify(this.device));

    this.ble.connect(this.device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {

  }

  disconnect(): void {

    this.ble.disconnect(this.device.id);
    this.storage.remove('device');
    this.navCtrl.setRoot(HomePage);

  }

  onConnected(peripheral) {


    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

    this.startNotifications();
    /*this.stopNotifications()
      .then(() => {
        this.startNotifications();
      })
      .catch(() => {
        this.startNotifications();
      }) */

  }


  stopNotifications(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ble.stopNotification(this.peripheral.id, BUTTON_SERVICE , BUTTON_STATE_CHARACTERISTIC)
        .then(() => {
          resolve();
        })
        .catch((e) => {
        console.log(e);
          reject();
        })
    });

  }

  startNotifications(): void {
    /*
    WORK AROUND FOR DEVICE THAT IS AWAYS NOTIFY - ON

    Since the iTag doesn't meet spec, it's not going to work with the
    plugin. Assuming that notifications are always enabled on the device,
    you can probably modify the plugin to make it work.

    For Android comment out the code that returns an error.

    cordova-plugin-ble-central/src/android/Peripheral.java
    callbackContext.error("Set notification failed for " + characteristicUUID);


    For iOS comment out the code that tries to write to the descriptor
    [peripheral setNotifyValue:YES forCharacteristic:characteristic];
     */
    this.ble.startNotification(this.peripheral.id, BUTTON_SERVICE, BUTTON_STATE_CHARACTERISTIC).subscribe(
      data => this.onButtonStateChange(data),
      (e) => this.showAlert('Unexpected Error', 'Failed to subscribe for button state changes ' + e)
    )
  }



  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
    this.storage.remove('device');
    this.navCtrl.setRoot(HomePage);

  }

  onButtonStateChange(buffer: ArrayBuffer) {
    this.vibration.vibrate(500);


    let data = new Uint8Array(buffer);
    console.log(data[0]);
    this.notification(data[0]);

    this.ngZone.run(() => {
      this.buttonState = data[0];
    });

  }

  resetButton(): void {
    this.ngZone.run(() => {
      this.buttonState = 0;
    });
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }


  // Disconnect peripheral when leaving the page
  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.storage.remove('device');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  notification(data): void {
    // Schedule a single notification

    this.localNotifications.schedule({
      title: 'BLE',
      text: 'Button press detected, DATA: ' + data,
      sound: this.platform.is('android') ? 'file://sound.mp3': 'file://beep.caf'
    });
  }

}
