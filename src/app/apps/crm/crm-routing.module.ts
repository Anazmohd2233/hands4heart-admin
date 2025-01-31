import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRMDashboardComponent } from './dashboard/dashboard.component';
import { CRMManagementComponent } from './management/management.component';
import { CRMOrderListComponent } from './order-list/order-list.component';
import { CRMProjectComponent } from './project/project.component';
import { CRMClientsComponent } from './courses/clients.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: CRMDashboardComponent
  },
  {
    path: 'order-list',
    component: CRMOrderListComponent
  },
  {
    path: 'courses',
    component: CRMClientsComponent
  },
  {
    path: 'quiz',
    component: QuizComponent
  },
  {
    path: 'project',
    component: CRMProjectComponent
  },
  {
    path: 'management',
    component: CRMManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
