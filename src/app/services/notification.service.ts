import { Injectable } from '@angular/core';

import {
  Notification,
  CreateNotificationDTO,
  NotificationFilter,
  NotificationStats,
  PagedResponse,
  Priority
} from "../models/notification.model";
import {tap} from "rxjs/operators";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {WebsocketService} from "./websocket.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/api/v1/notifications';

  // Subjects for real-time updates
  private notificationSubject = new Subject<Notification>();
  private statsSubject = new BehaviorSubject<NotificationStats>({
    totalNotifications: 0,
    unreadCount: 0,
    readCount: 0,
    urgentUnreadCount: 0
  });

  public notification$ = this.notificationSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();

  constructor(
      private http: HttpClient,
      private webSocketService: WebsocketService,
      private toastr: ToastrService
  ) {}

  /**
   * Initialize WebSocket connection and subscriptions
   */
  initializeWebSocket(userId: string, token: string): void {
    this.webSocketService.connect(token).subscribe(connected => {
      if (connected) {
        // Subscribe to user's notifications
        this.webSocketService.subscribe(
            `/topic/notifications/${userId}`,
            (notification: Notification) => {
              this.handleNewNotification(notification);
            }
        );

        // Subscribe to notification stats updates
        this.webSocketService.subscribe(
            `/topic/notification-stats/${userId}`,
            (stats: NotificationStats) => {
              this.statsSubject.next(stats);
            }
        );

        console.log('WebSocket subscriptions initialized');
      }
    });
  }

  /**
   * Handle new notification received via WebSocket
   */
  private handleNewNotification(notification: Notification): void {
    // Emit to subscribers
    this.notificationSubject.next(notification);

    // Show toast notification
    this.showToastNotification(notification);

    // Update stats
    this.loadNotificationStats().subscribe();

    // Play notification sound (optional)
    this.playNotificationSound();
  }

  /**
   * Show toast notification based on priority
   */
  private showToastNotification(notification: Notification): void {
    const title = `New ${notification.type}`;
    const message = notification.message;
    const options = {
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      enableHtml: true
    };

    switch (notification.priority) {
      case Priority.URGENT:
        this.toastr.error(message, title, { ...options, timeOut: 0 }); // No auto-dismiss for urgent
        break;
      case Priority.NORMAL:
        this.toastr.warning(message, title, options);
        break;
      case Priority.LOW:
        this.toastr.info(message, title, options);
        break;
      default:
        this.toastr.info(message, title, options);
    }
  }

  /**
   * Play notification sound
   */
  private playNotificationSound(): void {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(e => console.log('Could not play notification sound:', e));
  }

  /**
   * Create a new notification
   */
  createNotification(notification: CreateNotificationDTO): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  /**
   * Get user notifications with filters
   */
  getNotifications(filter?: NotificationFilter): Observable<PagedResponse<Notification>> {
    let params = new HttpParams();

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<PagedResponse<Notification>>(this.apiUrl, { params });
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${notificationId}/read`, {})
        .pipe(
            tap(() => this.loadNotificationStats().subscribe())
        );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {})
        .pipe(
            tap(() => this.loadNotificationStats().subscribe())
        );
  }

  /**
   * Load notification statistics
   */
  loadNotificationStats(): Observable<NotificationStats> {
    return this.http.get<NotificationStats>(`${this.apiUrl}/stats`)
        .pipe(
            tap(stats => this.statsSubject.next(stats))
        );
  }

  /**
   * Get current stats value
   */
  getCurrentStats(): NotificationStats {
    return this.statsSubject.value;
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    this.webSocketService.disconnect();
  }
  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.webSocketService.isConnected();
  }
}
