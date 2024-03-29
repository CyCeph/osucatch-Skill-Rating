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
                (parseFloat(user[10]) +
                  parseFloat(user[11]) +
                  parseFloat(user[12]) +
                  parseFloat(user[13]) +
                  parseFloat(user[14]) +
                  parseFloat(user[15])) /
                6;

              let sr = Math.pow(parseFloat(user[9]) / 5000, 0.5);

              let score = (100 * sr + average) / 2;

              const newUser: User = {
                ranking: idx - 1,
                username: user[0],
                uId: parseInt(user[1]),
                pp: user[2],
                accPercentage: user[3],
                starRating: user[4],
                ar: user[5],
                cs: user[6],
                length: user[7],
                rating: Math.round(score),
                country: this.parseCountry(user[9].split(' ')[0]),
                countryName: user[9],
                sr: user[10],
                rfx: parseFloat(user[11]),
                ten: parseFloat(user[12]),
                sta: parseFloat(user[13]),
                acc: parseFloat(user[14]),
                rea: parseFloat(user[15]),
                pre: parseFloat(user[16]),
                wrm: Math.round(user[17] * 10) / 10,
                title: user[18],
                oldRfx: parseFloat(user[29]),
                oldTen: parseFloat(user[30]),
                oldSta: parseFloat(user[31]),
                oldAcc: parseFloat(user[32]),
                oldRea: parseFloat(user[33]),
                oldPre: parseFloat(user[34]),
                dSr: parseFloat(user[35])
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
