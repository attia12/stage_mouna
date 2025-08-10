
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationListComponent } from './notification-list/notification-list.component';
import {NotificationCreateComponent} from "./notification-create/notification-create.component";

const routes: Routes = [
    {
        path: '',
        component: NotificationListComponent
    },
    {
        path: 'create',
        component: NotificationCreateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationsRoutingModule {}
