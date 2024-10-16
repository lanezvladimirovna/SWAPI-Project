import { Component, OnInit, Input } from '@angular/core';
import { Result } from '../../models/result.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'error-card',
  templateUrl: './error_card.component.html',
  standalone: true,
  imports: [JsonPipe]
})

export class ErrorCardComponent implements OnInit {

  @Input() character: Result | undefined;

  constructor() { }

  ngOnInit() { }
}
