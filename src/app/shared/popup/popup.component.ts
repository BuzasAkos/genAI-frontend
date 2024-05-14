import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  @Input() popupMessage: string = '';
  @Input() yesLabel: string = 'Yes';
  @Input() noLabel: string = 'No';
  @Output() response = new EventEmitter<string>;

  yesClicked() {
    this.response.emit('yes');
  }

  noClicked() {
    this.response.emit('no');
  }
}
