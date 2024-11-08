import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Budget, Module, ModuleType, Zone } from '../models/budget';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private apiUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  // Obtener tipos de módulos desde la API
  getModuleTypes(): Observable<ModuleType[]> {
    return this.http.get<ModuleType[]>(`${this.apiUrl}/module-types`);
  }

  // Guardar un presupuesto (POST a la API)
  saveBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/budgets`, budget);
  }

  // Obtener un presupuesto por ID
  getBudget(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/budgets/${id}`);
  }

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/budgets`);
  }

  calculateBudget(budgetData: any) {
    let totalCost = 0;
    const modulesByZone: { [key in Zone]: Module[] } = {
      [Zone.LIVING]: [],
      [Zone.COMEDOR]: [],
      [Zone.KITCHEN]: [],
      [Zone.ROOM]: []
    };
  
    // Recorrer los módulos y acumular los precios
    budgetData.modules.forEach((module: any) => {
      // Verificar que el módulo tenga price y slots
      if (module.price && module.slots) {
        totalCost += module.price; // Acumulamos el precio si están definidos
  
        // Organizamos los módulos por zona
        modulesByZone[module.zone as Zone].push(module);
      }
    });
  
    // Calcular el número total de slots
    let totalSlots = 0;
    budgetData.modules.forEach((module: any) => {
      if (module.slots) {
        totalSlots += module.slots;
      }
    });
  
    // Calcular las cajas necesarias (asumimos que cada caja tiene 3 slots)
    const totalBoxes = Math.ceil(totalSlots / 3);
  
    return {
      totalCost,
      totalBoxes,
      modulesByZone
    };
  }

}
