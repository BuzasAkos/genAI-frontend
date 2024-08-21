import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
@Injectable({ 
    providedIn: 'root'
})
export class DurationPipe implements PipeTransform {

    transform(value: number): string {
      if (!value || value < 0) {
        return '00:00';
      }
  
      const hours: number = value / 3600000;
      if (hours >= 1) {
        return `${hours.toFixed(1)}h`; // Return hours with 1 decimal point
      } 

      const minutes: number = Math.floor((value % 3600000) / 60000);
      const seconds: number = Math.floor((value % 60000) / 1000);

      const minutesString = minutes < 10 ? '0' + minutes : minutes.toString();
      const secondsString = seconds < 10 ? '0' + seconds : seconds.toString();

      return `${minutesString}:${secondsString}`;

    }
  }
