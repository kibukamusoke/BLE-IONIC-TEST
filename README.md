## BLE TEST

  # Instructions to run
  1. Clone repo to your machine
  2. npm install
  3. cordova platform add android
  4. cordova platform add ios
  5. cordova run android
  
  * for ios, open xcode and add a development team then you can run the ios in xcode
  subsequent ios builds: 
  6. cordova run ios
  
  
  ## resources: 
  
  * BLE - https://github.com/don/cordova-plugin-ble-central
  * Local Notifications: https://github.com/katzer/cordova-plugin-local-notifications 
  
  ionic docs: https://ionicframework.com/docs/native/

  ## Solution for "Error unknown attribute on notification sub"
  
      WORK AROUND FOR DEVICE THAT IS AWAYS NOTIFY - ON
  
      Since the iTag doesn't meet spec, it's not going to work with the
      plugin. Assuming that notifications are always enabled on the device,
      you can probably modify the plugin to make it work.
  
      For Android comment out the code that returns an error.
  
      cordova-plugin-ble-central/src/android/Peripheral.java
      callbackContext.error("Set notification failed for " + characteristicUUID);
  
  
      For iOS comment out the code that tries to write to the descriptor
      [peripheral setNotifyValue:YES forCharacteristic:characteristic];
       
