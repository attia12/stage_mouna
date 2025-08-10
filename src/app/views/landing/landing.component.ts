import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [NgFor]
})
export class LandingComponent implements OnInit {
  currentYear = new Date().getFullYear();
  layouts = [
    {
      name: 'Sidebar Large',
      description: 'Clean two-column sidebar layout with big icons',
      image: 'assets/images/screenshots/04_preview.png',
      route: '/applayout-sidebar-large/dashboard/v1'
    },
    {
      name: 'Sidebar Compact',
      description: 'Clean two-column sidebar layout with smaller icons',
      image: 'assets/images/screenshots/02_preview.png',
      route: '/applayout-sidebar-compact/dashboard/v1'
    },
    {
      name: 'Sidebar Plain',
      description: 'Clean one-column layout',
      image: 'assets/images/screenshots/applayout-sidebar-plain.png',
      route: '/applayout-sidebar-plain/dashboard/v1'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() { }

  navigateToLayout(route: string) {
    this.router.navigate([route]);
  }
}
