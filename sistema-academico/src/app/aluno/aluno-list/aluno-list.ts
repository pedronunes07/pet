import { Component, OnInit } from '@angular/core';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aluno-list',
  imports: [CommonModule],
  templateUrl: './aluno-list.html',
  styleUrl: './aluno-list.scss'
})
export class AlunoList implements OnInit {
  alunos: Aluno[] = [];

  constructor(private alunoService: AlunoService) { }

  ngOnInit(): void {
    this.alunoService.listar().subscribe({
      next: (dados) => (this.alunos = dados),
      error: () => alert('Deu erro ao carregar alunos')
    })
  }
}
