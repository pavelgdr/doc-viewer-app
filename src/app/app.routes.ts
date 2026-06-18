import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'viewer',
    loadChildren: () => import('./shell/doc-viewer-shell/doc-viewer.routes').then((m) => m.routes),
  },
];
