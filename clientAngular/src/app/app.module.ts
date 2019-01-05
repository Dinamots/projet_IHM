import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SecretaryComponent} from './secretary/secretary.component';
import {HttpClientModule} from '@angular/common/http';
import {InfirmierComponent} from './infirmiers-list/infirmier/infirmier.component';
import {PatientComponent} from './patients-list/patient/patient.component';
import {InfirmiersListComponent} from './infirmiers-list/infirmiers-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCheckboxModule, MatDialogModule,
  MatFormFieldModule, MatDatepickerModule,
  MatGridListModule, MatIconModule, MatInputModule,
  MatListModule, MatSelectModule, MatToolbarModule, MatNativeDateModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PatientsListComponent} from './patients-list/patients-list.component';
import {DialogPatientComponent} from './patients-list/patient/dialog-patient/dialog-patient.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {DialogComponent} from './dialog/dialog.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthModule} from './auth/auth.module';
import {Router} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    SecretaryComponent,
    InfirmierComponent,
    PatientComponent,
    InfirmiersListComponent,
    PatientsListComponent,
    DialogPatientComponent,
    DialogComponent,
    PageNotFoundComponent,
  ],
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatBadgeModule,
    MatFormFieldModule,
    DragDropModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    MatButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AuthModule,
    AppRoutingModule

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [DialogPatientComponent, DialogComponent]


})
export class AppModule {
  constructor(router: Router) {
    // Use a custom replacer to display function names in the route configs
    // const replacer = (key, value) => (typeof value === 'function') ? value.name : value;

    // console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }
}
