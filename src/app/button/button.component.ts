import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Input() buttonText: string

  constructor() { }

}
