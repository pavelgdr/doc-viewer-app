import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':documentId',
    loadComponent: () => import('./doc-viewer-shell').then((m) => m.DocViewerShell),
  },
];
