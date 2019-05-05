import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
  { path: 'legal', loadChildren: './legal/legal.module#LegalPageModule' },
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternRoutingModule { }
