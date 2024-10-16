import { Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SWAPIService } from './services/swapi.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { Result } from './models/result.model';
import { CharacterCardComponent } from './components/character_card/character-card.component';
import { SpinnerComponent } from './components/spinner/spinner.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,JsonPipe,CharacterCardComponent,SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  readonly swapiService = inject(SWAPIService);
  selectedItem: Result | undefined;
  isLoading = true;

  constructor(){
    effect(()=>{
      localStorage.setItem('search',this.swapiService.searchFilter());
      localStorage.setItem('favorite',JSON.stringify(this.swapiService.favoriteFilter()) );
      localStorage.setItem('gender',JSON.stringify(this.swapiService.genderFilter()));
      localStorage.setItem('showFavorite',JSON.stringify(this.swapiService.showFavorite()));
    })
  }

  ngOnInit(): void {
    this.swapiService.fetchAllPages().subscribe({
      next: (people) => {
        this.swapiService.setPeople(people);
        this.isLoading = false;
      },
    });
  }

  onSearchInputChange(searchTerm: Event) {
    const input = searchTerm.target as HTMLInputElement;
    this.swapiService.setSearchFilter(input.value);
  }

  selectItem(item: Result){
    this.selectedItem=item;
  }

}
