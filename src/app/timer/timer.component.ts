import {Component, OnInit} from '@angular/core';
import {interval, Observable, Subscription, fromEvent} from 'rxjs';
import {map, bufferCount, filter} from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit{
  hours: number;
  minutes: number;
  seconds: number;
  flag = true;
  timeString = '00:00:00';
  time: Date;
  subscribe: Subscription;
  clickCount = 2;
  clickTimespan = 300;
  obsTimer: Observable<number> = interval(1000);
  save = 0;


  constructor() { }

  ngOnInit(): void {
  }

  startButton(): void {
    this.flag = true;
    this.subscribe = this.obsTimer.subscribe(currTime => {
      if (this.flag) {
        this.convertSecondstoTime(this.save + currTime);
      } else {
          this.save += currTime - 1;
          this.subscribe.unsubscribe();
      }
    });
  }

  convertSecondstoTime(currTime): void {
    const time = new Date(currTime * 1000);

    let hours;
    let minutes;
    let seconds;
    hours = time.getUTCHours();
    minutes = time.getUTCMinutes();
    seconds = time.getSeconds();

    this.timeString = hours.toString().padStart(2, '0')
      + ':' + minutes.toString().padStart(2, '0')
      + ':' + seconds.toString().padStart(2, '0');
  }
  stopButton(): void {
    this.subscribe.unsubscribe();
    this.timeString = '00:00:00';
    this.save = 0;
    this.flag = true;
  }
  resetButton(): void {
    this.stopButton();
    this.startButton();
    this.flag = true;
  }

  waitButton(): void {
    const wait = fromEvent(document.getElementById('wait'), 'click').pipe(
      map(() => new Date().getTime()),
      bufferCount(this.clickCount, 1),
      filter((timestamps) => {
        if (timestamps[0] > new Date().getTime() - this.clickTimespan) {
          this.flag = false;
          return true;
        } else {
          return false;
        }
        // return timestamps[0] > new Date().getTime() - this.clickTimespan;
      })
    ).subscribe();
  }

}
