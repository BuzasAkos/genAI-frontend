import { Directive } from '@angular/core';
import { Input, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {

  @Input('appTooltip') tooltipText: string = '';
  tooltipElement!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    // console.log('Mouse enter:', this.tooltipText);
    if (!this.tooltipText) return;

    this.tooltipElement = this.renderer.createElement('span');
    this.tooltipElement.innerText = this.tooltipText;
    this.renderer.appendChild(document.body, this.tooltipElement);

    this.renderer.addClass(this.tooltipElement, 'tooltip-container');

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement.getBoundingClientRect();

    const top = hostPos.top - tooltipPos.height;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
    }
  }

}
