import { Component } from '@angular/core';
import { NavController, ToastController, ToastOptions } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from "firebase";

var otherAppConfig = {
  apiKey: "AIzaSyBKPuYsMKU9-wXHS2X8JEFCoe7m2gjHtNk",
  authDomain: "ferriz-f8533.firebaseapp.com",
  databaseURL: "https://ferriz-f8533.firebaseio.com",
  projectId: "ferriz-f8533",
  storageBucket: "ferriz-f8533.appspot.com",
  messagingSenderId: "307952731386"
  };
  
  // Initialize another app with a different config
  var otherApp = firebase.initializeApp(otherAppConfig, "other");
  console.log(otherApp.name);      // "other"
  
      var db = otherApp.database();
      var ref = db.ref("button");

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public userProfile: any;
  public doorStatus


  toastOptions: ToastOptions

  constructor(public toastCtrl: ToastController, public navCtrl: NavController,
    public profileProvider: ProfileProvider, public authProvider: AuthProvider, 
    public alerCtrl: AlertController) {} 

  ionViewDidEnter() {
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
    });
  }


  // ionViewDidLoad() {
  //   const doorProfile: firebase.database.Reference = 
  //   firebase.database().ref(`/userProfile/DoorStatus/`);
  //   this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
  //     this.userProfile = userProfileSnapshot.val();
  //   });
  // }


  // ionViewDidEnter(){
  //   const billId: string = this.navParams.get("billId");
  //   this.billProvider.getBill(billId).subscribe( billSnap => {
  //     this.bill = billSnap;
  //   });
  // }


  doorUnlock(int){this.profileProvider.doorUnlock('45');}
  doorLock(int){this.profileProvider.doorLock('180');}

  UpdateUnlockDoor(unlockDoor) {this.profileProvider.UpdateUnlockDoor('unlock');}
  UpdateLockDoor(lockDoor){this.profileProvider.UpdatelockDoor('lock');}

  light1On(bool){this.profileProvider.light1On('true');}
  light1OnUniversal(bool){this.profileProvider.light1OnUniversal('true');}
  light1Off(bool){this.profileProvider.light1Off('false');}
  light1OffUniversal(bool){this.profileProvider.light1OffUniversal('false');}
  light2On(bool){this.profileProvider.light2On('true');}
  light2OnUniversal(on){this.profileProvider.light2OnUniversal('true');}
  light2Off(bool){this.profileProvider.light2Off('false');}
  light2OffUniversal(bool){this.profileProvider.light2OffUniversal('false');}
  light3On(bool){this.profileProvider.light3On('true');}
  light3OnUniversal(bool){this.profileProvider.light3OnUniversal('true');}
  light3Off(bool){this.profileProvider.light3Off('false');}
  light3OffUniversal(bool){this.profileProvider.light3OffUniversal('false');}
  light4On(bool){this.profileProvider.light4On('true');}
  light4OnUniversal(bool){this.profileProvider.light4OnUniversal('true');}
  light4Off(bool){this.profileProvider.light4Off('false');}
  light4OffUniversal(bool){this.profileProvider.light4OffUniversal('false');}
  

  unlock(){
    ref.set("unlock");
  }
  lock(){
    ref.set("lock");
  }

  

  UnlockToast() {
    let toast = this.toastCtrl.create({
      message: 'The Door is now UNLOCK!',
      duration: 3000
    });
    toast.present();
  }
  LockToast() {
    let toast = this.toastCtrl.create({
      message: 'The Door is now LOCK!',
      duration: 3000
    });
    toast.present();
  }

  

  goToProfile(){ this.navCtrl.push('profile'); }
  

  alert1On() {
    let alert = this.alerCtrl.create({
      title: 'Living Room',
      message: 'Light is Turned On!',
      buttons: ['Ok']
    });
    alert.present();
  }
  alert1Off() {
    let alert = this.alerCtrl.create({
      title: 'Living Room',
      message: 'Light is Turned Off!',
      buttons: ['Ok']
    });
    alert.present();
  }

    alert2On() {
      let alert = this.alerCtrl.create({
        title: 'Dinning Room',
        message: 'Light is Turned On!',
        buttons: ['Ok']
      });
      alert.present();
    }
    alert2Off() {
      let alert = this.alerCtrl.create({
        title: 'Dinning Room',
        message: 'Light is Turned Off!',
        buttons: ['Ok']
      });
      alert.present();
  }
  alert3On() {
    let alert = this.alerCtrl.create({
      title: 'Bed Room',
      message: 'Light is Turned On!',
      buttons: ['Ok']
    });
    alert.present();
  }
  alert3Off() {
    let alert = this.alerCtrl.create({
      title: 'Bed Room',
      message: 'Light is Turned Off!',
      buttons: ['Ok']
    });
    alert.present();
}
alert4On() {
  let alert = this.alerCtrl.create({
    title: 'Comfort Room',
    message: 'Light is Turned On!',
    buttons: ['Ok']
  });
  alert.present();
}
alert4Off() {
  let alert = this.alerCtrl.create({
    title: 'Comfort Room',
    message: 'Light is Turned Off!',
    buttons: ['Ok']
  });
  alert.present();
}
}




