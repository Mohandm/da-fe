import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: firebase.User;
  token: string;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.firebaseAuth.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        user.getIdToken(false).then((token) => {
          this.token = token;
          localStorage.setItem('token', token);
        });
      } else {
        localStorage.removeItem('token');
      }
    });
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((value) => {
        console.log('Success!', value);
      })
      .catch((err) => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string): Promise<any> {
    return this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((value) => {
        console.log('Nice, it worked!', value);
        this.user = value.user;
        this.user.getIdToken().then((token) => {
          localStorage.setItem('token', token);
        });
        return value;
      })
      .catch((err) => {
        console.log('Something went wrong:', err.message);
      });
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('token');
  }

  public getCurrentUser = (): Promise<firebase.User> => {


    return new Promise<any>((resolve, reject) => {
      var user = this.firebaseAuth.onAuthStateChanged(function(user){
        if (user) {
          user.getIdToken().then((token) => {
            localStorage.setItem('token', token);
          });
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  };

  public getToken = (): String => {
    return localStorage.getItem('token');
  };

  public syncProfile(): Observable<firebase.User> {
    return this.firebaseAuth.authState;
  }

  public setUser(user: firebase.User) {
    this.user = user;
    user.getIdToken(false).then((token) => {
      this.token = token;
    });
  }
}
