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

    private readonly sectionRoutes: Record<string, string[]> = {
        'signup-status': ['user-signup-status', 'edit-user-signup-status'],
        'user-master': ['user-master', 'add-user-master', 'edit-user-master', 'upload-users'],
        'lookup-master': ['lookup-master', 'add-lookup', 'edit-lookup'],
        'role-master': ['role-master', 'add-role', 'edit-role'],
        'app-menu-mapping': ['app-menu-mapping', 'add-app-menu-mapping', 'edit-app-menu-mapping'],
        'app-role-menu-mapping': [
            'app-role-menu-mapping',
            'add-app-role-menu-mapping',
            'edit-app-role-menu-mapping'
        ]
    };

    constructor(
        private themeService: ThemeService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Initialize the dark mode state
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.themeService.darkMode$.subscribe(isDark => {
            this.isDarkMode = isDark;
        });
    }

    isSectionActive(section: string): boolean {
        const currentPath = this.router.url.split('?')[0].split('#')[0];
        return (this.sectionRoutes[section] || []).some((route) =>
            currentPath === `/masters/${route}` || currentPath.startsWith(`/masters/${route}/`)
        );
    }

}
