import {Component, Input, OnInit} from '@angular/core';
import {NotificationType, Priority} from "../../../models/notification.model";

@Component({
  selector: 'app-system-notification',

  templateUrl: './system-notification.component.html',
  styleUrls: ['./system-notification.component.scss'],
  standalone: false
})
export class SystemNotificationComponent implements OnInit {
  @Input() notification!: any;

  iconClass: string = '';
  systemSource: string = '';

  ngOnInit() {
    this.determineSystemSource();
    this.setIconClass();
  }

  determineSystemSource(): void {
    // Determine the system source based on message patterns
    const message = this.notification.message.toLowerCase();

    if (message.includes('panne') || message.includes('machine')) {
      this.systemSource = 'Machine Monitoring System';
    } else if (message.includes('maintenance')) {
      this.systemSource = 'Maintenance Scheduler';
    } else if (message.includes('production')) {
      this.systemSource = 'Production Monitor';
    } else if (message.includes('tâche') || message.includes('task')) {
      this.systemSource = 'Task Management System';
    } else if (message.includes('shift') || message.includes('équipe')) {
      this.systemSource = 'Shift Manager';
    } else {
      this.systemSource = 'Automated System';
    }
  }

  setIconClass(): void {
    if (this.notification.priority === Priority.URGENT) {
      this.iconClass = 'i-Warning-2 text-danger pulse-animation';
    } else if (this.notification.type === NotificationType.ALERT) {
      this.iconClass = 'i-Bell-2 text-warning';
    } else if (this.notification.type === NotificationType.TASK) {
      this.iconClass = 'i-Calendar-4 text-info';
    } else {
      this.iconClass = 'i-Information text-primary';
    }
  }

  getSystemBadgeClass(): string {
    if (this.notification.priority === Priority.URGENT) {
      return 'badge-danger';
    }
    return 'badge-info';
  }


  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case Priority.URGENT:
        return 'badge-danger';
      case Priority.NORMAL:
        return 'badge-warning';
      case Priority.LOW:
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  }
}
