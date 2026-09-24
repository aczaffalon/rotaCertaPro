# Rota Certa Pro

Aplicação mobile-first para calcular, registrar e acompanhar rotas de entregadores. Os dados ficam no dispositivo, permitindo consultar ganhos, quilometragem e fechamentos mesmo sem um serviço externo.

![Dashboard do Rota Certa Pro](docs/images/dashboard.png)

## O que já está disponível

- Cálculo de rotas AM e PM, inclusive regras para domingos.
- Registro de quilometragem, endereços, observações e valores.
- Dashboard com ganhos, rotas, quilometragem e lucro estimado.
- Histórico, fechamentos diário, semanal, quinzenal e mensal.
- Exportação de CSV e PDF; backup e restauração local.
- Tema claro, escuro ou do sistema.
- Módulo **Meu Veículo**: cadastro básico, hodômetro, consumo, combustível e custo estimado por km.

## Tecnologias

React 19, TypeScript, Vite, Tailwind CSS, Capacitor e jsPDF.

## Executar localmente

Pré-requisitos: Node.js 22+ e npm.

```bash
git clone https://github.com/aczaffalon/rotaCertaPro.git
cd rotaCertaPro
npm ci
npm run dev
```

O Vite exibirá a URL local no terminal. Para validar a aplicação antes de enviar alterações:

```bash
npm test -- --run
npm run lint
npm run build
```

## Android

O projeto usa Capacitor. Credenciais de assinatura são exclusivamente locais: crie `android/keystore.properties` a partir das credenciais do seu keystore. Esse arquivo e os arquivos de chave (`.jks`, `.keystore` e `.p12`) não devem ser versionados.

## Privacidade

Rotas, configurações e dados do veículo são armazenados localmente no dispositivo. O usuário pode exportar e importar um backup JSON manualmente.

## Próximas evoluções

- Abastecimentos e despesas do veículo.
- Manutenções e reserva de custo por km.
- Rentabilidade por rota e por período.
- Suporte a múltiplos veículos.

## Status

Em desenvolvimento ativo.
