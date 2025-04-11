import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideShow', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  designCategories = [
    { name: 'Homes Design', icon: 'home', color: '#6E8EFB' },
    { name: 'Office Design', icon: 'business', color: '#45B7D1' },
    { name: 'Cafe Design', icon: 'local_cafe', color: '#FF6B6B' }
  ];

  demoImages = [
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400', alt: 'Homes Design' },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400', alt: 'Office Design' },
    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400', alt: 'Cafe Design' }
  ];
  currentImageIndex = 0;

  ngOnInit() {
    // Auto-rotate images every 3 seconds
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.demoImages.length;
    }, 3000);
  }

  onImageError(event: Event) {
    // Fallback image if the original fails to load
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
  }
}