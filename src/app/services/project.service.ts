import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environment';
import { IProject } from '../Model/ProjectInterface';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  https = inject(HttpClient);
  createProject(project: IProject){
    return this.https.post(`${environment.bareUrl}/project/create`, project);
  }
  updateProject(id: number, project: IProject){
    return this.https.put(`${environment.bareUrl}/project/update/${id}`, project);
  }
  deleteProject(id: number){
    return this.https.delete(`${environment.bareUrl}/project/delete/${id}`);
  }
  getById(id: number){
    return this.https.get(`${environment.bareUrl}/project/get/${id}`);
  }
  getAllProjects(){
    return this.https.get(`${environment.bareUrl}/project/getall`);
  }
}
