export interface Budget {
  id?: string;
  client: string;
  date: Date;
  modules: Module[]
  /* TODO
     Add collection to hold data about:
        - zone
        - moduleType reference that has information about (slots, price, type)
  */
}

export enum Zone {
  LIVING = 'Living',
  COMEDOR = 'Comedor',
  KITCHEN = 'Cocina',
  ROOM = 'Dormitorio'
}

export interface ModuleType {
  id: number;
  name: string;
  slots: number;
  price: number;
}

export interface Module {
  type: number;  // ID del tipo de módulo
  zone: string;  // Zona (ambiente)
  slots: number; // Espacios que ocupa
  price: number; // Precio del módulo
  moduleType: ModuleType; // Tipo de módulo
}
