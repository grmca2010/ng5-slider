import { ElementRef, Renderer2 } from '@angular/core';

/**
 * Wrapper to support legacy jqLite interface
 *
 * The aim is to slowly phase out the usage of this wrapper and replace
 * any manual DOM manipulations with Angular bindings
 */
export class JqLiteWrapper {
  private eventListeners: { [eventName: string]: [() => void] } = {};

  constructor(private elemRef: ElementRef, private renderer: Renderer2) {
  }

  addClass(clazz: string): void {
    this.renderer.addClass(this.elemRef.nativeElement, clazz);
  }

  removeClass(clazz: string): void {
    this.renderer.removeClass(this.elemRef.nativeElement, clazz);
  }

  hasClass(clazz: string): boolean {
    return this.elemRef.nativeElement.classList.contains(clazz);
  }

  html(html: string): void {
    this.elemRef.nativeElement.innerHTML = html;
  }

  css(style: string, value: string): void {
    if (value !== '') {
      this.renderer.setStyle(this.elemRef.nativeElement, style, value);
    } else {
      this.renderer.removeStyle(this.elemRef.nativeElement, style);
    }
  }

  attr(attr: string, value: string): void {
    if (value !== null) {
      this.renderer.setAttribute(this.elemRef.nativeElement, attr, value);
    } else {
      this.renderer.removeAttribute(this.elemRef.nativeElement, attr);
    }
  }

  getBoundingClientRect(): ClientRect {
    return this.elemRef.nativeElement.getBoundingClientRect();
  }

  focus(): void {
    this.elemRef.nativeElement.focus();
  }

  on(eventName: string, callback: (event: any) => boolean|void): void {
    if (!this.eventListeners.hasOwnProperty(eventName)) {
      this.eventListeners[eventName] = <[() => void]>[];
    }

    const unsubscribe: () => void = this.renderer.listen(this.elemRef.nativeElement, eventName, callback);
    this.eventListeners[eventName].push(unsubscribe);
  }

  off(eventName?: string): void {
    if (eventName) {
      if (this.eventListeners.hasOwnProperty(eventName)) {
        for (const unsubscribe of this.eventListeners[eventName]) {
          unsubscribe();
        }
        delete this.eventListeners[eventName];
      }
    } else {
      for (const eName of Object.keys(this.eventListeners)) {
        this.off(eName);
      }
    }
  }
}
