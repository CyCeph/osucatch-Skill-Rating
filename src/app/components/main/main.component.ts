import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { SheetFetchService } from 'src/app/service/sheet-fetch.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})

export class MainComponent implements OnInit, AfterViewInit {

  constructor(private fetch: SheetFetchService, private http: HttpClient) {
  }

  @ViewChild(MatSort) sort: MatSort;

  filteredOptions: Observable<string[]>;
  ngOnInit() {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.userCountries.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit() {
    this.fetch.users$.subscribe(data => {
      if (!data) {
        return;
      }
      this.users = data.slice(2, 10002)
      this.userCountries = Array.from(new Set(this.users.map(x => x.countryName).sort()))
      this.dataSource = new MatTableDataSource(this.users)
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: User, filter: string) => {
        return data.countryName == filter;
      };
    })
  }

  public userCountries = []
  public users: User[];
  public dataSource: MatTableDataSource<unknown, MatTableDataSourcePaginator>
  public activeUser: User;
  public userCountry: string;
  public loading: boolean;
  private showExtraColumns: boolean = false;
  public basicColumns = ['position', 'country', 'uId', 'username', 'title', 'sr', 'rfx', 'ten', 'sta', 'acc', 'rea', 'pre', 'wrm'];
  public extraColumns = ['position', 'country', 'uId', 'username', 'pp', 'accPercentage', 'starRating', 'ar', 'cs', 'length', 'title', 'sr', 'dSr', 'rfx', 'ten', 'sta', 'acc', 'rea', 'pre', 'wrm'];
  public columnsToDisplay = this.basicColumns
  public formControl = new FormControl('');

  public toggleExtras(): void {
    if (!this.showExtraColumns) {
      this.columnsToDisplay = this.extraColumns;
    } else {
      this.columnsToDisplay = this.basicColumns;
    }
    this.showExtraColumns = !this.showExtraColumns
  }

  public filterCountry(event) {
    let country = event.option.value
    console.log(country)
    if (country !== "all") {
      this.dataSource.filter = country

    } else {
      this.dataSource.filter = ""
    }

  }
}
