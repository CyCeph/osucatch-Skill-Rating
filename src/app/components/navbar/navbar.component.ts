import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { SearchUser } from 'src/app/interfaces/search-user';
import { SheetFetchService } from 'src/app/service/sheet-fetch.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  ngOnInit() {
    this.fetch.users$.subscribe(data => {
      if (!data) {
        return;
      }
      this.users = data.slice(2, 10002).map(x => {
        return { username: x.username, id: x.uId }
      })
    })

    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.users.map(x => x.username).filter(option => option.toLowerCase().includes(filterValue));
  }

  private readonly fetch = inject(SheetFetchService)
  private readonly router = inject(Router)

  public filteredOptions: Observable<string[]>;
  public formControl = new FormControl('');
  public users: SearchUser[] = []

  public navigateToUser(event) {
    console.log(event)
    let user = event.option.value
    let userId = this.users.find(x => x.username == user)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['profile', userId.id])
    });
  }
}
