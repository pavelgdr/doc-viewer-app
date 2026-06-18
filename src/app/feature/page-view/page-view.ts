import { Component, ElementRef, inject, input, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { PageModel } from '../../api/document-api.interfaces';
import { ViewerService } from '../viewer.service';
import { FormsModule } from '@angular/forms';
import { Annotation, AnnotationType } from '../interfaces';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.html',
  styleUrl: './page-view.scss',
  host: {
    '(mousedown)': 'startAddAnnotation($event)',
  },
  imports: [FormsModule],
})
export class PageView implements OnInit {
  private viewerService = inject(ViewerService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  public page = input.required<PageModel>();

  protected annotations?: WritableSignal<Annotation[]>;

  private naturalWidth = 0;
  private naturalHeight = 0;

  ngOnInit(): void {
    this.annotations = this.viewerService.annotationsByPage.get(this.page().number);
  }

  protected onPageLoaded(img: HTMLImageElement): void {
    this.naturalWidth = img.naturalWidth;
    this.naturalHeight = img.naturalHeight;
    this.viewerService.setMaxNativeWidth(img.naturalWidth);
  }

  protected startAddAnnotation(downEvent: MouseEvent): void {
    const hostEl = this.elementRef.nativeElement as HTMLElement;

    if (downEvent.target !== hostEl) return;

    downEvent.preventDefault();

    const bounds = hostEl.getBoundingClientRect();
    const relativeX = ((downEvent.clientX - bounds.left) * 100) / bounds.width;
    const relativeY = ((downEvent.clientY - bounds.top) * 100) / bounds.height;
    const annotation = this.makeAnnotation('text', relativeX, relativeY);

    this.annotations?.update((annotations) => [...annotations, annotation]);

    const unsubscribeMouseMove = this.renderer.listen(
      'document',
      'mousemove',
      (moveEvent: MouseEvent) => {
        const relativeWidth = ((moveEvent.clientX - bounds.left) * 100) / bounds.width - relativeX;
        const relativeHeight = ((moveEvent.clientY - bounds.top) * 100) / bounds.height - relativeY;

        annotation.relativeWidth.set(relativeWidth);
        annotation.relativeHeight.set(relativeHeight);
        annotation.naturalWidth = (this.naturalWidth * relativeWidth) / 100;
        annotation.naturalHeight = (this.naturalHeight * relativeHeight) / 100;
      },
    );

    const unsubscribeMouseUp = this.renderer.listen('document', 'mouseup', () => {
      unsubscribeMouseMove();
      unsubscribeMouseUp();
    });
  }

  protected startMoveAnnotation(downEvent: MouseEvent, annotation: Annotation): void {
    const hostEl = this.elementRef.nativeElement as HTMLElement;
    const bounds = hostEl.getBoundingClientRect();

    const unsubscribeMouseMove = this.renderer.listen(
      'document',
      'mousemove',
      (moveEvent: MouseEvent) => {
        const relativeX =
          ((moveEvent.clientX - bounds.left - downEvent.offsetX) * 100) / bounds.width;
        const relativeY =
          ((moveEvent.clientY - bounds.top - downEvent.offsetY) * 100) / bounds.height;

        annotation.relativeX.set(relativeX);
        annotation.relativeY.set(relativeY);
        annotation.naturalX = (this.naturalWidth * relativeX) / 100;
        annotation.naturalY = (this.naturalHeight * relativeY) / 100;
      },
    );

    const unsubscribeMouseUp = this.renderer.listen('document', 'mouseup', () => {
      unsubscribeMouseMove();
      unsubscribeMouseUp();
    });
  }

  protected deleteNote(idx: number): void {
    const annotations = this.annotations?.();
    if (!annotations) return;
    annotations.splice(idx, 1);
    this.annotations?.set(annotations);
  }

  private makeAnnotation(type: AnnotationType, relativeX: number, relativeY: number): Annotation {
    return {
      id: Date.now(),
      type,
      relativeX: signal(relativeX),
      relativeY: signal(relativeY),
      relativeWidth: signal(0),
      relativeHeight: signal(0),
      naturalX: (this.naturalWidth * relativeX) / 100,
      naturalY: (this.naturalHeight * relativeY) / 100,
      naturalWidth: 0,
      naturalHeight: 0,
      value: signal(''),
    };
  }
}
