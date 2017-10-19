import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {HomePage} from '../pages/home/home';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {BLE} from "@ionic-native/ble";
import {SpinnerDialog} from "@ionic-native/spinner-dialog";
import {DevicePage} from "../pages/device/device";
import {Toast} from "@ionic-native/toast";
import {IonicStorageModule, Storage} from "@ionic/storage";
import {ButtonStateDescriptionPipe} from "../pipes/button-state-description/button-state-description";
import {Vibration} from "@ionic-native/vibration";
import {LocalNotifications} from "@ionic-native/local-notifications";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DevicePage,
    ButtonStateDescriptionPipe
  ],
  imports: [
    IonicStorageModule.forRoot(),
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DevicePage
  ],
  providers: [
    Vibration,
    SpinnerDialog,
    Toast,
    BLE,
    LocalNotifications,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}

