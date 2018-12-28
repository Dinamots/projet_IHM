import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SecretaryComponent} from './secretary/secretary.component';
import {HttpClientModule} from '@angular/common/http';
import {InfirmierComponent} from './infirmier/infirmier.component';
import {PatientComponent} from './patient/patient.component';
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
import {DialogAddPatientComponent} from './dialog-add-patient/dialog-add-patient.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    SecretaryComponent,
    InfirmierComponent,
    PatientComponent,
    InfirmiersListComponent,
    PatientsListComponent,
    DialogAddPatientComponent,
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
    MatNativeDateModule

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [DialogAddPatientComponent]


})
export class AppModule {
}
