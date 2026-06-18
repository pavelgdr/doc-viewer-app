import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { PageView } from '../page-view/page-view';
import { ViewerService } from '../viewer.service';

@Component({
  selector: 'app-doc-viewer',
  imports: [PageView, DecimalPipe],
  templateUrl: './doc-viewer.html',
  styleUrl: './doc-viewer.scss',
  providers: [ViewerService],
})
export class DocViewer {
  private viewerService = inject(ViewerService);
  private destroyRef = inject(DestroyRef);

  documentId = input.required<number>();

  document = this.viewerService.document;
  scale = this.viewerService.scale;
  scaledWidth = this.viewerService.scaledWidth;

  scaledWidthPx = computed(() => {
    const scaledSize = this.scaledWidth();
    return scaledSize !== null ? `${scaledSize}px` : null;
  });

  constructor() {
    this.initDataLoader();
  }

  private initDataLoader(): void {
    toObservable(this.documentId)
      .pipe(
        switchMap((docId) => this.viewerService.loadDocument(docId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected zoomIn = () => this.viewerService.zoomIn();
  protected zoomOut = () => this.viewerService.zoomOut();
  protected saveAnnotations = () => this.viewerService.saveAnnotations();
}
