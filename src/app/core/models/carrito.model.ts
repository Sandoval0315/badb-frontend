export interface CarritoItem {
  id: number;
  productoId: number;
  productoNombre: string;
  imagenUrl: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}