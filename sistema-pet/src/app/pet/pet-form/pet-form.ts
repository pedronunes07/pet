import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PetService } from '../../service/pet-service';
import { DonoService } from '../../service/dono-service';
import { Pet, Vacina } from '../../model/pet';
import { Dono } from '../../model/dono';

@Component({
  selector: 'app-cadastrar-pet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.css'
})
export class CadastrarPet implements OnInit {
  pet = signal<Partial<Pet>>({
    nome: '',
    especie: '',
    raca: '',
    idade: 0,
    peso: '',
    cor: '',
    sexo: '',
    vacinado: 'Não',
    donoId: undefined,
    vacinas: [],
    observacoes: '',
    observacoesMedicas: '',
    fotos: []
  });
  petId?: number;
  private donoService = inject(DonoService);
  private petService = inject(PetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  donos = computed(() => {
    try {
      return this.donoService.getDonos()();
    } catch (error) {
      return [];
    }
  });

  constructor() {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petId = +id;
      this.carregarPet(this.petId);
    }
  }

  carregarPet(id: number): void {
    this.petService.obterPorId(id).subscribe({
      next: (pet) => {
        this.pet.set({
          nome: pet.nome,
          especie: pet.especie,
          raca: pet.raca || '',
          idade: pet.idade || 0,
          peso: pet.peso || '',
          cor: pet.cor || '',
          sexo: pet.sexo || '',
          vacinado: pet.vacinado || 'Não',
          donoId: pet.donoId,
          vacinas: pet.vacinas || [],
          observacoes: pet.observacoes || '',
          observacoesMedicas: pet.observacoesMedicas || '',
          fotos: pet.fotos || []
        });
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao carregar pet');
      }
    });
  }

  adicionarVacina() {
    const novaVacina: Vacina = {
      nomeVacina: '',
      dataAplicacao: '',
      proximaDose: '',
      nomeVeterinario: ''
    };
    
    this.pet.update(pet => ({
      ...pet,
      vacinas: [...(pet.vacinas || []), novaVacina]
    }));
  }

  removerVacina(index: number) {
    this.pet.update(pet => ({
      ...pet,
      vacinas: (pet.vacinas || []).filter((_, i) => i !== index)
    }));
  }

  atualizarVacina(index: number, campo: keyof Vacina, valor: string) {
    this.pet.update(pet => {
      const vacinas = [...(pet.vacinas || [])];
      if (vacinas[index]) {
        vacinas[index] = { ...vacinas[index], [campo]: valor };
      }
      return { ...pet, vacinas };
    });
  }

  atualizarDonoId(valor: string) {
    const donoId = valor ? +valor : undefined;
    this.pet.update(pet => ({ ...pet, donoId }));
  }

  atualizarCampo(campo: string, valor: any) {
    this.pet.update(pet => ({ ...pet, [campo]: valor }));
  }

  adicionarFoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.pet.update(pet => ({
            ...pet,
            fotos: [...(pet.fotos || []), e.target.result]
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  salvarPet() {
    if (this.validarFormulario()) {
      const petData = this.pet();
      if (this.petId) {
        this.atualizarPet();
      } else {
        this.adicionarPet();
      }
    }
  }

  adicionarPet() {
    const petData = this.pet();
    // Remove campos undefined e cria objeto limpo para enviar
    const novoPet: Omit<Pet, 'id'> = {
      nome: petData.nome!,
      especie: petData.especie!,
      raca: petData.raca || '',
      idade: petData.idade || 0,
      donoId: petData.donoId,
      peso: petData.peso,
      cor: petData.cor,
      sexo: petData.sexo,
      vacinado: petData.vacinado,
      vacinas: petData.vacinas?.filter(v => v.nomeVacina || v.dataAplicacao) || [],
      observacoes: petData.observacoes,
      observacoesMedicas: petData.observacoesMedicas,
      fotos: petData.fotos
    };
    this.petService.adicionar(novoPet).subscribe({
      next: (resposta) => {
        alert('Pet cadastrado com sucesso!');
        this.router.navigate(['/']);
      },
      error: (erro) => {
        console.error('Erro completo:', erro);
        const mensagem = erro?.error?.message || erro?.message || 'Erro ao salvar pet';
        alert(`Erro ao salvar pet: ${mensagem}`);
      }
    });
  }

  atualizarPet() {
    const petData = this.pet();
    // Cria objeto limpo com todos os campos necessários
    const petAtualizado: Pet = {
      id: this.petId!,
      nome: petData.nome!,
      especie: petData.especie!,
      raca: petData.raca || '',
      idade: petData.idade || 0,
      donoId: petData.donoId,
      peso: petData.peso,
      cor: petData.cor,
      sexo: petData.sexo,
      vacinado: petData.vacinado,
      vacinas: petData.vacinas?.filter(v => v.nomeVacina || v.dataAplicacao) || [],
      observacoes: petData.observacoes,
      observacoesMedicas: petData.observacoesMedicas,
      fotos: petData.fotos
    };
    
    this.petService.atualizar(petAtualizado).subscribe({
      next: (resposta) => {
        alert('Pet atualizado com sucesso!');
        this.router.navigate(['/']);
      },
      error: (erro) => {
        console.error('Erro completo:', erro);
        const mensagem = erro?.error?.message || erro?.message || 'Erro ao atualizar pet';
        alert(`Erro ao atualizar pet: ${mensagem}`);
      }
    });
  }

  private validarFormulario(): boolean {
    const pet = this.pet();
    if (!pet.nome || !pet.especie || !pet.donoId) {
      alert('Por favor, preencha os campos obrigatórios (Nome, Espécie, Dono)');
      return false;
    }
    return true;
  }

  irParaDashboard() {
    this.router.navigate(['/']);
  }

  irParaCadastrarDono() {
    this.router.navigate(['/cadastrar-dono']);
  }
}
