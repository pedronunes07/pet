import { Component, OnInit, signal } from '@angular/core';
import { Dono } from '../../model/dono';
import { DonoService } from '../../service/dono-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dono-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dono-form.html',
  styleUrl: './dono-form.css'
})
export class DonoForm implements OnInit {
  dono = signal<Partial<Dono>>({
    nomeCompleto: '',
    email: '',
    telefone: '',
    cidade: '',
    endereco: '',
    cep: '',
    estado: '',
    contatoEmergencia: '',
    telefoneEmergencia: '',
    observacao: ''
  });
  donoId?: number;

  constructor(
    private donoService: DonoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.donoId = +id;
      this.carregarDono(this.donoId);
    }
  }

  carregarDono(id: number): void {
    this.donoService.obterPorId(id).subscribe({
      next: (dono) => {
        this.dono.set({
          nomeCompleto: dono.nomeCompleto,
          email: dono.email,
          telefone: dono.telefone,
          cidade: dono.cidade,
          endereco: dono.endereco || '',
          cep: dono.cep || '',
          estado: dono.estado || '',
          contatoEmergencia: dono.contatoEmergencia || '',
          telefoneEmergencia: dono.telefoneEmergencia || '',
          observacao: dono.observacao || ''
        });
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao carregar dono');
      }
    });
  }

  salvarDono() {
    if (this.validarFormulario()) {
      if (this.donoId) {
        this.atualizar();
      } else {
        this.adicionar();
      }
    }
  }

  private validarFormulario(): boolean {
    const dono = this.dono();
    if (!dono.nomeCompleto || !dono.email || !dono.telefone) {
      alert('Por favor, preencha os campos obrigatórios (Nome Completo, Email, Telefone)');
      return false;
    }
    return true;
  }

  adicionar() {
    const donoData = this.dono();
    const novoDono = new Dono(
      donoData.nomeCompleto!,
      donoData.email!,
      donoData.telefone!,
      donoData.cidade || '',
      undefined,
      donoData.endereco,
      donoData.cep,
      donoData.estado,
      donoData.contatoEmergencia,
      donoData.telefoneEmergencia,
      donoData.observacao
    );
    this.donoService.adicionar(novoDono).subscribe({
      next: (resposta) => {
        this.router.navigate(['/']);
        alert('Dono salvo com sucesso!');
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao salvar dono');
      }
    });
  }

  atualizar() {
    const donoData = this.dono();
    const donoAtualizado = new Dono(
      donoData.nomeCompleto!,
      donoData.email!,
      donoData.telefone!,
      donoData.cidade || '',
      this.donoId,
      donoData.endereco,
      donoData.cep,
      donoData.estado,
      donoData.contatoEmergencia,
      donoData.telefoneEmergencia,
      donoData.observacao
    );
    this.donoService.atualizar(donoAtualizado).subscribe({
      next: (resposta) => {
        this.router.navigate(['/']);
        alert('Dono atualizado com sucesso!');
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao atualizar dono');
      }
    });
  }

  irParaDashboard() {
    this.router.navigate(['/']);
  }

  irParaCadastrarPet() {
    this.router.navigate(['/cadastrar-pet']);
  }
}

