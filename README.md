# 🚚 Rota Certa Pro

Aplicação mobile-first para cálculo, registro e acompanhamento de rotas de entregadores.

O projeto foi criado a partir de uma necessidade real de trabalho em logística: organizar rotas, acompanhar quilometragem, valores recebidos, períodos de fechamento e histórico de trabalho de forma simples e rápida.

Os dados são armazenados localmente no dispositivo, sem necessidade de backend para o uso principal da aplicação.

![Dashboard do Rota Certa Pro](docs/images/dashboard.png)

---

## 🎯 Objetivo do projeto

O Rota Certa Pro foi desenvolvido para ajudar profissionais que trabalham com entregas a organizar sua rotina operacional.

A aplicação permite acompanhar:

- rotas realizadas;
- quilometragem;
- quantidade de endereços;
- valores recebidos;
- períodos de fechamento;
- histórico de rotas;
- relatórios;
- backups dos dados.

O foco do projeto é manter uma experiência simples, rápida e adequada ao uso no celular durante a rotina de trabalho.

---

## ✨ Funcionalidades atuais

- cálculo de rotas AM e PM;
- regras específicas para domingos;
- registro de quilometragem;
- registro da quantidade de endereços;
- campo para observações;
- cálculo dos valores da rota;
- histórico de rotas;
- dashboard com indicadores;
- fechamento diário;
- fechamento semanal;
- fechamento quinzenal;
- fechamento mensal;
- exportação de dados em CSV;
- geração de relatórios em PDF;
- backup e restauração em JSON;
- tema claro;
- tema escuro;
- opção de seguir o tema do sistema;
- armazenamento local dos dados.

---

## 📱 Interface

O projeto foi desenvolvido com abordagem mobile-first.

### Dashboard

![Dashboard](docs/images/dashboard.png)

### Cálculo de rota

![Calcular rota](docs/images/calcular-rota.png)

### Histórico

![Histórico](docs/images/historico.png)

### Configurações

![Configurações](docs/images/configuracoes.png)

---

## 🛠️ Tecnologias

O projeto utiliza:

- React 19;
- TypeScript;
- Vite;
- Tailwind CSS;
- Capacitor;
- jsPDF;
- jsPDF AutoTable;
- Vitest;
- Lucide React.

---

## 🧪 Qualidade e testes

O projeto possui testes automatizados para partes importantes da aplicação, incluindo:

- regras de cálculo;
- períodos de fechamento;
- persistência local;
- exportação de arquivos;
- geração de PDF;
- estatísticas;
- componentes.

Para validar o projeto antes de enviar alterações:

```bash
npm test -- --run
npm run lint
npm run build## 🧪 Qualidade e testes

O projeto possui testes automatizados para partes importantes da aplicação, incluindo:

- regras de cálculo;
- períodos de fechamento;
- persistência local;
- exportação de arquivos;
- geração de PDF;
- estatísticas;
- componentes.

Para validar o projeto antes de enviar alterações:

```bash
npm test -- --run
npm run lint
npm run build
