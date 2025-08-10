import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service';
import { SearchService } from '../../../../services/search.service';


import {NotificationService} from "../../../../../services/notification.service";
import {AuthService} from "../../../../../services/auth.service";


@Component({
    selector: 'app-header-sidebar-large',
    templateUrl: './header-sidebar-large.component.html',
    styleUrls: ['./header-sidebar-large.component.scss'],
    standalone: false
})
export class HeaderSidebarLargeComponent implements OnInit, OnDestroy  {

    constructor(
        private navService: NavigationService,
        public searchService: SearchService,
        private auth: AuthService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // The WebSocket connection is already initialized in SigninComponent
        // No need to initialize it here again

        // Optional: You can check if the connection exists and reconnect if needed
        this.checkAndReconnectIfNeeded();
    }

    ngOnDestroy() {
        // Clean up notification connection when header is destroyed
        // This typically happens on logout or when navigating away from authenticated areas
        this.notificationService.disconnect();
    }

    private checkAndReconnectIfNeeded(): void {
        // Only reconnect if we have a valid user but no WebSocket connection
        const currentUser = this.auth.getCurrentUser();
        const token = this.auth.getToken();

        if (currentUser && currentUser.id && token && !this.notificationService.isConnected()) {
            console.log('Reconnecting WebSocket from header...');
            this.notificationService.initializeWebSocket(currentUser.id, token);
        }
    }
  
    toggelSidebar() {
      const state = this.navService.sidebarState;
      if (state.childnavOpen && state.sidenavOpen) {
        return state.childnavOpen = false;
      }
      if (!state.childnavOpen && state.sidenavOpen) {
        return state.sidenavOpen = false;
      }
      // item has child items
      if (!state.sidenavOpen && !state.childnavOpen 
        && this.navService.selectedItem.type === 'dropDown') {
          state.sidenavOpen = true;
          setTimeout(() => {
              state.childnavOpen = true;
          }, 50);
      }
      // item has no child items
      if (!state.sidenavOpen && !state.childnavOpen) {
        state.sidenavOpen = true;
      }
    }
  
    signout() {
      this.auth.signout();
    }

}
