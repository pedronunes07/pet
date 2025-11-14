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
    // Cria um objeto simples sem o id para enviar ao backend
    const novoDono: Omit<Dono, 'id'> = {
      nomeCompleto: donoData.nomeCompleto!,
      email: donoData.email!,
      telefone: donoData.telefone!,
      cidade: donoData.cidade || '',
      endereco: donoData.endereco,
      cep: donoData.cep,
      estado: donoData.estado,
      contatoEmergencia: donoData.contatoEmergencia,
      telefoneEmergencia: donoData.telefoneEmergencia,
      observacao: donoData.observacao
    };
    this.donoService.adicionar(novoDono).subscribe({
      next: (resposta) => {
        alert('Dono salvo com sucesso!');
        this.router.navigate(['/']);
      },
      error: (erro) => {
        console.error('Erro completo:', erro);
        const mensagem = erro?.error?.message || erro?.message || 'Erro ao salvar dono';
        alert(`Erro ao salvar dono: ${mensagem}`);
      }
    });
  }

  atualizar() {
    const donoData = this.dono();
    // Cria um objeto simples com o id para atualizar
    const donoAtualizado: Dono = {
      id: this.donoId!,
      nomeCompleto: donoData.nomeCompleto!,
      email: donoData.email!,
      telefone: donoData.telefone!,
      cidade: donoData.cidade || '',
      endereco: donoData.endereco,
      cep: donoData.cep,
      estado: donoData.estado,
      contatoEmergencia: donoData.contatoEmergencia,
      telefoneEmergencia: donoData.telefoneEmergencia,
      observacao: donoData.observacao
    };
    this.donoService.atualizar(donoAtualizado).subscribe({
      next: (resposta) => {
        alert('Dono atualizado com sucesso!');
        this.router.navigate(['/']);
      },
      error: (erro) => {
        console.error('Erro completo:', erro);
        const mensagem = erro?.error?.message || erro?.message || 'Erro ao atualizar dono';
        alert(`Erro ao atualizar dono: ${mensagem}`);
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

