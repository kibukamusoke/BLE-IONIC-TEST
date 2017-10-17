## BLE TEST

  
      WORK AROUND FOR DEVICE THAT IS AWAYS NOTIFY - ON
  
      Since the iTag doesn't meet spec, it's not going to work with the
      plugin. Assuming that notifications are always enabled on the device,
      you can probably modify the plugin to make it work.
  
      For Android comment out the code that returns an error.
  
      cordova-plugin-ble-central/src/android/Peripheral.java
      callbackContext.error("Set notification failed for " + characteristicUUID);
  
  
      For iOS comment out the code that tries to write to the descriptor
      [peripheral setNotifyValue:YES forCharacteristic:characteristic];
       
