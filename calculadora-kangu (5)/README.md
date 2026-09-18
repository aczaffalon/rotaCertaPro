# Rota Certa

Aplicativo Android para calcular ganhos de rotas, acompanhar quilômetros e organizar entregas.

## Desenvolvimento local

Requisitos: Node.js, Java 17 e Android SDK.

```bash
npm install
npm run dev
```

O app armazena cálculos e configurações localmente no aparelho. Não há conta de usuário nem servidor próprio. A política está disponível em [privacy.html](public/privacy.html) e dentro de Configurações no aplicativo.

## Checklist de publicação na Google Play

- [x] Definir o e-mail de suporte `aczaffalon@gmail.com` em `src/components/PrivacyPolicyModal.tsx` e `public/privacy.html`.
- [ ] Publicar a página `privacy.html` em uma URL pública HTTPS e informar essa URL no Play Console.
- [ ] Revisar a política de privacidade e confirmar que ela descreve apenas armazenamento local e backup manual.
- [ ] Preencher o formulário de Segurança dos Dados no Play Console de acordo com o comportamento real do app.
- [ ] Conferir ícone, nome “Rota Certa”, capturas e identidade visual no pacote Android.
- [ ] Gerar o build web e sincronizar o Android:

  ```bash
  npm run build
  npx cap sync android
  ```

- [ ] Gerar o Android App Bundle assinado:

  ```bash
  android/gradlew.bat -p android :app:bundleRelease
  ```

- [ ] Confirmar que `android/keystore.properties` e `android/app/rota-certa-release.jks` estão disponíveis localmente e em backup seguro.
- [ ] Instalar e testar o AAB em um dispositivo Android, incluindo cálculo, histórico, backup, PDF e compartilhamento.
- [ ] Criar um teste fechado no Play Console e adicionar os testadores.
- [ ] Observar estabilidade, permissões e feedback durante o teste fechado.
- [ ] Enviar o AAB para revisão e concluir o lançamento na Google Play.

## Dados e suporte antes do lançamento

O app não possui login, coleta remota ou servidor próprio. O usuário pode exportar manualmente histórico e configurações por backup, PDF ou CSV. O contato de suporte informado é `aczaffalon@gmail.com`; mantenha a política em uma URL HTTPS acessível sem login.
