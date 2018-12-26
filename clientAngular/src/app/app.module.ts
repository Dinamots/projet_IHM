import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SecretaryComponent} from './secretary/secretary.component';
import {HttpClientModule} from '@angular/common/http';
import {InfirmierComponent} from './infirmier/infirmier.component';
import {PatientComponent} from './patient/patient.component';
import {InfirmiersListComponent} from './infirmiers-list/infirmiers-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatBadgeModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatGridListModule, MatListModule} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PatientsListComponent} from './patients-list/patients-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SecretaryComponent,
    InfirmierComponent,
    PatientComponent,
    InfirmiersListComponent,
    PatientsListComponent,
  ],
  imports: [
    MatBadgeModule,
    MatFormFieldModule,
    DragDropModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    MatButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
