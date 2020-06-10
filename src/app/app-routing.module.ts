import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientComponent } from './patient-form/patient.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './service/auth.guard';

const routes: Routes = [

  {
    path: 'list',
    component: PatientListComponent,
    canActivate: [AuthenticationGuard],
    canLoad: [AuthenticationGuard],
  },
  {
    path: 'patient',
    component: PatientComponent,
    canActivate: [AuthenticationGuard],
    canLoad: [AuthenticationGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: '**', redirectTo: '/list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
