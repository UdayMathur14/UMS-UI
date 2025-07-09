import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule],
  exports: [LoaderComponent]
})
export class SharedModule { }