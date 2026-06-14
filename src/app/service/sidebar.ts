import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Sidebar {
  private sidebarState = new BehaviorSubject<boolean>(false);

  sidebar$ = this.sidebarState.asObservable();

  toggleSidebar() {
    this.sidebarState.next(!this.sidebarState.value);
  }
    closeSidebar() {
    this.sidebarState.next(false);
  }
}
