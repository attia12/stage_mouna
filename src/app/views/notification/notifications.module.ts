import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NotificationListComponent} from "./notification-list/notification-list.component";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {NotificationCreateComponent} from "./notification-create/notification-create.component";

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NotificationsRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  declarations: [NotificationListComponent,NotificationCreateComponent]
})
export class NotificationsModule { }
