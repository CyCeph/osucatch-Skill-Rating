import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfileComponent } from './components/profile/profile.component';
import {
  NavbarComponent
} from './components/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { SheetFetchService } from './service/sheet-fetch.service';
import { map, take } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [AppComponent, MainComponent, HomepageComponent, ProfileComponent, NavbarComponent,],
  imports: [MatSlideToggleModule, MatInputModule, FormsModule, BrowserModule, HttpClientModule, AppRoutingModule, NgxChartsModule, BrowserAnimationsModule, MatTableModule, MatSortModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule, ReactiveFormsModule, MatPaginatorModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (service: SheetFetchService) => {
        return () => {
          service.getData();
          return service.users$.subscribe();
        };
      },
      deps: [SheetFetchService],
      multi: true
    },],
  bootstrap: [AppComponent],
})
export class AppModule { }


