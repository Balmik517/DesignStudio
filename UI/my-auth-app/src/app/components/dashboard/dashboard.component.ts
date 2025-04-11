import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string | null = null;
  showProfileDropdown = false;
  email: string | null = null;
  private logoutSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.logoutSubscription = this.authService.onLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnInit() {
    console.log('DashboardComponent loaded');
    const userInfo = this.authService.getUserInfo();
    this.username = userInfo ? userInfo.username : null;
    this.email = localStorage.getItem('email') || 'support@ids.com';
  }

  ngOnDestroy() {
    this.logoutSubscription.unsubscribe();
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      this.showProfileDropdown &&
      !target.closest('.profile-menu') &&
      !target.closest('.nav-sections')
    ) {
      this.showProfileDropdown = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getInitials(): string {
    if (!this.username) return 'D';
    const [firstName, lastName] = this.username.split('@')[0].split('.');
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  onLogoError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.error('Failed to load logo image at assets/IDS.jpg:', {
      event,
      src: imgElement.src,
      message: 'Ensure the file exists in src/assets/IDS.jpg and the assets folder is configured in angular.json'
    });
    imgElement.src = 'https://via.placeholder.com/100x40?text=IDS';
  }

  onBannerImageError(event: Event, type: string) {
    const imgElement = event.target as HTMLImageElement;
    console.error(`Failed to load ${type} banner image at ${imgElement.src}:`, {
      event,
      src: imgElement.src,
      message: 'Check the URL or network connectivity'
    });
    imgElement.src = `https://via.placeholder.com/600x300?text=${type.replace(' ', '+')}`;
  }
}