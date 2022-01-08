// Vendor
import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subscription } from 'rxjs';

// Service
import { CommonService } from '@app/shared/service/common.service';

// Models
import { EmployeeResponseModel } from '@shared/models/response/index';

/**
 * Popup Component class.
 *
 * @author Nenad Stojković
 */
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent implements OnInit {

  subscriptions = new Subscription();

  @Input() data: EmployeeResponseModel | any;

  displayedColumns: string[] = ['shift', 'checkIn', 'checkOut', 'total'];

  shiftData: any;

  totalTime: any;

  /**
   * Class constructor.
   */
  constructor(
    private commonService: CommonService
  ) { }

  /**
   * OnInit lifecycle hook.
   */
  ngOnInit(): void {
    this.timeCalc();
  }

  /**
   * Its calculate time from input data.
   *
   * @author Nenad Stojković
   */
  timeCalc() {
    let time = 0;
    let totalTime: any = '';
    for (let i in this.data) {
      if (i !== undefined) {
        this.shiftData = this.data[i].shifts;
        for (let x in this.shiftData) {
          if (x !== undefined) {
            time = this.timeStringToFloat(this.shiftData[x].clock_out) - this.timeStringToFloat(this.shiftData[x].clock_in);
            totalTime = time.toFixed(2);
            this.timeFormat(totalTime)
          }
        }
      }
    }
  }

  /**
   * Its change string to int from input data.
   *
   * @author Nenad Stojković
   * @return `number`.
   */
  timeStringToFloat(time: any) {
    const hoursMinutes = time.split(/[.:]/);
    const hours = parseInt(hoursMinutes[0], 10);
    const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

  /**
   * Its format number to time.
   *
   * @author Nenad Stojković
   * @return `number`.
   */
  timeFormat(number: any) {
    let sign: any = (number >= 0) ? 1 : -1;

    number = number * sign;

    let hour = Math.floor(number);
    let decpart = number - hour;
    let min = 1 / 60;
    decpart = min * Math.round(decpart / min);

    let minute = Math.floor(decpart * 60) + '';

    if (minute.length < 2) {
      minute = '0' + minute; 
    }

    sign = sign == 1 ? '' : '-';

    const time = sign + hour + ':' + minute;

    return time;
  }

  /**
   * Its close popup.
   *
   * @author Nenad Stojković
   */
  closePopup() {
    this.commonService.showPopup.next(false);
  }

  /**
   * Its set clock in time for save.
   *
   * @author Nenad Stojković
   */
  setClockIn(e: any) {
    console.log('e --> ', e);
  }

  /**
   * Its set clock out time for save.
   *
   * @author Nenad Stojković
   */
  setClockOut(e: any) {
    console.log('e --> ', e);
  }  

}
