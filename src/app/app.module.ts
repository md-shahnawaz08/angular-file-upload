import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ProgressBarModule } from "angular-progress-bar"

import { AppComponent } from './app.component';
import { DragNDropComponent } from './drag-n-drop/drag-n-drop.component';

@NgModule({
  declarations: [
    AppComponent,
    DragNDropComponent
  ],
  imports: [
    BrowserModule,
    NgxDropzoneModule,
    ProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
