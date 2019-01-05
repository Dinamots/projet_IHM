import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SecretaryComponent} from './secretary/secretary.component';
import {AuthGuard} from './auth/auth.guard';
import {InfirmierComponent} from './infirmiers-list/infirmier/infirmier.component';
import {InfirmierService} from './infirmiers-list/infirmier/infirmier.service';

const appRoutes: Routes = [
  {path: 'secretary', component: SecretaryComponent, canActivate: [AuthGuard]},
  {
    path: 'infirmier',
    component: InfirmierComponent,
    canActivate: [AuthGuard],
    resolve: {infirmier: InfirmierService}
  },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false}
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
