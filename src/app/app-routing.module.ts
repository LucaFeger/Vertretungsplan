import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'intern/dashboard', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/public/login/login.module#LoginPageModule' },
  { path: 'intern', loadChildren: './pages/intern/intern-routing.module#InternRoutingModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
