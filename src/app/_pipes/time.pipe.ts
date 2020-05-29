import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  constructor(private authService?: AuthService) { }

  transform(time: any): string {
    if (this.authService.currentUserValue.role == 'agent' && typeof time != 'string') {
      return `${time['hour'] < 10 ? "0" : ""}${time['hour']}:0${time['minute']}:0${time['second']}`
    }
    return time;
  }
}
