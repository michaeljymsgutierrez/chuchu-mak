import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ProfileProvider {
  public userProfile:firebase.database.Reference;
  public currentUser:firebase.User;
  public doorStatus: firebase.database.Reference;
  public doorLockDegree: firebase.database.Reference;
  public universal: firebase.database.Reference;
  
  constructor() {
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        this.universal = firebase.database().ref('/Lights/');
        this.doorLockDegree = firebase.database().ref('/Lights/');
      }
    });
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  updateName(firstName: string, lastName: string): firebase.Promise<void> {
    return this.userProfile.update({
      firstName: firstName,
      lastName: lastName,
    });
  }

 

  UpdateUnlockDoor(unlockDoor: string): firebase.Promise<any> {
    return this.userProfile.update({
      doorStatus: unlockDoor,
    });
  }

  UpdatelockDoor(lockDoor: string): firebase.Promise<any> {
    return this.userProfile.update({
      doorStatus: lockDoor,
    })
  }

  light1On(bool: string): firebase.Promise<any> {
    return this.userProfile.update({
      Light1: true,
    })
  }
  light1OnUniversal(bool: string): firebase.Promise<any> {
    return this.universal.update({
      Light1: true,
    })
  }
  light1Off(bool: string): firebase.Promise<any> {
    return this.userProfile.update({
      Light1: false,
    })
  }
  light1OffUniversal(bool: string): firebase.Promise<any> {
    return this.universal.update({
      Light1: false,
    })
  }
  light2On(bool: string): firebase.Promise<any> {
    return this.userProfile.update({
      Light2: true,
    })
  }
  light2OnUniversal(bool: string): firebase.Promise<any> {
    return this.universal.update({
      Light2: true,
    })
  }
  light2Off(bool: string): firebase.Promise<any> {
    return this.userProfile.update({
      Light2: false,
    })
  }
  light2OffUniversal(bool: string): firebase.Promise<any> {
    return this.universal.update({
      Light2: false,
    })
  }
  light3On(bool: string): firebase.Promise<any> {
    return this.userProfile.update({
      Light3: true,
    })
  }
  light3OnUniversal(bool: string): firebase.Promise<any> {
    return this.universal.update({
      Light3: true,
    })
  }
  light3Off(bool: string): firebase.Promise<any> {
    return this.userProfile.update({
      Light3: false,
    })
  }
  light3OffUniversal(bool: string): firebase.Promise<any> {
    return this.universal.update({
      Light3: false,
    })
  }
  light4On(bool: string): firebase.Promise<any> {
    return this.userProfile.update({
      Light4: true,
    })
  }
  light4OnUniversal(bool: string): firebase.Promise<any> {
    return this.universal.update({
      Light4: true,
    })
  }
  light4Off(bool: string): firebase.Promise<any> {
    return this.userProfile.update({
      Light4: false,
    })
  }
  light4OffUniversal(bool: string): firebase.Promise<any> {
    return this.universal.update({
      Light4: false,
    })
  }
//Doorlock Servo motor
  doorUnlock(int: string): firebase.Promise<any> {
    return this.doorLockDegree.update({
      DoorStatus: 45,
    })
  }
  doorLock(int: string): firebase.Promise<any> {
    return this.doorLockDegree.update({
      DoorStatus: 180,
    })
  }


  updateDOB(birthDate: string): firebase.Promise<any> {
    return this.userProfile.update({
      birthDate: birthDate,
    });
  }

  updateEmail(newEmail: string, password: string): firebase.Promise<any> {
    const credential =  firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, password);

    return this.currentUser.reauthenticateWithCredential(credential).then( user => {
      this.currentUser.updateEmail(newEmail).then( user => {
        this.userProfile.update({ email: newEmail });
      });
    });
  }

  updatePassword(newPassword: string, oldPassword: string): firebase.Promise<any> {
    const credential =  firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, oldPassword);

    return this.currentUser.reauthenticateWithCredential(credential).then( user => {
      this.currentUser.updatePassword(newPassword).then( user => {
        console.log("Password Changed");
      }, error => {
        console.log(error);
      });
    });
  }
}