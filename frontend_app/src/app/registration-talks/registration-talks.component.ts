import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar
import { CommonModule } from '@angular/common';
import { ITalks } from '../interfaces/talks.interface';
import { TalksService } from '../services/api_serivices/talks/talks.service';

@Component({
  selector: 'app-registration-talks',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registration-talks.component.html',
  styleUrls: ['./registration-talks.component.css']
})
export class RegistrationTalksComponent implements OnInit {
  talksService = inject(TalksService);
  router = inject(Router);
  // Agrega MatSnackBar al constructor
  constructor(private snackBar: MatSnackBar) {}

  talks = new FormGroup({
    topic: new FormControl<any>('', [Validators.required]),
    image: new FormControl<any>('', [Validators.required]),
    startDate: new FormControl<any>('', [Validators.required]),
    endDate: new FormControl<any>('', [Validators.required]),
    status: new FormControl<any>('', [Validators.required])
  });

  ngOnInit() {}

  onSubmit() {
    if (this.talks.valid) {
      const talkData: ITalks = {
        topic: this.talks.get('topic')?.value,
        image: this.talks.get('image')?.value,
        startDate: this.talks.get('startDate')?.value,
        endDate: this.talks.get('endDate')?.value,
        status: this.talks.get('status')?.value
      };

      this.talksService.createTalk(talkData).subscribe(
        response => {
          // Utiliza MatSnackBar para mostrar mensaje de éxito
          this.snackBar.open('Charla registrada con éxito', 'Cerrar', {
            duration: 3000, // Duración del mensaje en milisegundos
          });
          this.router.navigate(['/talks-list']);
        },
        error => {
          // Utiliza MatSnackBar para mostrar mensaje de error
          this.snackBar.open('Error Charla registrada', 'Cerrar', {
            duration: 3000, // Duración del mensaje en milisegundos
          });
          console.error('Error al registrar charla', error);
        }
      );
    } else {
      // Utiliza MatSnackBar para mostrar mensaje de formulario inválido
      this.snackBar.open('Formulario inválido', 'Cerrar', {
        duration: 3000, // Duración del mensaje en milisegundos
      });
    }
  }
}
