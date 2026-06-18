import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DocumentModel } from './document-api.interfaces';

@Service()
export class DocumentApiService {
  private http = inject(HttpClient);

  getDocument(id: number): Observable<DocumentModel> {
    return this.http.get<DocumentModel>(`/mocks/api/${id}.json`).pipe(
      map((doc) => ({
        ...doc,
        pages: doc.pages.map((page) => ({
          ...page,
          imageUrl: `/mocks/documents/${id}/${page.imageUrl}`,
        })),
      })),
    );
  }
}
