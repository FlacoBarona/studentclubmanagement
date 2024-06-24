import { Component, inject } from '@angular/core';
import { UserService } from '../services/api_serivices/user/user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISignUp } from '../interfaces/userAuth.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration-members',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registration-members.component.html',
  styleUrls: ['./registration-members.component.css']
})
export class RegistrationMembersComponent {
  member = inject(UserService);
  router = inject(Router);
  user: any;
  private snackBar: MatSnackBar;

  register = new FormGroup({
    email: new FormControl<any>('', [Validators.required, Validators.email]),
    password: new FormControl<any>('', [Validators.required]),
    card: new FormControl<any>('', [Validators.required]),
    name: new FormControl<any>('', [Validators.required]),
    lastName: new FormControl<any>('', [Validators.required]),
    semester: new FormControl<any>('', [Validators.required]),
    major: new FormControl<any>('', [Validators.required]),
    rol: new FormControl<any>('', [Validators.required])
  });

  constructor(snackBar: MatSnackBar) {
    this.snackBar = snackBar;
  }

  onSignUp() {
    if (this.register.valid) {
      const signUpData: ISignUp = {
        email: this.register.get('email')?.value,
        password: this.register.get('password')?.value,
        card: this.register.get('card')?.value,
        name: this.register.get('name')?.value,
        lastName: this.register.get('lastName')?.value,
        semester: this.register.get('semester')?.value,
        major: this.register.get('major')?.value,
        rol: this.register.get('rol')?.value
      };

      this.member.signUpUserMember(signUpData).subscribe(
        response => {
          this.user = response;
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/miembros']);
        },
        error => {
          this.snackBar.open('Error al registrar', 'Cerrar', { duration: 3000 });
          console.error('Error al registrar', error);
        }
      );
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
    }
  }
}
