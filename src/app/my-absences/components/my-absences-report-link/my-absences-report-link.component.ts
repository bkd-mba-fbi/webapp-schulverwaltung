import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'erz-my-absences-report-link',
  templateUrl: './my-absences-report-link.component.html',
  styleUrls: ['./my-absences-report-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesReportLinkComponent {
  @ViewChild('link') link: ElementRef<HTMLElement>;

  @HostListener('click', ['$event'])
  onClick(): void {
    this.link.nativeElement.click();
  }

  constructor() {}
}
