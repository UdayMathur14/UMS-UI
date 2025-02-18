import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('subProfileWrap', { static: false }) subProfileWrap!: ElementRef;
  @ViewChild('subNotifyWrap', { static: false }) subNotifyWrap!: ElementRef;

  isProfileOpen = false;
  isNotifyOpen = false;
  isSidebarCollapsed = false;

  notifications: string[] = [
    'Ticket #12352 has been created. Our support team will get back to you soon.',
    'Ticket #12353 has been assigned to Priya Sharma for further investigation.',
    'Ticket #12354 status updated to "Under Review."',
    'Ticket #12355 requires additional information. Please check and respond.',
    'Ticket #12356 has been resolved. Let us know if you need further assistance.',
    'Ticket #12357 has been escalated to the technical team for urgent review.',
    'Ticket #12358 has been closed. We appreciate your patience!',
    'Ticket #12359 has been marked as "Pending Customer Response."',
    'Ticket #12360 has been reopened for further troubleshooting.',
    'Ticket #12361 has been updated with the latest resolution steps. Please review and confirm.'
  ];

  greetingMessage: string = '';

  ngOnInit(): void {
    this.setGreetingMessage();
  }
  setGreetingMessage(): void {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      this.greetingMessage = 'Good Morning!';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.greetingMessage = 'Good Afternoon!';
    } else if (currentHour >= 17 && currentHour < 21) {
      this.greetingMessage = 'Good Evening!';
    } else {
      this.greetingMessage = 'Good Night!';
    }
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
    this.isNotifyOpen = false; // Close notifications when opening the profile
    this.updateToggleStates();
  }

  toggleNotifications() {
    this.isNotifyOpen = !this.isNotifyOpen;
    this.isProfileOpen = false; // Close profile when opening notifications
    this.updateToggleStates();
  }


  markAllAsRead() {
    this.notifications = [];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedElement = event.target as HTMLElement;

    if (
      this.subProfileWrap?.nativeElement.contains(clickedElement) ||
      this.subNotifyWrap?.nativeElement.contains(clickedElement) ||
      clickedElement.closest('.user-profile') ||
      clickedElement.closest('.notifications')
    ) {
      // Click is inside profile or notification dropdowns or triggers
      return;
    }

    // Close both if clicked outside
    this.isProfileOpen = false;
    this.isNotifyOpen = false;
    this.updateToggleStates();
  }

  private updateToggleStates() {
    if (this.subProfileWrap?.nativeElement) {
      this.subProfileWrap.nativeElement.classList.toggle('open-profile', this.isProfileOpen);
    }
    if (this.subNotifyWrap?.nativeElement) {
      this.subNotifyWrap.nativeElement.classList.toggle('open-notify', this.isNotifyOpen);
    }
  }

  // Add this method to receive sidebar state
  onSidebarToggle(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
