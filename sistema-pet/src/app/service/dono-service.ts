import { inject, Injectable, signal } from '@angular/core';
import { Dono } from '../model/dono';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', 
})
export class DonoService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/dono`;
  private donosSignal = signal<Dono[]>([]);

  constructor() {
    // Carrega donos apenas se a API estiver disponível
    try {
      this.carregarDonos();
    } catch (error) {
      console.warn('Erro ao inicializar carregamento de donos:', error);
    }
  }

  getDonos() {
    return this.donosSignal;
  }

  private carregarDonos() {
    this.http.get<Dono[]>(this.API).subscribe({
      next: (donos: Dono[]) => this.donosSignal.set(donos),
      error: (erro: any) => {
        console.error('Erro ao carregar donos:', erro);
        this.donosSignal.set([]);
      }
    });
  }

  listar(): Observable<Dono[]> {
    return this.http.get<Dono[]>(this.API).pipe(
      tap((donos: Dono[]) => this.donosSignal.set(donos))
    );
  }

  adicionar(dono: Dono | Omit<Dono, 'id'>): Observable<Dono> {
    // Remove o id se existir
    let donoSemId = 'id' in dono ? (({ id, ...rest }) => rest)(dono) : dono;
    
    // Cria objeto limpo
    const donoLimpo: any = {};
    const camposObrigatorios = ['nomeCompleto', 'email', 'telefone', 'cidade'];
    
    for (const key in donoSemId) {
      if (donoSemId.hasOwnProperty(key)) {
        const value = (donoSemId as any)[key];
        
        // Ignora undefined e null
        if (value === undefined || value === null) {
          continue;
        }
        
        // Mantém campos obrigatórios mesmo se vazios
        if (camposObrigatorios.includes(key)) {
          donoLimpo[key] = value || '';
          continue;
        }
        
        // Para campos opcionais, remove strings vazias
        if (typeof value === 'string' && value === '') {
          continue;
        }
        
        // Inclui o valor
        donoLimpo[key] = value;
      }
    }
    
    console.log('=== ENVIANDO DONO PARA API ===');
    console.log('URL:', this.API);
    console.log('Dados:', JSON.stringify(donoLimpo, null, 2));
    
    return this.http.post<Dono>(this.API, donoLimpo).pipe(
      tap({
        next: (novoDono: Dono) => {
          console.log('✅ Dono salvo com sucesso:', novoDono);
          const donosAtuais = this.donosSignal();
          this.donosSignal.set([...donosAtuais, novoDono]);
        },
        error: (erro: any) => {
          console.error('❌ ERRO AO ADICIONAR DONO');
          console.error('Erro completo:', erro);
          console.error('Status HTTP:', erro?.status);
          console.error('Status Text:', erro?.statusText);
          console.error('URL:', erro?.url);
          if (erro?.error) {
            console.error('Resposta do servidor:', JSON.stringify(erro.error, null, 2));
          }
        }
      })
    );
  }

  atualizar(dono: Dono): Observable<Dono> {
    return this.http.put<Dono>(`${this.API}/${dono.id}`, dono).pipe(
      tap((donoAtualizado: Dono) => {
        const donosAtuais = this.donosSignal();
        const index = donosAtuais.findIndex((d: Dono) => d.id === dono.id);
        if (index !== -1) {
          donosAtuais[index] = donoAtualizado;
          this.donosSignal.set([...donosAtuais]);
        }
      })
    );
  }

  excluirDono(id: number) {
    this.http.delete(`${this.API}/${id}`).subscribe({
      next: () => {
        const donosAtuais = this.donosSignal();
        this.donosSignal.set(donosAtuais.filter((d: Dono) => d.id !== id));
      },
      error: (erro: any) => {
        console.error('Erro ao excluir dono:', erro);
        alert('Erro ao excluir dono');
      }
    });
  }

  obterPorId(id: number): Observable<Dono> {
    return this.http.get<Dono>(`${this.API}/${id}`);
  }

  getDonoById(id: number): Dono | undefined {
    return this.donosSignal().find((d: Dono) => d.id === id);
  }
}

