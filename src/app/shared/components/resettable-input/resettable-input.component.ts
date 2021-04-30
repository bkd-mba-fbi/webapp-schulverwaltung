import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'erz-resettable-input',
  templateUrl: './resettable-input.component.html',
  styleUrls: ['./resettable-input.component.scss'],
})
export class ResettableInputComponent implements OnInit {
  @Input() value = '';
  @Input() disabled = false;
  @Input() placeholder: string;
  @Input() label: string;

  @Output() valueChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
