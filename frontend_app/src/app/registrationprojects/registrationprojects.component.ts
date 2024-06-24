import { Component, OnInit, inject } from '@angular/core';
import { ProjectsService } from '../services/api_serivices/projects/projects.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProjects } from '../interfaces/projects.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar
import { ClubsService } from '../services/api_serivices/clubs/clubs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrationprojects',
  standalone: true,
  templateUrl: './registrationprojects.component.html',
  styleUrls: ['./registrationprojects.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class RegistrationprojectsComponent implements OnInit {
  projects = inject(ProjectsService);
  router = inject(Router);
  project: any;
  clubs = inject(ClubsService);
  clubsData: any[] = [];

  // Agrega MatSnackBar al constructor
  constructor(private snackBar: MatSnackBar) {}

  register = new FormGroup({
    name: new FormControl<any>('', [Validators.required]),
    description: new FormControl<any>(''),
    startDate: new FormControl<any>('', [Validators.required]),
    endDate: new FormControl<any>('', [Validators.required]),
    club: new FormControl<any>('', [Validators.required]),
  });

  ngOnInit() {
    this.getClubs();
  }

  onSubmit() {
    if (this.register.valid) {
      const projectData: IProjects = {
        name: this.register.get('name')?.value,
        description: this.register.get('description')?.value,
        startDate: this.register.get('startDate')?.value,
        endDate: this.register.get('endDate')?.value,
        idClub: this.register.get('club')?.value,
      };

      this.projects.createProject(projectData).subscribe(
        response => {
          this.project = response;
          // Utiliza MatSnackBar para mostrar mensaje de éxito
          this.snackBar.open('Proyecto registrado exitosamente', 'Cerrar', {
            duration: 3000, // Duración del mensaje en milisegundos
          });
          console.log('Proyecto registrado exitosamente', response);
          this.router.navigate(['proyectos']);
        },
        error => {
          // Utiliza MatSnackBar para mostrar mensaje de error
          this.snackBar.open('Error al registrar el Proyecto', 'Cerrar', {
            duration: 3000, // Duración del mensaje en milisegundos
          });
          console.error('Error al registrar el proyecto', error);
        }
      );
    } else {
      // Utiliza MatSnackBar para mostrar mensaje de formulario inválido
      this.snackBar.open('Formulario inválido', 'Cerrar', {
        duration: 3000, // Duración del mensaje en milisegundos
      });
    }
  }

  getClubs() {
    this.clubs.getClubsCombo().subscribe(
      response => {
        this.clubsData = response;
        console.log('Clubs data:', this.clubsData);
      },
      error => {
        console.error('Error al obtener los clubs', error);
      }
    );
  }
}
