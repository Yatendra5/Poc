import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'bajaj-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected currentYear = new Date().getFullYear();

  protected footerSections = [
    {
      title: 'Get to Know Us',
      links: ['About Us', 'Careers', 'Press Releases', 'Blog', 'Sustainability']
    },
    {
      title: 'Make Money with Us',
      links: ['Sell on Bajaj', 'Become an Affiliate', 'Advertise Your Products', 'Become a Delivery Partner']
    },
    {
      title: 'Bajaj Payment Products',
      links: ['Bajaj Business Card', 'Bajaj Store Card', 'Bajaj Rewards Visa Card', 'Bajaj Gift Cards']
    },
    {
      title: 'Let Us Help You',
      links: ['Your Account', 'Your Orders', 'Shipping Rates & Policies', 'Returns & Replacements', 'Help Center']
    }
  ];
}
