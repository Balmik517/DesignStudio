import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulse', [
      state('inactive', style({ transform: 'scale(1)' })),
      state('active', style({ transform: 'scale(1.05)' })),
      transition('inactive <=> active', animate('300ms ease-in-out'))
    ])
  ]
})
export class LoginComponent implements OnInit {
  credentials = { username: '', password: '' };
  errorMessage: string | null = null;
  buttonState = 'inactive';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login() {
    this.authService.login(this.credentials).subscribe(
      () => this.validateAndRoute(),
      (error) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    );
  }

  toggleButtonState() {
    this.buttonState = this.buttonState === 'inactive' ? 'active' : 'inactive';
  }

  private validateAndRoute() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.authService.refreshToken().subscribe(
        (response) => {
          if (response && this.authService.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Session expired. Please log in again.';
          }
        },
        () => {
          this.errorMessage = 'Unable to refresh session. Please log in again.';
        }
      );
    }
  }

  closePopup() {
    this.errorMessage = null;
  }
}