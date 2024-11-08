import { Routes } from '@angular/router';
import { BudgetFormComponent } from './budget-form/budget-form.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetViewComponent } from './budget-view/budget-view.component';

export const routes: Routes = [
    { path: 'budget-form', component: BudgetFormComponent },
    { path: 'budget-list', component: BudgetListComponent },
    { path: 'budget-view', component: BudgetViewComponent }
];
