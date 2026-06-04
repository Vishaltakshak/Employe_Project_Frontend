import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {inject} from '@angular/core';
import { environment} from '../../environment'
import { IEmployee} from '../Model/EmployeeInterface'
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);
  createEmployee(employee: IEmployee){
    return this.http.post(`${environment.bareUrl}/employee/create`, employee);
  }
  updateEmployee(id: number, employee: IEmployee){
    return this.http.put(`${environment.bareUrl}/employee/update/${id}`, employee);
  }
  deleteEmployee(id: number){
    return this.http.delete(`${environment.bareUrl}/employee/delete/${id}`);
  }
  getById(id: number){
    return this.http.get(`${environment.bareUrl}/employee/getbyid/${id}`);
  }
  getAllEmployees(){
    return this.http.get(`${environment.bareUrl}/employee/getall`);
  }
  assignProject(employeeId: number, projectId: number, createdBy: string)
  {
    return this.http.post(`${environment.bareUrl}/employee/assign-project?empId=${employeeId}&projectId=${projectId}&createBy=${createdBy}`, {});
  }
  removeFromProject(employeeId: number, projectId: number, modifiedBy: string){
    return this.http.post(`${environment.bareUrl}/employee/remove-from-project?empId=${employeeId}&projectId=${projectId}&modifiedBy=${modifiedBy}`,{});
  }
  getByDept(deptId: number){
    return this.http.get(`${environment.bareUrl}/employee/getbydept/${deptId}`);
  }
  getAssignedProjects(empId: number){
    return this.http.get<any[]>(`${environment.bareUrl}/employee/getprojects/${empId}`);
  }
}
