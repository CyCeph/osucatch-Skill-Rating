import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileUser } from 'src/app/interfaces/profile-user';
import { SingleBar } from 'src/app/interfaces/single-bar';
import { SheetFetchService } from 'src/app/service/sheet-fetch.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  single: SingleBar[] = [];

  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Skill';
  showYAxisLabel = true;


  customColors = [
    {
      name: "RFX",
      value: "#ffadad"
    },
    {
      name: "TEN",
      value: "#ffd6a5"
    },
    {
      name: "STA",
      value: "#fdffb6"
    },
    {
      name: "ACC",
      value: "#caffbf"
    },
    {
      name: "REA",
      value: "#9bf6ff"
    },
    {
      name: "PRE",
      value: "#bdb2ff"
    },
  ]

  onSelect(event) {
    console.log(event);
  }


  public User: ProfileUser

  public dan: string
  private route = inject(ActivatedRoute)
  private dataService = inject(SheetFetchService)

  ngOnInit(): void {
    this.initProfile();
  }

  initProfile(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.dataService.users$.subscribe(users => {
      if (!users) {
        return;
      }
      const index = users.map(x => x.uId).indexOf(parseInt(id))
      const user: ProfileUser = {
        ranking: index - 1,
        user: users[index]
      }

      this.User = user

      this.single.push(this.createBar(user.user.rfx, "RFX"))
      this.single.push(this.createBar(user.user.ten, "TEN"))
      this.single.push(this.createBar(user.user.sta, "STA"))
      this.single.push(this.createBar(user.user.acc, "ACC"))
      this.single.push(this.createBar(user.user.rea, "REA"))
      this.single.push(this.createBar(user.user.pre, "PRE"))

      this.dataService.getHighestDan(user.user.uId).subscribe(x => {
        if (x) {
          this.dan = x
        }
      })
    })
  }

  private createBar(currentValue: number, name: string): SingleBar {
    return {
      name: name,
      value: currentValue
    }
  }


}
