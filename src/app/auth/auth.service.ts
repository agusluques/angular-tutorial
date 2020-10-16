import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import {environment} from '../../environments/environment';

import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private timerLogout: any = null;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
      .pipe(
        catchError(this.handlerError),
        tap(response => { this.handleUser(response.email, response.localId, response.idToken, +response.expiresIn) })
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
      .pipe(
        catchError(this.handlerError),
        tap(response => { this.handleUser(response.email, response.localId, response.idToken, +response.expiresIn) })
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    const user = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (user.token) {
      this.user.next(user);
      
      this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime())
    }

  }

  logout() {
    this.user.next(null);

    this.router.navigate(['/auth']);

    localStorage.removeItem('userData');

    if (this.timerLogout) clearTimeout(this.timerLogout);

    this.timerLogout = null;
  }

  autoLogout(expirationDuration: number) {
    this.timerLogout = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  private handlerError(error: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred!';

    if (!error.error || !error.error.error) return throwError(error);

    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This user does not exist!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid!';
        break;
    }

    return throwError(errorMessage);
  }

  private handleUser(email: string, id: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(email, id, token, expirationDate);

    this.user.next(user);

    this.autoLogout(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }
}
