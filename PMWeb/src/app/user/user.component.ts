import { Component, OnInit, ɵConsole } from '@angular/core';
import { ProjectService } from 'src/api/project.service';
import { Router } from '@angular/router';
import { IProject } from '../IProject';
import { IUser } from '../IUser';
import { ITask } from '../ITask';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  _projectservice: ProjectService;
  _projects: IProject[] = [];
  _users: IUser[] = [];
  _tasks: ITask[] = [];
  errMessage :string;

  constructor(projectService: ProjectService, private router: Router) { 
    this._projectservice = projectService;
  }

  ngOnInit() {

    this._projectservice.GetProjects().subscribe({
      next: projects => {
        this._projects = projects;
      },
      error: err => this.errMessage = err
    });

    this._projectservice.GetUserList().subscribe({
      next: users => {
        this._users = users;
        console.log(this._users);
      },
      error: err => this.errMessage = err
    });

    this._projectservice.GetTaskList().subscribe({
      next: tasks => {
        this._tasks = tasks;
        console.log(this._tasks);
      },
      error: err => this.errMessage = err
    });

  }

  SaveUser(firstName: string, lastName: string, projectId: number, taskId: number): boolean{
    console.log(firstName, lastName, projectId, taskId);
    this._projectservice.SaveUser(firstName, lastName, projectId
      , taskId)
      .subscribe(
        res => {},
        err => {},
        () => {
          this._projectservice.GetUserList().subscribe({
            next: users => {
              this._users = users;
              console.log(this._users);
            },
            error: err => this.errMessage = err
          });
        }
      );
    return true;
  }

  DeleteUser(userId: number): boolean{
    console.log(userId);
    this._projectservice.DeleteUser(userId)
    .subscribe(
      res => {},
      err => {},
      () => {
        this._projectservice.GetUserList().subscribe({
          next: users => {
            this._users = users;
            console.log(this._users);
          },
          error: err => this.errMessage = err
        });
      }
    );
    return true;
  }

}
