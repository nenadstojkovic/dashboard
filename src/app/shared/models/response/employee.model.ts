export interface EmployeeResponseModel {
  id: number,
  name: string;
  email: string;
  hourly_rate: number;
  overtime_hourly_rate: number;
  shifts: [];
}