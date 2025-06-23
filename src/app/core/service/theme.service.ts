import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(localStorage.getItem('darkMode') === 'true');
  darkMode$ = this.darkModeSubject.asObservable();

  setDarkMode(isDark: boolean) {
    localStorage.setItem('darkMode', isDark.toString());
    this.darkModeSubject.next(isDark);
  }
}
