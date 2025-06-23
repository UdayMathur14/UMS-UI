import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../core/service/theme.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isDarkMode: boolean = false;

    constructor(private themeService: ThemeService) { }

    ngOnInit(): void {
        // Initialize the dark mode state
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.themeService.darkMode$.subscribe(isDark => {
            this.isDarkMode = isDark;
        });
    }

}
