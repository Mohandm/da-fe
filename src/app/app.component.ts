import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'doctor-anywhere';

  constructor(private authService: AuthService, private router: Router) {}

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
