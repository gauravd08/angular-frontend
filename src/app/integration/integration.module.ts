import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationRoutingModule } from './integration-routing.module';
import { GithubComponent } from './github/github.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // If applicable (it doesn't exist as a module, so you can use mat-card for panel-like effects)
import { MatExpansionModule } from '@angular/material/expansion';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise'; // Add this line to import ag-Grid Enterprise features

import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey(
  "ag-Grid_Evaluation_License_Not_for_Production_100Devs30_August_2037__MjU4ODczMzg3NzkyMg==9e93ed5f03b0620b142770f2594a23a2"
);


@NgModule({
  declarations: [
    GithubComponent
  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    AgGridModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class IntegrationModule { }
