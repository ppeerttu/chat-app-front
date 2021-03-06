import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    templateUrl: './help.component.html',
    styleUrls: [ 'help.component.css' ]
})
export class HelpComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
