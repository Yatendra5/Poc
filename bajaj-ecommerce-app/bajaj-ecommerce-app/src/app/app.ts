import { Component, signal, inject } from '@angular/core';
import { NavBar } from './shared/components/nav-bar/nav-bar';
import { SideNav } from './shared/components/side-nav/side-nav';
import { Footer } from './shared/components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { SideNavService } from './shared/services/side-nav.service';

@Component({
  selector: 'bajaj-root',
  imports: [NavBar, SideNav, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bajaj-ecommerce-app');
  protected sideNavService = inject(SideNavService);
}
