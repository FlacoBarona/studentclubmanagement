import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClubsService } from '../services/api_serivices/clubs/clubs.service';
import { Router } from '@angular/router';
import { IClub } from '../interfaces/clubs.interface';
import { CommonModule } from '@angular/common';
import { MembersService } from '../services/api_serivices/members/members.service';

@Component({
  selector: 'app-registration-clubs',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registration-clubs.component.html',
  styleUrls: ['./registration-clubs.component.css']
})
export class RegistrationClubsComponent implements OnInit {
  clubs = inject(ClubsService);
  router = inject(Router);
  members = inject(MembersService);
  memberData: any[] = [];
  private snackBar: MatSnackBar;

  register = new FormGroup({
    name: new FormControl<any>('', [Validators.required]),
    description: new FormControl<any>('', [Validators.required]),
    card: new FormControl<any>('', [Validators.required]),
  });

  constructor(snackBar: MatSnackBar) {
    this.snackBar = snackBar;
  }

  ngOnInit() {
    this.getMembers();
  }

  onSubmit() {
    if (this.register.valid) {
      const clubData: IClub = {
        name: this.register.get('name')?.value,
        description: this.register.get('description')?.value,
        cardResponsible: this.register.get('card')?.value,
      };

      this.clubs.createClub(clubData).subscribe(
        response => {
          this.snackBar.open('Club registrado exitosamente', 'Cerrar', { duration: 3000 });
          console.log('Club registrado exitosamente', response);
          this.router.navigate(['/clubs-list']);
        },
        error => {
          this.snackBar.open('Error al registrar el club', 'Cerrar', { duration: 3000 });
          console.error('Error al registrar el club', error);
        }
      );
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
    }
  }

  getMembers() {
    this.members.getMembersCombo().subscribe(
      response => {
        this.memberData = response;
      },
      error => {
        console.error('Error al obtener los miembros', error);
      }
    );
  }
}
