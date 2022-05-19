import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'erz-my-grades',
  templateUrl: './my-grades.component.html',
  styleUrls: ['./my-grades.component.scss'],
})
export class MyGradesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('my-grades works!');
  }
}
