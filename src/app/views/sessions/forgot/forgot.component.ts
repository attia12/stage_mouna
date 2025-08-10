import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html',
    styleUrls: ['./forgot.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})
export class ForgotComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
