import { Component, OnInit, inject } from '@angular/core';
import { IParticipants } from '../interfaces/participants.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipantsService } from '../services/api_serivices/participants/participants.service';
import { CommonModule } from '@angular/common';
import { UniversitiesService } from '../services/api_serivices/universities/universities.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface IUniversities {
  Id_Universidades: string;
  Nombre_Universidad: string;
  city: string;
  province: string;
}

@Component({
  selector: 'app-registration-participants',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './registration-participants.component.html',
  styleUrls: ['./registration-participants.component.css']
})
export class RegistrationParticipantsComponent implements OnInit {
  registerForm: FormGroup;
  universitys: any[] = [];
  private universitiesService = inject(UniversitiesService);
  private snackBar: MatSnackBar;

  constructor(
    private fb: FormBuilder,
    private participantsService: ParticipantsService,
    private router: Router,
    snackBar: MatSnackBar
  ) {
    this.snackBar = snackBar;
    this.registerForm = this.fb.group({
      card: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: ['', Validators.required],
      idUniversity: ['', Validators.required],
      status: [false, Validators.required] // Cambiado a booleano
    });
  }

  ngOnInit(): void {
    this.loadUniversitys();
  }

  loadUniversitys() {
    this.universitiesService.getUniversities().subscribe(data => {
      this.universitys = data.data;
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const statusValue = this.registerForm.get('status')?.value === 'Habilitado' ? true : false;

      const newParticipant: IParticipants = {
        card: this.registerForm.get('card')?.value,
        name: this.registerForm.get('name')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        email: this.registerForm.get('email')?.value,
        document: this.registerForm.get('document')?.value,
        idUniversity: this.registerForm.get('idUniversity')?.value,
        status: statusValue
      };

      this.participantsService.createParticipant(newParticipant).subscribe(
        response => {
          console.log('Participant registered successfully', response);
          this.snackBar.open('Participante registrado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error registering participant', error);
          this.snackBar.open('Error al registrar al participante, inténtelo nuevamente', 'Cerrar', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Formulario inválido.', 'Cerrar', { duration: 3000 });
    }
  }

  regresar() {
    this.router.navigate(['/']);
  }

  registrarConcurso() {
    this.router.navigate(['/registrar-concurso']);
  }
}
