import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerInputs', [
      transition(':enter', [
        query('input', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ])
      ])
    ]),
    trigger('pulse', [
      state('inactive', style({ transform: 'scale(1)' })),
      state('active', style({ transform: 'scale(1.05)' })),
      transition('inactive <=> active', animate('300ms ease-in-out'))
    ])
  ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  buttonState = 'inactive';

  private gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  private strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(this.gmailPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.strongPasswordPattern)]]
    });
  }

  ngOnInit() {}

  register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      return;
    }

    const user = {
      ...this.registerForm.value,
      authority: [{ authority: 'ROLE_USER' }]
    };

    this.authService.register(user).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.successMessage = null;
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Registration failed. Please check your details or try a different username/email.';
      }
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.errors?.['required']) {
      return `${controlName === 'userName' ? 'Username' : controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required.`;
    }
    if (control?.errors?.['minlength']) {
      return `${controlName === 'userName' ? 'Username' : controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters.`;
    }
    if (control?.errors?.['pattern']) {
      if (controlName === 'email') {
        return 'Please enter a valid Gmail address (e.g., example@gmail.com).';
      }
      if (controlName === 'password') {
        return 'Password must be 8-20 characters with uppercase, lowercase, number, and special character (e.g., !@#$%^&*).';
      }
    }
    return '';
  }

  toggleButtonState() {
    this.buttonState = this.buttonState === 'inactive' ? 'active' : 'inactive';
  }

  closePopup() {
    this.errorMessage = null;
    this.successMessage = null;
  }
}