import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/api/project.service';
import { IProject } from '../IProject';
import { Router } from '@angular/router';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  _projectservice: ProjectService;
  _projects: IProject[] = [];
  errMessage :string;
  _projectName: string = "";
  _startDate: Date;
  _endDate: Date;

  constructor(projectService: ProjectService, private router: Router) { 
    this._projectservice = projectService;
  }

  ngOnInit() {
    this._projectservice.GetProjects().subscribe({
      next: projects => {
        this._projects = projects;
        console.log("Project Array display");
        console.log(this._projects);
      },
      error: err => this.errMessage = err
    });
  }

  SaveProject(projectName: string, startDate: Date
    , endDate: Date, priority: number): void{

      console.log(this._projectName);

    this._projectservice.SaveProject(projectName, startDate
      , endDate, priority)
      .subscribe(
        res => { console.log(res); },
        err => { console.log(err); },
        () => {
          this._projectservice.GetProjects().subscribe({
            next: projects => {
              this._projects = projects;
              console.log("calling get project after save project");
              console.log(this._projects);
            },
            error: err => this.errMessage = err
          });
        }
      );
  }

  Cancel(): void{
    console.log("came to cancel");
    
    this.router.navigate(["project"]);
  }
  
  Suspend(projectId: number): void{
    this._projectservice.DeleteProject(projectId).subscribe(
      res => {},
      err => {},
      () => {
        this._projectservice.GetProjects().subscribe({
          next: projects => {
            this._projects = projects;
            console.log("calling get project after delete project");
            console.log(this._projects);
          },
          error: err => this.errMessage = err
        });
      }
    );
  }

}
