import { Component, OnInit } from '@angular/core';
import * as DarkReader from 'darkreader';
import { ThemeService } from '../../core/service/theme.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent implements OnInit {
  isDarkMode: boolean = false;
  isSettingsOpen = false;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    this.isDarkMode = savedDarkMode;
    if (this.isDarkMode) {
      this.enableDarkMode();
    }
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }
  toggleSettingsPanel(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
  }
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
    this.isDarkMode ? this.enableDarkMode() : this.disableDarkMode();
  }
  enableDarkMode(): void {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable({
      brightness: 100,
      contrast: 90,
      sepia: 10
    });
  }

  disableDarkMode(): void {
    DarkReader.disable();
  }
  closeSettingsPanel(): void {
    this.isSettingsOpen = false;
  }
}
