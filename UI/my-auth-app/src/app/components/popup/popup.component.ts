import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  @Input() message: string | null = '' ;
  @Input() isSuccess: boolean = false; // New input to distinguish success
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}