import {
  ChangeDetectionStrategy,
  Component,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { uniqueId } from 'lodash-es';

@Component({
  selector: 'erz-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent {
  @Input() id: Option<string> = null;
  @Input() label: Option<string> = null;
  @Input() disabled = false;
  @Input() value = false;
  @Output() valueChange = new EventEmitter<boolean>();

  fallbackId = uniqueId('erz-switch');

  constructor() {}
}
