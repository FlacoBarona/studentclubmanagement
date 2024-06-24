import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IGroups } from '../interfaces/groups.interface';
import { GroupsService } from '../services/api_serivices/groups/groups.service';

@Component({
  selector: 'app-registration-groups',
  standalone: true,
  templateUrl: './registration-groups.component.html',
  styleUrls: ['./registration-groups.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class RegistrationGroupsComponent implements OnInit {
  groupsService = inject(GroupsService);
  router = inject(Router);

  grupos = new FormGroup({
    name: new FormControl<any>('', [Validators.required]),
    description: new FormControl<any>('', [Validators.required]),
    status: new FormControl<any>('true', [Validators.required])
  });

  ngOnInit() {}

  onSubmit() {
    if (this.grupos.valid) {
      const groupData: IGroups = {
        name: this.grupos.get('name')?.value,
        description: this.grupos.get('description')?.value,
        status: this.grupos.get('status')?.value === 'true'
      };

      this.groupsService.createGroup(groupData).subscribe(
        response => {
          alert('Grupo registrado exitosamente');
          console.log('Grupo registrado con éxito', response);
          this.router.navigate(['/group-list']);
        },
        error => {
          alert('Error al registrar el grupo');
          console.error('Error al registrar grupo', error);
        }
      );
    } else {
      alert('Formulario inválido');
    }
  }
}
