import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  @Input() popupMessage: string = '';
  @Input() popupInstruction: string = '';
  @Input() inputValue: string = '';
  @Input() inputPlaceholder: string = '';
  @Input() type: string = 'confirm';
  @Input() yesLabel: string = 'Yes';
  @Input() noLabel: string = 'No';
  @Input() okLabel: string = 'OK';
  @Input() submitLabel: string = 'Submit';
  @Output() response = new EventEmitter<string>;
  @Output() userInput = new EventEmitter<string>;


  yesClicked() {
    this.response.emit('yes');
  }

  noClicked() {
    this.response.emit('no');
  }

  okClicked() {
    this.response.emit('ok');
  }

  submitClicked() {
    this.userInput.emit(this.inputValue);
  }
}
