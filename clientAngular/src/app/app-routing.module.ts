import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SecretaryComponent} from './secretary/secretary.component';
import {AuthGuard} from './auth/auth.guard';
import {InfirmierComponent} from './infirmier/infirmier.component';

const appRoutes: Routes = [
  {path: 'secretary', component: SecretaryComponent, canActivate: [AuthGuard]},
  {path: 'infirmier', component: InfirmierComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
