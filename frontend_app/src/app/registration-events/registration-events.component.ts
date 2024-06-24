import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IEvents } from '../interfaces/events.interface';
import { CommonModule } from '@angular/common';
import { EventsService } from '../services/api_serivices/events/events.service';

@Component({
  selector: 'app-registration-events',
  standalone: true,
  templateUrl: './registration-events.component.html',
  styleUrls: ['./registration-events.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class RegistrationEventsComponent implements OnInit {
  events = inject(EventsService);
  router = inject(Router);
  project: any;
  private snackBar: MatSnackBar;

  eventos = new FormGroup({
    name: new FormControl<any>('', [Validators.required]),
    description: new FormControl<any>('', [Validators.required]),
    startDate: new FormControl<any>('', [Validators.required]),
    endDate: new FormControl<any>('', [Validators.required]),
    typeEvent: new FormControl<any>('', [Validators.required]),
    status: new FormControl<any>('', [Validators.required]),
  });

  constructor(snackBar: MatSnackBar) {
    this.snackBar = snackBar;
  }

  ngOnInit() {}

  onSubmit() {
    if (this.eventos.valid) {
      const eventData: IEvents = {
        name: this.eventos.get('name')?.value,
        description: this.eventos.get('description')?.value,
        startDate: this.eventos.get('startDate')?.value,
        endDate: this.eventos.get('endDate')?.value,
        typeEvent: this.eventos.get('typeEvent')?.value,
        status: this.eventos.get('status')?.value
      };

      this.events.createEvent(eventData).subscribe(
        response => {
          this.snackBar.open('Evento registrado exitosamente', 'Cerrar', { duration: 3000 });
          console.log('Evento registrado con éxito', response);
          this.router.navigate(['/eventos']);
        },
        error => {
          this.snackBar.open('Error al registrar el evento', 'Cerrar', { duration: 3000 });
          console.error('Error al registrar evento', error);
        }
      );
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
    }
  }

  closeForm() {
    this.router.navigate(['/eventos']);
  }
}
