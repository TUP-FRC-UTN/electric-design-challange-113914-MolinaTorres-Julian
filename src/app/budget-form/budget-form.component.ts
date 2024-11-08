import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModuleType, Zone } from '../models/budget';
import { HttpClient } from '@angular/common/http';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit {

  budgetForm!: FormGroup;
  moduleTypes: ModuleType[] = [];
  zoneEnum = Zone;

  constructor(private fb: FormBuilder, private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.budgetForm = this.fb.group({
      date: ['', [Validators.required, this.dateValidator]],
      client: ['', Validators.required],
      modules: this.fb.array([], Validators.minLength(5))
    });

    this.loadModuleTypes();
    this.addModule();
  }

  get modules(): FormArray {
    return this.budgetForm.get('modules') as FormArray;
  }

  get objectKeys() {
    return Object.keys(this.zoneEnum) as Array<keyof typeof Zone>; // Esto asegura que las claves son del tipo Zone
  }

  loadModuleTypes(): void {
    this.budgetService.getModuleTypes().subscribe((data) => {
      this.moduleTypes = data;
    });
  }

  addModule(): void {
    const moduleGroup = this.fb.group({
      type: ['', Validators.required],
      zone: ['', Validators.required],
      slots: [{ value: '', disabled: true }],
      price: [{ value: '', disabled: true }]
    });
    this.modules.push(moduleGroup);
  }

  removeModule(index: number): void {
    this.modules.removeAt(index);
  }

  onModuleChange(index: number): void {
    const selectedModuleId = this.modules.at(index).get('type')?.value;
    const selectedModule = this.moduleTypes.find((mod) => mod.id === selectedModuleId);

    if (selectedModule) {
      this.modules.at(index).get('slots')?.setValue(selectedModule.slots);
      this.modules.at(index).get('price')?.setValue(selectedModule.price);
      // Asigna la referencia completa del módulo
      this.modules.at(index).get('moduleType')?.setValue(selectedModule);
    }
  }

  dateValidator(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate > today ? { futureDate: true } : null;
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      const budgetData = this.budgetForm.value;

      // Calcular el presupuesto antes de enviarlo
      const calculatedBudget = this.budgetService.calculateBudget(budgetData);

      // Agregar los valores calculados al presupuesto
      const budgetWithSummary = {
        ...budgetData,
        ...calculatedBudget
      };

      // Ahora, guardar el presupuesto calculado
      this.budgetService.saveBudget(budgetWithSummary).subscribe(
        (response) => {
          console.log('Presupuesto guardado con éxito:', response);
        },
        (error) => {
          console.error('Error al guardar el presupuesto:', error);
        }
      );
    }
  }

  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/forms/typed-forms#formarray-dynamic-homogenous-collections
    - https://dev.to/chintanonweb/angular-reactive-forms-mastering-dynamic-form-validation-and-user-interaction-32pe
  */
}
