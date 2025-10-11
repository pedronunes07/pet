import { Routes } from '@angular/router';
import { AlunoForm } from './aluno/aluno-form/aluno-form';
import { AlunoList } from './aluno/aluno-list/aluno-list';

export const routes: Routes = [
    { path: '', component: AlunoList },
    { path: 'novo', component: AlunoForm }
];
