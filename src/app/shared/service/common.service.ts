// Vendor
import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  delay
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Models
import {
  EmployeeResponseModel,
  ShiftsResponseModel
} from '@shared/models/response/index';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  // Is popup opened.
  public showPopup = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient
  ) {}

  /**
   * It gets employee data.
   *
   * @author Nenad Stojković
   * @return `EmployeeResponseModel` Array of objects.
   */
  getEmployee(): Observable<EmployeeResponseModel> {
    const data: any = '/assets/fake-data/EMPLOYEE_DATA.json';
    return this.http.get<EmployeeResponseModel>(data).pipe(delay(500));
  }

  /**
   * It gets employee data.
   *
   * @author Nenad Stojković
   * @return `ShiftsResponseModel` Array of objects.
   */
  getShifts(): Observable<ShiftsResponseModel[]> {
    const data = '/assets/fake-data/SHIFTS_DATA.json';
    return this.http.get<ShiftsResponseModel[]>(data).pipe(delay(500));
  }

  /**
   * It prepares data.
   *
   * @author Nenad Stojković
   * @param  `any` controls
   * @param  `any` value
   * @return `void`
   */
  prepareData(controls: any, data: any) {
    for (const prop in data) {
      if (controls[prop] !== undefined) {
        for (const item in data[prop]) {
          if (controls[item] !== undefined) {
            const obj = data[prop];
            obj[item] = controls[item].value;
          }
        }
      }
    }
  }
}
