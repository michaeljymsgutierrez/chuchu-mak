import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import * as firebase from "firebase";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    
    firebase.initializeApp({
      apiKey: "AIzaSyA1DD2NGcVRL2fhVwst3OSnzURvgh8P8og",
      authDomain: "homeautomation-6357b.firebaseapp.com",
      databaseURL: "https://homeautomation-6357b.firebaseio.com",
      projectId: "homeautomation-6357b",
      storageBucket: "homeautomation-6357b.appspot.com",
      messagingSenderId: "99792841746"
      
  });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.rootPage = 'login';
        unsubscribe();
      } else { 
        this.rootPage = HomePage;
        unsubscribe();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}