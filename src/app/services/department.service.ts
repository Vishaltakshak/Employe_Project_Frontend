import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDepartment } from '../Model/Departments'
import { environment} from '../../environment'
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
 http = inject(HttpClient);


  createDepartment( department: IDepartment){
    return this.http.post(`${environment.bareUrl}/department/create`, department);
  }
  updateDepartment(id: number, department: IDepartment){
    return this.http.put(`${environment.bareUrl}/department/update/${id}`, department);
  }
  deleteDepartment(id: number){
    return this.http.delete(`${environment.bareUrl}/department/delete/${id}`);
  }
  getById(id: number){
    return this.http.get(`${environment.bareUrl}/department/get/${id}`);
  }
  getAllDepartments(){
    return this.http.get(`${environment.bareUrl}/department/getall`);
  }
}
