import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const AUTOPLAY_INTERVAL = 5000;

@Component({
  selector: 'bajaj-slider',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './slider.html',
  styleUrls: ['./slider.css'],
})
export class Slider implements OnDestroy {
  private readonly basePath = '/images';

  protected readonly slides = [
    `${this.basePath}/slider1.jpg`,
    `${this.basePath}/slider2.jpg`,
    `${this.basePath}/slider3.png`,
  ];

  protected readonly activeIndex = signal(0);

  private readonly slideCount = this.slides.length;
  private readonly timer = setInterval(() => this.goToNext(), AUTOPLAY_INTERVAL);

  protected goToSlide(index: number) {
    const normalized = ((index % this.slideCount) + this.slideCount) % this.slideCount;
    this.activeIndex.set(normalized);
  }

  protected goToNext() {
    this.goToSlide(this.activeIndex() + 1);
  }

  protected goToPrevious() {
    this.goToSlide(this.activeIndex() - 1);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
