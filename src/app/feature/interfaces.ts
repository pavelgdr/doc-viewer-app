import { WritableSignal } from '@angular/core';

export type AnnotationType = 'highlight' | 'text' | 'image';

export interface Annotation {
  id: number;
  type: AnnotationType;
  relativeX: WritableSignal<number>;
  relativeY: WritableSignal<number>;
  relativeWidth: WritableSignal<number>;
  relativeHeight: WritableSignal<number>;
  naturalX: number;
  naturalY: number;
  naturalWidth: number;
  naturalHeight: number;
  value: WritableSignal<unknown>;
}
