import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, delay, expand, reduce } from 'rxjs';
import { Result } from '../models/result.model';
import { mkConfig, generateCsv, download } from 'export-to-csv';

const csvConfig = mkConfig({ useKeysAsHeaders: true });

@Injectable({ providedIn: 'root' })
export class SWAPIService {

  private readonly baseUrl = 'https://swapi.dev/api/people';
  readonly people = signal<Result[]>([]);
  readonly searchFilter = signal<string>(localStorage.getItem('search') as string ?? '');
  readonly genderFilter = signal<string[]>(JSON.parse(localStorage.getItem('gender')!) as string[] ?? []);
  readonly favoriteFilter = signal<string[]>(JSON.parse(localStorage.getItem('favorite')!) as string[] ?? []);
  readonly showFavorite = signal<boolean>(JSON.parse(localStorage.getItem('showFavorite')!) as boolean ?? false);

  readonly genderValues = computed(() => [
    ...new Set(this.people().map((item) => item.gender)),
  ]);
  readonly filteredData = computed(() => {
    const name = this.searchFilter();
    const genders = this.genderFilter();
    const favorites = this.favoriteFilter();
    return this.people().filter((item) => {
      const matchesName =
        name.length === 0 ||
        item.name.toLowerCase().includes(name.toLowerCase());
      const matchesGender =
        genders.length === 0 || genders.includes(item.gender);
      const matchesFavorite = this.showFavorite() ? favorites.includes(item.name) : true; 
  
      return matchesName && matchesGender && matchesFavorite;
    });
  });
  

  constructor(private httpClient: HttpClient) {}

  fetchAllPages(): Observable<any[]> {
    return this.httpClient.get<any>(this.baseUrl).pipe(
      expand((response) =>
        response.next
          ? this.httpClient.get<any>(response.next).pipe(delay(250))
          : EMPTY
      ),
      reduce((acc, current) => acc.concat(current.results), [])
    );
  }

  setPeople(people: Result[]) {
    this.people.set(people);
  }

  setSearchFilter(search: string) {
    this.searchFilter.set(search);
  }

  setGenderFilter(genders: string[]) {
    this.genderFilter.set(genders);
  }

  toggleSelection(item: string) {
    const current = this.genderFilter();
    if (current.includes(item)) {
      this.genderFilter.set(current.filter((i) => i !== item));
    } else {
      this.genderFilter.set([...current, item]);
    }
  }

  markAsFavorite(item: string) {
    const current = this.favoriteFilter();
    if (current.includes(item)) {
      this.favoriteFilter.set(current.filter((i) => i !== item));
    } else {
      this.favoriteFilter.set([...current, item]);
    }
  }

  toggleFavorite(){
    this.showFavorite.update(value => !value);
  }

  exportCSV() {
    const peopleSimplified = this.filteredData().map(character => ({
      name: character.name,
      gender: character.gender
    }))
    const csv = generateCsv(csvConfig)<any>(peopleSimplified);
    download(csvConfig)(csv)
  }
}
