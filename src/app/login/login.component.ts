import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.getToken()) {
      this.router.navigate(['/list']);
    }
  }

  failed: boolean = false;

  login(form: any) {
    if (this.loginForm.valid) {
      this.authService
        .login(form.email, form.password)
        .then((value) => {
          this.router.navigate(['/list']);
        })
        .catch((value) => {
          this.failed = true;
        });
    }
  }
}
