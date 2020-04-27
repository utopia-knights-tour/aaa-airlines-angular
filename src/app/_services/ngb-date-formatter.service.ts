import { Injectable } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class NgbDateFormatterService extends NgbDateParserFormatter {

  constructor() {
    super();
  }

  parse(value: string): any {
    throw new Error("Method not implemented.");
  }

  format(date: any): string {
    const year = date.year;
    const month = date.month.toString().length === 2? date.month: '0'+date.month;
    const day = date.day.toString().length === 2? date.day: '0'+date.day;
    return `${year}-${month}-${day}`;
  }
}
