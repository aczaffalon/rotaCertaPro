# 🚚 Rota Certa Pro

Aplicação mobile-first para cálculo, registro e acompanhamento de rotas de entregadores.

O **Rota Certa Pro** nasceu de uma necessidade real encontrada durante o trabalho com entregas: acompanhar quilômetros percorridos, quantidade de entregas, valores recebidos e períodos de fechamento sem depender de cálculos manuais, anotações espalhadas ou planilhas.

O objetivo é transformar essas informações em uma ferramenta rápida, simples e prática para o dia a dia de entregadores autônomos.

<p align="center">
  <img 
    src="docs/images/dashboard.png" 
    alt="Dashboard do Rota Certa Pro" 
    width="320"
  >
</p>

---

## 🎯 Sobre o projeto

Durante uma rotina de entregas, diversas informações precisam ser registradas e conferidas constantemente:

- quilômetros percorridos;
- quantidade de endereços visitados;
- quantidade de entregas;
- período da rota;
- valores recebidos;
- fechamento diário, semanal, quinzenal ou mensal;
- histórico das rotas realizadas.

O **Rota Certa Pro** foi desenvolvido para simplificar esse processo.

A proposta é permitir que o entregador registre uma rota rapidamente e tenha uma visão clara do seu trabalho sem transformar a aplicação em um sistema complexo.

> **Registrar rápido. Consultar rápido. Entender os resultados com clareza.**

---

## ✨ Funcionalidades

### 🧮 Cálculo de rotas

Permite registrar informações da rota e utilizar as regras de pagamento configuradas para calcular os valores correspondentes.

Entre os dados utilizados estão:

- data da rota;
- nome da rota;
- quilômetros percorridos;
- endereços visitados;
- período da operação;
- regras específicas de pagamento.

---

### 🕐 Períodos AM e PM

O aplicativo permite diferenciar rotas realizadas em períodos diferentes do dia.

Isso permite trabalhar com operações que utilizam regras distintas para:

- período da manhã;
- período da tarde;
- domingos;
- condições especiais de pagamento.

---

### 📆 Fechamentos configuráveis

O Rota Certa Pro está sendo preparado para atender operações com diferentes ciclos de pagamento.

O usuário pode trabalhar com períodos:

- diário;
- semanal;
- quinzenal;
- mensal.

Também é possível configurar o dia utilizado como início da semana.

<p align="center">
  <img 
    src="docs/images/configuracoes.png" 
    alt="Configurações do Rota Certa Pro" 
    width="280"
  >
</p>

---

## 📊 Dashboard

A tela inicial apresenta rapidamente os principais indicadores da operação.

Atualmente é possível acompanhar informações como:

- ganhos do dia;
- quantidade de rotas salvas;
- quilômetros registrados;
- quantidade de entregas;
- dados acumulados do histórico.

O objetivo do dashboard é mostrar apenas informações realmente úteis para o entregador.

<p align="center">
  <img 
    src="docs/images/dashboard.png" 
    alt="Painel principal do Rota Certa Pro" 
    width="280"
  >
</p>

---

## 🛣️ Registro de rota

A interface de cálculo foi pensada principalmente para dispositivos móveis.

O entregador consegue informar rapidamente os dados necessários sem navegar por várias telas.

<p align="center">
  <img 
    src="docs/images/calcular-rota.png" 
    alt="Cadastro e cálculo de uma rota" 
    width="280"
  >
</p>

---

## 🗂️ Histórico

As rotas registradas ficam disponíveis para consulta posterior.

O histórico permite acompanhar os registros realizados e visualizar os resultados acumulados da operação.

Também existem opções de consulta por período:

- diário;
- semanal;
- quinzenal;
- mensal.

<p align="center">
  <img 
    src="docs/images/historico.png" 
    alt="Histórico de rotas do Rota Certa Pro" 
    width="280"
  >
</p>

---

## 📤 Exportação

O aplicativo possui recursos para exportação das informações registradas.

Atualmente são previstas opções como:

- CSV;
- PDF.

Isso permite utilizar os dados fora da aplicação para conferência, organização ou armazenamento.

---

## 📱 Mobile-first

O Rota Certa Pro foi desenvolvido considerando principalmente o uso pelo celular durante uma rotina de trabalho.

Por isso, a experiência prioriza:

- poucos toques;
- campos grandes;
- botões de fácil acesso;
- interface responsiva;
- navegação simples;
- leitura rápida das informações;
- baixa complexidade operacional.

A intenção não é transformar o aplicativo em um ERP.

O foco continua sendo uma ferramenta prática para o entregador.

---

## 🛠️ Tecnologias utilizadas

O projeto utiliza tecnologias modernas do ecossistema web:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- Capacitor;
- jsPDF;
- HTML5;
- CSS3;
- JavaScript.

---

## 🧠 Conceitos aplicados

O desenvolvimento do projeto envolve conceitos como:

- componentização;
- gerenciamento de estado;
- persistência de dados;
- regras de negócio;
- cálculos financeiros;
- responsividade;
- desenvolvimento mobile-first;
- formulários e validações;
- geração de relatórios;
- exportação de dados;
- organização de código;
- refatoração;
- UX/UI;
- Git e GitHub.

---

## 🏗️ Arquitetura

O projeto está sendo evoluído para manter as regras de negócio separadas da interface sempre que possível.

A organização busca responsabilidades como:

```text
src/
├── components/
├── hooks/
├── services/
├── utils/
├── types/
└── context/
```

O objetivo é melhorar:

- manutenção;
- legibilidade;
- reutilização;
- testes;
- evolução das regras de negócio;
- implementação de novas funcionalidades.

A prioridade continua sendo evitar complexidade desnecessária.

---

## 💰 Próxima evolução: rentabilidade

Uma das próximas etapas do Rota Certa Pro será evoluir do simples acompanhamento de faturamento para uma análise mais completa da operação.

O veículo é uma das principais ferramentas de trabalho do entregador.

Por isso, a aplicação deverá considerar custos como:

- combustível;
- manutenção;
- troca de óleo;
- pneus;
- pedágios;
- estacionamento;
- seguro;
- impostos do veículo;
- outros custos operacionais.

A ideia é permitir uma análise semelhante a:

```text
Faturamento bruto
       ↓
Combustível
       ↓
Custos diretos
       ↓
Reserva para manutenção
       ↓
Resultado operacional estimado
```

Também estão previstos indicadores como:

- faturamento por quilômetro;
- custo por quilômetro;
- resultado por quilômetro;
- margem operacional;
- custo médio do veículo.

---

## 🚙 Gestão do veículo

Está planejada uma área específica para o veículo utilizado nas entregas.

Entre as informações previstas estão:

- veículo;
- tipo de combustível;
- consumo médio;
- preço médio do combustível;
- quilometragem;
- despesas;
- manutenção;
- custo estimado por quilômetro.

O objetivo é transformar dados operacionais em informações úteis para tomada de decisão.

---

## 🗺️ Roadmap

### Em desenvolvimento / planejado

- [x] cálculo de rotas;
- [x] histórico de registros;
- [x] dashboard;
- [x] fechamento diário;
- [x] fechamento semanal;
- [x] fechamento quinzenal;
- [x] fechamento mensal;
- [x] exportação CSV;
- [x] exportação PDF;
- [x] configurações da operação;
- [x] interface mobile-first;
- [ ] cadastro do veículo;
- [ ] despesas do veículo;
- [ ] controle de abastecimentos;
- [ ] custo de combustível por rota;
- [ ] custo por quilômetro;
- [ ] reserva para manutenção;
- [ ] resultado operacional estimado;
- [ ] análise de rentabilidade;
- [ ] relatórios financeiros avançados;
- [ ] backup e restauração;
- [ ] múltiplos veículos;
- [ ] sincronização em nuvem.

---

## 🚀 Executando o projeto

### Pré-requisitos

Tenha instalado:

```text
Node.js
npm
Git
```

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd NOME_DO_REPOSITORIO
```

Instale as dependências:

```bash
npm install
```

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

O Vite mostrará no terminal o endereço local da aplicação.

Normalmente:

```text
http://localhost:5173
```

---

## 📦 Build

Para gerar a versão de produção:

```bash
npm run build
```

---

## 🔒 Persistência de dados

O projeto foi desenvolvido considerando funcionamento local e disponibilidade das informações mesmo sem depender constantemente de um servidor externo.

Uma das prioridades da evolução da aplicação é manter compatibilidade com registros anteriores durante mudanças na estrutura de dados.

---

## 🎓 Projeto de portfólio

O Rota Certa Pro também faz parte da minha evolução profissional como desenvolvedor.

A diferença deste projeto para um exercício tradicional de curso é que ele nasceu de um problema que encontrei trabalhando diretamente com entregas.

O processo envolve:

```text
Problema real
     ↓
Identificação da necessidade
     ↓
Desenvolvimento da solução
     ↓
Uso no ambiente real
     ↓
Identificação de novas necessidades
     ↓
Refatoração e evolução
```

O projeto continua sendo utilizado como ambiente de aprendizado e desenvolvimento de conhecimentos relacionados a desenvolvimento de software, produto e resolução de problemas reais.

---

## 👨‍💻 Autor

**Adriano Zaffalon**

Formado em Análise e Desenvolvimento de Sistemas, com experiência em suporte técnico e desenvolvimento de projetos próprios.

Atualmente aprofundando conhecimentos em desenvolvimento de software, React, TypeScript, Python e Inteligência Artificial.

GitHub:

[@aczaffalon](https://github.com/aczaffalon)

---

## 📌 Status do projeto

🚧 **Em desenvolvimento ativo**

O Rota Certa Pro continua recebendo melhorias conforme novas necessidades são identificadas durante o uso da aplicação.

---

## 💡 Motivação

Mais do que desenvolver uma calculadora, o objetivo do Rota Certa Pro é transformar experiência prática em logística em uma solução tecnológica útil.

O projeto representa a combinação entre:

**experiência real + identificação de problema + desenvolvimento de software + evolução de produto.**