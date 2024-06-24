import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipantsService } from '../services/api_serivices/participants/participants.service';
import { CompetitionsService } from '../services/api_serivices/competitions/competitions.service';
import { GroupsService } from '../services/api_serivices/groups/groups.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-participant-competition',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './registration-participant-competition.component.html',
  styleUrls: ['./registration-participant-competition.component.css']
})
export class RegistrationParticipantCompetitionComponent implements OnInit {
  registerForm: FormGroup;
  competitions: any[] = [];
  groups: any[] = [];
  private participantsService = inject(ParticipantsService);
  private competitionsService = inject(CompetitionsService);
  private groupsService = inject(GroupsService);
  private snackBar: MatSnackBar;
  constructor(
    private fb: FormBuilder,
    snackBar: MatSnackBar,
    private router :Router
  ) {
    this.snackBar = snackBar;
    this.registerForm = this.fb.group({
      card: ['', Validators.required],
      idCompetition: ['', Validators.required],
      idGroup: ['', Validators.required],
      Clave_Grupo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCompetitions();
    this.loadGroups();
  }

  loadCompetitions() {
    this.competitionsService.getCompetitionsCombo().subscribe(data => {
      this.competitions = data;
    });
  }

  loadGroups() {
    this.groupsService.getGroupsCombo().subscribe(data => {
      this.groups = data;
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { card, idCompetition, idGroup,Clave_Grupo } = this.registerForm.value;
      console.log(card, idCompetition, idGroup,Clave_Grupo)

      if (Clave_Grupo) {
        // Primero asignamos el participante al grupo con la clave del grupo
        this.groupsService.assignGroup(idGroup, card, Clave_Grupo).subscribe(
          response => {
            console.log('Grupo asignado correctamente', response);

            // Luego asignamos el concurso al grupo
            this.competitionsService.assignCompetition(idCompetition, idGroup).subscribe(
              response => {
                this.snackBar.open('Concurso asignado correctamente', 'Cerrar', { duration: 3000 });
              },
              error => {
                console.error('Error al asignar el concurso', error);
                this.snackBar.open('Error al asignar el concurso, inténtelo nuevamente', 'Cerrar', { duration: 3000 });
              }
            );
          },
          error => {
            console.error('Error al asignar el grupo', error);
            this.snackBar.open('Error al asignar el grupo, inténtelo nuevamente', 'Cerrar', { duration: 3000 });
          }
        );
      } else {
        this.snackBar.open('Clave del grupo no encontrada.', 'Cerrar', { duration: 3000 });
      }
    } else {
      this.snackBar.open('Formulario inválido.', 'Cerrar', { duration: 3000 });
    }
  }
  regresar() {
    this.router.navigate(['/']);
  }
}
