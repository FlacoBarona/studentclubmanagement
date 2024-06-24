import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CompetitionsService } from '../services/api_serivices/competitions/competitions.service';

@Component({
  selector: 'app-registration-competitions',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registration-competitions.component.html',
  styleUrls: ['./registration-competitions.component.css']
})
export class RegistrationCompetitionsComponent {
  competitionService = inject(CompetitionsService);
  router = inject(Router);
  private snackBar: MatSnackBar;

  register = new FormGroup({
    type: new FormControl<any>('', [Validators.required]),
    numParticipants: new FormControl<any>('', [Validators.required]),
    price: new FormControl<any>('', [Validators.required]),
    status: new FormControl<any>('', [Validators.required])
  });

  constructor(snackBar: MatSnackBar) {
    this.snackBar = snackBar;
  }

  onSignUp() {
    if (this.register.valid) {
      const competitionData = {
        type: this.register.get('type')?.value,
        numParticipants: this.register.get('numParticipants')?.value,
        price: this.register.get('price')?.value,
        status: this.register.get('status')?.value
      };

      this.competitionService.createCompetition(competitionData).subscribe(
        response => {
          this.snackBar.open('Competicion registrada exitosamente', 'Cerrar', { duration: 3000 });
          console.log('Registro exitoso', response);
          this.router.navigate(['/competitions-list']);
        },
        error => {
          this.snackBar.open('Error al registrar la competicion', 'Cerrar', { duration: 3000 });
          console.error('Error al registrar', error);
        }
      );
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
    }
  }
}
