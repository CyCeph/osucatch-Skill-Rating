import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { User } from '../interfaces/user';
import { ProfileUser } from '../interfaces/profile-user';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SheetFetchService {
  private SkillRatingLink: string =
    'https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=64960459';

  private DanLink: string =
    'https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=637350582';
  private users = new BehaviorSubject<User[] | null>(null)

  public users$ = this.users.asObservable()

  constructor(private httpClient: HttpClient, private papa: Papa) { }

  public getData(): void {
    const data = this.httpClient.get(this.SkillRatingLink, {
      responseType: 'text',
    });

    let users = []
    data.subscribe((data) => {
      this.papa.parse(data, {
        complete: (result) => {
          const output = result.data;

          output.map((user: any, idx: number) => {
            if (true) {
              let average =
                (parseFloat(user[12]) +
                  parseFloat(user[13]) +
                  parseFloat(user[14]) +
                  parseFloat(user[15]) +
                  parseFloat(user[16]) +
                  parseFloat(user[17])) /
                6;

              let sr = Math.pow(parseFloat(user[11]) / 5000, 0.5);

              let score = (100 * sr + average) / 2;

              const newUser: User = {
                ranking: user[0],
                CountryRanking: user[1],
                username: user[2],
                uId: parseInt(user[3]),
                pp: user[4],
                accPercentage: user[5],
                starRating: user[6],
                ar: user[7],
                cs: user[8],
                length: user[9],
                rating: Math.round(score),
                country: this.parseCountry(user[11].split(' ')[0]),
                countryName: user[11],
                sr: user[12],
                rfx: parseFloat(user[13]),
                ten: parseFloat(user[14]),
                sta: parseFloat(user[15]),
                acc: parseFloat(user[16]),
                rea: parseFloat(user[17]),
                pre: parseFloat(user[18]),
                wrm: Math.round(user[19] * 10) / 10,
                title: user[20],
                oldRfx: parseFloat(user[31]),
                oldTen: parseFloat(user[32]),
                oldSta: parseFloat(user[33]),
                oldAcc: parseFloat(user[34]),
                oldRea: parseFloat(user[35]),
                oldPre: parseFloat(user[36]),
                dSr: parseFloat(user[37])
              }
              users.push(newUser)
            }
          });
        },
      });
      this.users.next(users)
    });

  }

  public getCountryCode(id: string) {
    return this.httpClient.get(
      `https://osupepe.com/api/users/userstats?userId=${id}`
    );
  }

  public getHighestDan(id: number) {
    const dan = new Subject<string>();
    const data = this.httpClient.get(this.DanLink, {
      responseType: 'text',
    });

    data.subscribe((data) => {
      let users = []
      this.papa.parse(data, {
        complete: (result) => {
          const output = result.data;

          output.map((user: any) => {

            users.push(user)
          });
        },
      });

      let user = users.find(x => x[1] == id);

      let currentDan = 0;

      for (let i = 14; i >= 2; i--) {
        const dan = user[i]
        if (dan === "Y") {
          currentDan = i
          break;
        }
      }

      if (currentDan != 0) {
        dan.next(users[0][currentDan])
      }

    })

    return dan.asObservable()
  }

  private parseCountry(letters: string) {
    const codePoints = [...letters].map(c => {
      var codePoint = c.codePointAt(0) - 127397
      return codePoint
    })
      .filter(x => x >= 0);
    return String.fromCodePoint(...codePoints).toLowerCase()
  }
}
