import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { resultOfStudent } from 'src/app/events/utils/tests';
import { Test } from 'src/app/shared/models/test.model';

@Pipe({
  name: 'erzTestPoints',
})
export class TestPointsPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(input: Test, studentId: number): string {
    if (!input.IsPointGrading) return '';
    return `${resultOfStudent(studentId, input)?.Points || '-'} / ${
      input.MaxPointsAdjusted || input.MaxPoints
    } ${this.translate.instant('tests.points')}`;
  }
}
