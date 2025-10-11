import { Injectable } from '@angular/core';
import { Aluno } from '../model/aluno';

@Injectable({
  providedIn: 'root', // Singleton!
})
export class AlunoService {

  private alunos: Aluno[] = [
    new Aluno('João Silva', 8, 1),
    new Aluno('Maria Oliveira', 6.5, 2),
    new Aluno('Carlos Souza', 9, 3),
    new Aluno('Fernanda Santos', 7.5, 4),
  ];
  
  constructor() { }
  
  // Método para listar todos os alunos
  listar(): Aluno[] {
    return this.alunos;
  }
  
  // Método para adicionar um aluno
  adicionar(aluno: Omit<Aluno, 'id'>) {
    const id = this.alunos.length + 1;
    const novoAluno = new Aluno(
      aluno.nome, aluno.nota, id);
    this.alunos.push(novoAluno);
  }
}