import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { APIConstant } from '../../core/constants/api.constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('subProfileWrap', { static: false }) subProfileWrap!: ElementRef;

  isProfileOpen = false;

  // User information from localStorage
  userName: string = 'N/A';
  userEmailId: string = 'N/A';
  organisation: string = 'N/A';
  greetingMessage: string = '';
  userCategory: string = 'N/A';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setGreetingMessage();
    this.getUserDetails();
  }

  getAvatarColor(name: string): string {
    if (!name) return '#e8f4fd'; // Default light blue

    // Microsoft Teams-like color palette (lighter backgrounds)
    const colors = [
      '#f9cfd3', // Slightly darker light red
      '#cce4f7', // Slightly darker light blue
      '#cce5cc', // Slightly darker light green
      '#ffe0b2', // Slightly darker light orange
      '#dab6ff', // Slightly darker light purple
      '#b2f5ea', // Slightly darker light teal
      '#e2e8f0', // Slightly darker light gray
      '#ffe08a', // Slightly darker light yellow
      '#e0e0e0', // Slightly darker very light gray
      '#bbdefb', // Slightly darker light blue variant
      '#dcedc8', // Slightly darker light green variant
      '#ffe082', // Slightly darker light amber
      '#e1bee7', // Slightly darker light pink
      '#b2dfdb', // Slightly darker light cyan
      '#ffe082'  // Slightly darker light lime
    ];

    // Generate a hash from the name to consistently assign colors
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use the hash to select a color from the palette
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  }

  getAvatarTextColor(name: string): string {
    if (!name) return '#1976d2'; // Default dark blue

    // Corresponding dark colors for the light backgrounds
    const textColors = [
      '#c62828', // Dark red
      '#1976d2', // Dark blue
      '#388e3c', // Dark green
      '#f57c00', // Dark orange
      '#7b1fa2', // Dark purple
      '#00695c', // Dark teal
      '#424242', // Dark gray
      '#f57f17', // Dark yellow
      '#616161', // Dark gray variant
      '#0277bd', // Dark blue variant
      '#689f38', // Dark green variant
      '#ff8f00', // Dark amber
      '#ad1457', // Dark pink
      '#00796b', // Dark cyan
      '#827717'  // Dark lime
    ];

    // Use the same hash logic to get corresponding text color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % textColors.length;
    return textColors[colorIndex];
  }

  getUserDetails(): void {
    try {
      const dataStr = localStorage.getItem('data');
      if (dataStr) {
        const userData = JSON.parse(dataStr);
        this.userName = userData.username || 'N/A';
        this.userEmailId = userData.userEmailId || 'N/A';
        this.organisation = userData.organisation || 'N/A';
        this.userCategory = userData.userCategory || 'N/A';
      }
    } catch (error) {
      console.error('Error parsing localStorage:', error);
    }
  }

  getFromLocalStorage(key: string): string {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return '';
  }

  getUserInitials(): string {
    if (!this.userName || this.userName === 'N/A') return 'U';

    const nameParts = this.userName.replace(/['"]/g, "").trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
  }

  setGreetingMessage(): void {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      this.greetingMessage = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.greetingMessage = 'Good Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      this.greetingMessage = 'Good Evening';
    } else {
      this.greetingMessage = 'Good Night';
    }
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
    this.updateToggleStates();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedElement = event.target as HTMLElement;

    if (
      this.subProfileWrap?.nativeElement.contains(clickedElement) ||
      clickedElement.closest('.user-profile')
    ) {
      // Click is inside profile dropdown or trigger
      return;
    }

    // Close if clicked outside
    this.isProfileOpen = false;
    this.updateToggleStates();
    // this.isNotifyOpen = false;

  }

  private updateToggleStates() {
    if (this.subProfileWrap?.nativeElement) {
      this.subProfileWrap.nativeElement.classList.toggle('open-profile', this.isProfileOpen);
    }
  }

  logout() {
    localStorage.clear();
    // window.location.href = APIConstant.Ums + `/login`;
    this.router.navigate(['/login']);
  }
}