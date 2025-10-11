import { Component } from '@angular/core';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aluno-list',
  imports: [CommonModule],
  templateUrl: './aluno-list.html',
  styleUrl: './aluno-list.scss'
})
export class AlunoList {
  alunos: Aluno[];

  constructor(private alunoService:
    AlunoService) {
    this.alunos = this.alunoService.listar();
  }
}
