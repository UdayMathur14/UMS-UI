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
  // @ViewChild('subNotifyWrap', { static: false }) subNotifyWrap!: ElementRef;

  isProfileOpen = false;

  // User information from localStorage
  userName: string = 'N/A';
  userEmailId: string = 'N/A';
  organisation: string = 'N/A';
  greetingMessage: string = '';

  // notifications: string[] = [
  //   'Ticket #12352 has been created. Our support team will get back to you soon.',
  //   'Ticket #12353 has been assigned to Priya Sharma for further investigation.',
  //   'Ticket #12354 status updated to "Under Review."',
  //   'Ticket #12355 requires additional information. Please check and respond.',
  //   'Ticket #12356 has been resolved. Let us know if you need further assistance.',
  //   'Ticket #12357 has been escalated to the technical team for urgent review.',
  //   'Ticket #12358 has been closed. We appreciate your patience!',
  //   'Ticket #12359 has been marked as "Pending Customer Response."',
  //   'Ticket #12360 has been reopened for further troubleshooting.',
  //   'Ticket #12361 has been updated with the latest resolution steps. Please review and confirm.'
  // ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.userName = JSON.parse(localStorage.getItem('userName') || '');
    console.log(this.userName);
    this.setGreetingMessage();
    this.getUserDetails()
  }

  getUserDetails(): void {
    try {
      // Retrieve profile data from localStorage
      const profileData = localStorage.getItem('profile');
      if (profileData) {
        const profile = JSON.parse(profileData); // Parse JSON object

        // Ensure that userName is properly formatted
        this.userName = profile.userName ? profile.userName.trim() : 'N/A';
        this.userEmailId = profile.userEmailId || 'N/A';
        this.organisation = profile.organisation || 'N/A';
      }

      console.log('User Details:', { userName: this.userName, userEmail: this.userEmailId, organisation: this.organisation });
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
        return value; // If not JSON, return as is
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

  // toggleProfile() {
  //   this.isProfileOpen = !this.isProfileOpen;
  //   this.isNotifyOpen = false; // Close notifications when opening the profile
  //   this.updateToggleStates();
  // }

  // toggleNotifications() {
  //   this.isNotifyOpen = !this.isNotifyOpen;
  //   this.isProfileOpen = false; // Close profile when opening notifications
  //   this.updateToggleStates();
  // }

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
      // this.subNotifyWrap?.nativeElement.contains(clickedElement) ||
      // clickedElement.closest('.user-profile') ||
      // clickedElement.closest('.notifications')
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
    // if (this.subNotifyWrap?.nativeElement) {
    //   this.subNotifyWrap.nativeElement.classList.toggle('open-notify', this.isNotifyOpen);
    // }
  }

  logout() {
    localStorage.clear();
    // window.location.href = APIConstant.Ums + `/login`;
    this.router.navigate(['/home']);
  }
}