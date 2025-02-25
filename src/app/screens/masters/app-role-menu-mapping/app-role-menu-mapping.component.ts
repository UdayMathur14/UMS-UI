import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
interface MenuData {
  applicationName: string;
  menuName: string;
  rollName: string;
  status: string;
}

interface SubmenuItem {
  name: string;
  parentMenu: string;
  selectedPermissions: any[];
  status: string;
}

@Component({
  selector: 'app-app-role-menu-mapping',
  templateUrl: './app-role-menu-mapping.component.html',
  styleUrl: './app-role-menu-mapping.component.scss',
})
export class AppRoleMenuMappingComponent implements OnInit {
  menuData: MenuData = {
    applicationName: '',
    menuName: '',
    rollName: '',
    status: '',
  };

  submenuItems: SubmenuItem[] = [];
  showSubmenuSection: boolean = false;

  // Multiselect dropdown settings
  dropdownSettings: IDropdownSettings = {};
  submenuDropdownSettings: IDropdownSettings = {};

  // Sample permissions list
  permissionsList: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Initialize permissions list
    this.permissionsList = [
      { item_id: 1, item_text: 'View' },
      { item_id: 2, item_text: 'Edit' },
      { item_id: 3, item_text: 'Create' },
      { item_id: 4, item_text: 'Delete' },
      { item_id: 5, item_text: 'Admin' },
    ];

    // Configure main dropdown settings
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    // Configure submenu dropdown settings (more compact)
    this.submenuDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };
  }

  onSave(): void {
    // This will be implemented later with API integration
    console.log('Save clicked', this.menuData, this.submenuItems);
  }

  onAddSubmenu(): void {
    // Check if all required fields are filled
    if (this.isMenuFormValid()) {
      this.showSubmenuSection = true;

      // Add an empty submenu item if there are none
      if (this.submenuItems.length === 0) {
        this.addEmptySubmenu();
      }
    } else {
      // Show validation message (to be implemented)
      console.log('Please fill all menu details first');
      // You could add an alert or toast notification here
    }
  }

  onCancel(): void {
    // Reset form or navigate away
    console.log('Cancel clicked');
  }

  deleteSubmenu(index: number): void {
    this.submenuItems.splice(index, 1);
  }

  onAddSubSubMenu(): void {
    // To be implemented later
    console.log('Add Sub Sub Menu clicked');
  }

  isMenuFormValid(): boolean {
    // Check if all required fields in the menu form are filled
    return !!(
      this.menuData.applicationName &&
      this.menuData.menuName &&
      this.menuData.rollName &&
      this.menuData.status
    );
  }

  addEmptySubmenu(): void {
    this.submenuItems.push({
      name: '',
      parentMenu: this.menuData.menuName,
      selectedPermissions: [],
      status: '',
    });
  }
}
