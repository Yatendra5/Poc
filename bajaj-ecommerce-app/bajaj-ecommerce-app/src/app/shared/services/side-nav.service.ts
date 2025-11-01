import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  isOpen = signal(false);

  toggleNav() {
    this.isOpen.update((val) => !val);
  }

  openNav() {
    this.isOpen.set(true);
  }

  closeNav() {
    this.isOpen.set(false);
  }
}