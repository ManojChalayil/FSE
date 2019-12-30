import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/api/project.service';
import { IProject } from '../IProject';
import { Router } from '@angular/router';
import { IParentTask } from '../IparentTask';
import { IUser } from '../IUser';
import { start } from 'repl';
import { ITask } from '../ITask';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  _projectservice: ProjectService;
  _projects: IProject[] = [];
  _parenttasks: IParentTask[] = [];
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

    this._projectservice.GetParentTasks().subscribe({
      next: parenttasks => {
        this._parenttasks = parenttasks;
      },
      error: err => this.errMessage = err
    });
    
    this._projectservice.GetUser().subscribe({
      next: users => {
        this._users = users;
        console.log(this._users);
      },
      error: err => this.errMessage = err
    });

    this._projectservice.GetTask().subscribe({
      next: tasks => {
        this._tasks = tasks;
        console.log(this._tasks);
      },
      error: err => this.errMessage = err
    });
  }

  SaveTask(parentTask, projectId, taskName, startDate, endDate
    , priority, usr): boolean{
    //console.log(parentTask, projectId, taskName, startDate, endDate, priority, 'OPEN', usr);
    this._projectservice.SaveTask(parentTask, projectId, taskName
      , startDate, endDate, priority, 'OPEN', usr)
      .subscribe(
        res => {},
        err => {},
        () => {
          this._projectservice.GetTask().subscribe({
            next: tasks => {
              this._tasks = tasks;
              console.log(this._tasks);
            },
            error: err => this.errMessage = err
          });
        }
      )
    return true;
  }

  EndTask(taskId: number): boolean{
    this._projectservice.EndTask(taskId);
    return true;
  }

}
