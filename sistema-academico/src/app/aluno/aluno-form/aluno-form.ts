import { Component } from '@angular/core';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aluno-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './aluno-form.html',
  styleUrl: './aluno-form.scss'
})
export class AlunoForm {
  nome: string = '';
  nota: number = 0;

  constructor(private alunoService: AlunoService, private router: Router) { }

  adicionar() {
    const novoAluno = new Aluno(this.nome, this.nota);
    this.alunoService.adicionar(novoAluno).subscribe({
      next: (resposta) => {
        this.router.navigate(['/']);
        alert('Aluno salvo');
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao salvar aluno');
      }
    });
  }
}
