export interface DocumentModel {
  name: string;
  pages: PageModel[]
}

export interface PageModel {
  number: number;
  imageUrl: string;
}

export interface AnnotationModel {
  id: number;
  height: number;
  width: number;
  x: number;
  y: number;
  type: string;
  value: unknown
}
