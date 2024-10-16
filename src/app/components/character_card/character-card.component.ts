import { Component, OnInit, Input } from '@angular/core';
import { Result } from '../../models/result.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'character-card',
  templateUrl: './character-card.component.html',
  standalone: true,
  imports: [JsonPipe]
})

export class CharacterCardComponent implements OnInit {

  @Input() character: Result | undefined;

  constructor() { }

  ngOnInit() { }
}
