import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { Budget, Zone } from '../models/budget';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css',
})
export class BudgetListComponent implements OnInit {

  budgets: Budget[] = [];
  loading = true;
  summaries: any[] = [];

  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe(
      (budgets) => {
        console.log(budgets);
        this.budgets = budgets;
        this.summaries = budgets.map(budget => this.calculateSummary(budget));
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching budgets:', error);
        this.loading = false;
      }
    );
  }

  get objectKeys() {
    return Object.keys(Zone) as Array<keyof typeof Zone>;
  }

  calculateSummary(budget: Budget) {
    return this.budgetService.calculateBudget(budget);
  }

  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/components/lifecycle#
    - https://angular.dev/guide/http/making-requests#http-observables
    - https://angular.dev/guide/http/setup#providing-httpclient-through-dependency-injection
    - https://angular.dev/guide/http/making-requests#setting-request-headers
    - https://angular.dev/guide/http/making-requests#handling-request-failure
    - https://angular.dev/guide/http/making-requests#best-practices (async pipe)
    - https://angular.dev/guide/testing/components-scenarios#example-17 (async pipe)
  */
}
