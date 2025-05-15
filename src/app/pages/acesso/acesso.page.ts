import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AcessoService } from '../../services/acesso.service';

interface Acesso {
  funcionarioId: string;
  horario: string;
  quantidade: number;
}

@Component({
  selector: 'app-acesso',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: 'acesso.page.html',
  styleUrls: ['acesso.page.scss'],
})
export class AcessoPage implements OnInit {

  funcionarioId: string = '';
  horario: string = '';
  quantidade: number = 1;

  acessos: Acesso[] = [];

  constructor(private acessoService: AcessoService) {}

  ngOnInit() {
    this.carregarAcessos();
  }

  registrarAcesso() {
    this.acessoService.registrarAcesso(this.funcionarioId, this.horario, this.quantidade)
      .subscribe({
        next: () => {
          alert('Acesso registrado com sucesso!');
          this.resetForm();
          this.carregarAcessos();
        },
        error: () => {
          alert('Erro ao registrar acesso. Tente novamente.');
        }
      });
  }

  resetForm() {
    this.funcionarioId = '';
    this.horario = '';
    this.quantidade = 1;
  }

  carregarAcessos() {
    this.acessoService.listarAcessos().subscribe(data => {
      this.acessos = data;
    });
  }

  formatarHorario(horarioISO: string): string {
  const data = new Date(horarioISO);
  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', { hour12: false }); 
  return `${dataFormatada} - ${horaFormatada}`;
}

}
