import { Component, input, numberAttribute } from '@angular/core';
import { DocViewer } from '../../feature/doc-viewer/doc-viewer';

@Component({
  selector: 'app-doc-viewer-shell',
  imports: [DocViewer],
  templateUrl: './doc-viewer-shell.html',
  styleUrl: './doc-viewer-shell.scss',
})
export class DocViewerShell {
  documentId = input.required({ transform: numberAttribute });
}
