// Vendor
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

// Service
import { CommonService } from '@shared/service/common.service';

// Models
import { SelectionModel } from '@angular/cdk/collections';
import {
  EmployeeResponseModel,
  ShiftsResponseModel
} from '@shared/models/response/index';

/**
 * Employee Component class.
 *
 * @author Nenad Stojković
 */
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent implements OnInit, OnDestroy {
  // All subscriptions.
  subscriptions = new Subscription();

  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'total',
    'hourlyRate',
    'overtimeHourlyRate',
  ];

  employeeData: EmployeeResponseModel[] | any = [];
  dataRows: number = 0;

  shiftsData: ShiftsResponseModel[] = [];

  selection = new SelectionModel<EmployeeResponseModel>(true, []);
  selectedRow: EmployeeResponseModel[] = [];
  isSelected = false;

  showPopUp = false;

  total = 0;

  clockIn: any = 0;
  clockOut: any = 0;
  userClockedIn: any = 0;

  /**
   * Class constructor.
   */
  constructor(private commonService: CommonService) {
    // It hides popup.
    this.subscriptions.add(
      this.commonService.showPopup.subscribe({
        next: (response: boolean) => {
          this.showPopUp = response;
        },
        error: (error: any) => {
          console.log('showPopup -> Error --> ', error);
        },
      })
    );
  }

  /**
   * OnInit lifecycle hook.
   */
  ngOnInit() {
    this.getEmployee();
  }

  /**
   * Its get employee data.
   *
   * @author Nenad Stojković
   */
  getEmployee() {
    this.subscriptions.add(
      this.commonService.getEmployee().subscribe({
        next: (response: EmployeeResponseModel[] | any) => {
          this.employeeData = response;
          this.dataRows = this.employeeData.length;
          this.getShifts();
        },
        error: (error) => {
          console.log('getEmployee() -> Error --> ', error);
        },
      })
    );
  }

  /**
   * Its get shifts data.
   *
   * @author Nenad Stojković
   */
  getShifts() {
    let isDataLoaded = false;
    this.subscriptions.add(
      this.commonService.getShifts().subscribe({
        next: (response: ShiftsResponseModel[]) => {
          this.shiftsData = response;
          isDataLoaded = true;
          if (isDataLoaded) {
            this.allDataMerged();
            this.allTotalHours();
          }
        },
        error: (error) => {
          console.log('getShifts() -> Error --> ', error);
        },
      })
    );
  }

  /**
   * It merge employee and shifts in new object.
   *
   * @author Nenad Stojković
   */
  allDataMerged() {
    for (let i = 0; i < this.employeeData.length; i++) {
      this.shiftsData.forEach((element: any) => {
        if (this.employeeData[i].id === element.employee_id) {
          this.employeeData[i].shifts.push(element);
        }
      });
    }
  }

  /**
   * Its calculate hours for employee.
   *
   * @author Nenad Stojković
   * @return `number`
   */
  totalHoursCalc(clockIn: any, clockOut: any) {
    // TODO: Not finished.
    this.total = parseInt(clockOut) - parseInt(clockIn);
    return this.total;
  }

  /**
   * Its calculate total clock in hours for all employee.
   *
   * @author Nenad Stojković
   */
  allTotalHours() {
    /* TODO: Not finished.
    let x: any;
    this.employeeData.forEach((element: any) => {
      x = element.shifts.reduce((a: any, b: any) => { return a + b.clock_in; }, 0);
      console.log('x --> ', x)
    });
    */
  }

  /**
   * It checks row selection.
   *
   * @author Nenad Stojković
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataRows;
    return numSelected === numRows;
  }

  /**
   * It clear row selection.
   *
   * @author Nenad Stojković
   */
  clearSelection() {
    this.selection.clear();
    this.selectedRow = [];
  }

  /**
   * It toggle checkbox.
   *
   * @author Nenad Stojković
   */
  masterToggle() {
    this.isAllSelected()
      ? this.clearSelection()
      : this.employeeData.forEach((row: EmployeeResponseModel[] | any) => {
          this.selection.select(row);
          this.selectedRow.push(row);
      });
  }

  /**
   * It select row.
   *
   * @author Nenad Stojković
   * @param `ev` selected row object.
   */
  selectRow(ev: any) {
    this.selection.toggle(ev);
    this.selectedRow.push(ev);
  }

  /**
   * It open popup for edit.
   *
   * @author Nenad Stojković
   */
  openPopup() {
    this.showPopUp = true;
    this.commonService.showPopup.next(true);
  }

  /**
   * OnDestroy lifecycle hook.
   */
  ngOnDestroy() {
    this.employeeData = [];
    this.subscriptions.unsubscribe();
  }
}
