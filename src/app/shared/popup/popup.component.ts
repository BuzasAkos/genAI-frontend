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
  @Input() type: string = 'confirm';
  @Input() yesLabel: string = 'Yes';
  @Input() noLabel: string = 'No';
  @Input() okLabel: string = 'OK';
  @Output() response = new EventEmitter<string>;

  yesClicked() {
    this.response.emit('yes');
  }

  noClicked() {
    this.response.emit('no');
  }

  okClicked() {
    this.response.emit('ok');
  }
}
