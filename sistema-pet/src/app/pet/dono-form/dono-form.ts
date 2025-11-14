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
    const erros: string[] = [];
    
    if (!dono.nomeCompleto || dono.nomeCompleto.trim() === '') {
      erros.push('Nome Completo é obrigatório');
    }
    if (!dono.email || dono.email.trim() === '') {
      erros.push('Email é obrigatório');
    } else if (!this.validarEmail(dono.email)) {
      erros.push('Email inválido');
    }
    if (!dono.telefone || dono.telefone.trim() === '') {
      erros.push('Telefone é obrigatório');
    }
    
    if (erros.length > 0) {
      alert('Por favor, corrija os seguintes erros:\n\n' + erros.join('\n'));
      return false;
    }
    return true;
  }
  
  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  adicionar() {
    const donoData = this.dono();
    // Cria um objeto simples sem o id para enviar ao backend
    // O serviço vai remover campos undefined/vazios automaticamente
    const novoDono: any = {
      nomeCompleto: donoData.nomeCompleto!.trim(),
      email: donoData.email!.trim(),
      telefone: donoData.telefone!.trim()
    };
    
    // Adiciona campos opcionais apenas se tiverem valor
    if (donoData.cidade && donoData.cidade.trim()) {
      novoDono.cidade = donoData.cidade.trim();
    }
    if (donoData.endereco && donoData.endereco.trim()) {
      novoDono.endereco = donoData.endereco.trim();
    }
    if (donoData.cep && donoData.cep.trim()) {
      novoDono.cep = donoData.cep.trim();
    }
    if (donoData.estado && donoData.estado.trim()) {
      novoDono.estado = donoData.estado.trim();
    }
    if (donoData.contatoEmergencia && donoData.contatoEmergencia.trim()) {
      novoDono.contatoEmergencia = donoData.contatoEmergencia.trim();
    }
    if (donoData.telefoneEmergencia && donoData.telefoneEmergencia.trim()) {
      novoDono.telefoneEmergencia = donoData.telefoneEmergencia.trim();
    }
    if (donoData.observacao && donoData.observacao.trim()) {
      novoDono.observacao = donoData.observacao.trim();
    }
    
    console.log('Dados do formulário antes de enviar:', novoDono);
    
    this.donoService.adicionar(novoDono).subscribe({
      next: (resposta) => {
        alert('Dono salvo com sucesso!');
        this.router.navigate(['/']);
      },
      error: (erro) => {
        console.error('Erro completo no componente:', erro);
        let mensagem = 'Erro ao salvar dono';
        
        // Verifica se é erro de conexão
        if (erro.status === 0 || erro.status === undefined) {
          mensagem = 'Não foi possível conectar à API. Verifique se a API está rodando em http://localhost:5281';
        } else if (erro?.error) {
          // Extrai mensagens de validação do ModelState (ASP.NET Core)
          if (erro.error.errors) {
            const validationErrors: string[] = [];
            for (const key in erro.error.errors) {
              if (erro.error.errors[key]) {
                validationErrors.push(`${key}: ${erro.error.errors[key].join(', ')}`);
              }
            }
            if (validationErrors.length > 0) {
              mensagem = 'Erros de validação:\n' + validationErrors.join('\n');
            } else if (typeof erro.error === 'string') {
              mensagem = erro.error;
            } else if (erro.error.message) {
              mensagem = erro.error.message;
            } else if (erro.error.title) {
              mensagem = erro.error.title;
            }
          } else if (typeof erro.error === 'string') {
            mensagem = erro.error;
          } else if (erro.error.message) {
            mensagem = erro.error.message;
          } else if (erro.error.title) {
            mensagem = erro.error.title;
          }
        } else if (erro?.message) {
          mensagem = erro.message;
        }
        
        alert(`Erro ao salvar dono: ${mensagem}\n\nVerifique o console para mais detalhes.`);
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
        let mensagem = 'Erro ao atualizar dono';
        
        // Verifica se é erro de conexão
        if (erro.status === 0 || erro.status === undefined) {
          mensagem = 'Não foi possível conectar à API. Verifique se a API está rodando em http://localhost:5281';
        } else if (erro?.error) {
          // Extrai mensagens de validação do ModelState (ASP.NET Core)
          if (erro.error.errors) {
            const validationErrors: string[] = [];
            for (const key in erro.error.errors) {
              if (erro.error.errors[key]) {
                validationErrors.push(`${key}: ${erro.error.errors[key].join(', ')}`);
              }
            }
            if (validationErrors.length > 0) {
              mensagem = 'Erros de validação:\n' + validationErrors.join('\n');
            } else if (typeof erro.error === 'string') {
              mensagem = erro.error;
            } else if (erro.error.message) {
              mensagem = erro.error.message;
            } else if (erro.error.title) {
              mensagem = erro.error.title;
            }
          } else if (typeof erro.error === 'string') {
            mensagem = erro.error;
          } else if (erro.error.message) {
            mensagem = erro.error.message;
          } else if (erro.error.title) {
            mensagem = erro.error.title;
          }
        } else if (erro?.message) {
          mensagem = erro.message;
        }
        
        alert(`Erro ao atualizar dono: ${mensagem}\n\nVerifique o console para mais detalhes.`);
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

