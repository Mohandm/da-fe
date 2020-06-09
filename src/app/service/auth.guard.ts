import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
  CanLoad,
  Route,
  UrlSegment,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    this.authenticationService.getCurrentUser();
    const token = this.authenticationService.getToken();
    if (token) {
      // logged in so return true
      return true;
    } else {
      this.authenticationService.syncProfile().pipe(
        map(() => true),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      // logged in so return true
      return true;
    } else {
      return this.authenticationService.syncProfile().pipe(
        map(() => true),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
  }
}
