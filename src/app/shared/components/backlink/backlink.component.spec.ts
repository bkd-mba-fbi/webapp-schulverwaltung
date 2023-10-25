import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { BacklinkComponent } from './backlink.component';

describe('BacklinkComponent', () => {
  // let component: BacklinkComponent;
  let fixture: ComponentFixture<BacklinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [BacklinkComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(BacklinkComponent);
    // component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const link = fixture.debugElement.nativeElement.querySelector('a');
    expect(link).toBeTruthy();
  });
});
