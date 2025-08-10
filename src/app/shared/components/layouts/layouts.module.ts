import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { AdminLayoutSidebarLargeComponent } from './admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { HeaderSidebarLargeComponent } from './admin-layout-sidebar-large/header-sidebar-large/header-sidebar-large.component';

import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { SearchModule } from '../search/search.module';
import { SidebarLargeComponent } from './admin-layout-sidebar-large/sidebar-large/sidebar-large.component';
import { FooterComponent } from '../footer/footer.component';
import { CustomizerComponent } from '../customizer/customizer.component';
import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { FormsModule } from '@angular/forms';
import {SharedModule} from "../../shared.module";
import {NotificationBellComponent} from "../../notification-bell/notification-bell.component";

// Regular components for declaration
const components = [
    HeaderSidebarLargeComponent,
    SidebarLargeComponent,
    // SidebarPlainComponent, // Standalone component, removed from declarations
    FooterComponent,
    CustomizerComponent,
    AdminLayoutSidebarLargeComponent,
    AuthLayoutComponent,
    BlankLayoutComponent,
    NotificationBellComponent,
];


@NgModule({
    imports: [
        NgbModule,
        RouterModule,
        FormsModule,
        SearchModule,
        SharedPipesModule,
        SharedDirectivesModule,
        NgScrollbarModule,
        CommonModule,

        // Import standalone components
    ],
  declarations: components,
  exports: [...components]
})
export class LayoutsModule { }
