# README - Instalação e Uso do Playwright

Este guia orienta os professores a instalar e utilizar o Playwright para executar os testes automatizados no repositório [horario-iscte-grupo-2-automation](https://github.com/BinattiMateus5511/horario-iscte-grupo-2-automation/).

## Pré-requisitos

Antes de começar, verifique se você possui os seguintes itens instalados:

1. **Node.js** (versão 16 ou superior): [Download Node.js](https://nodejs.org/)
2. **Git**: [Download Git](https://git-scm.com/)
3. **Navegadores Compatíveis** (Chromium, Firefox e WebKit).

## Instalação

1. **Clone o Repositório:**
   Abra o terminal ou prompt de comando e execute:
   ```bash
   git clone https://github.com/BinattiMateus5511/horario-iscte-grupo-2-automation.git
   ```

2. **Acesse o Diretório do Projeto:**
   ```bash
   cd horario-iscte-grupo-2-automation
   ```

3. **Instale as Dependências:**
   Execute o comando abaixo para instalar as dependências necessárias:
   ```bash
   npm install
   ```

4. **Instale os Navegadores:**
   O Playwright inclui um comando para baixar automaticamente os navegadores necessários:
   ```bash
   npx playwright install
   ```

## Executando os Testes

1. **Comando de Teste:**
   Para rodar todos os testes, utilize o seguinte comando:
   ```bash
   npx playwright test
   ```

2. **Executar um Teste Específico:**
   Se você deseja executar um único teste, especifique o arquivo:
   ```bash
   npx playwright test caminho/para/o/arquivo.spec.ts
   ```

3. **Abrir o Test Runner Interativo:**
   O Playwright fornece uma interface interativa para execução e depuração de testes:
   ```bash
   npx playwright test --ui
   ```

## Estrutura do Projeto

- **/tests**: Contém os arquivos de teste.
- **/playwright.config.ts**: Arquivo de configuração do Playwright.
- **/reports**: Diretório onde os relatórios de execução de testes são gerados.

## Recursos Adicionais

1. **Capturas de Tela e Logs:**
   Após a execução dos testes, o Playwright gera capturas de tela e logs para análise de falhas. Esses arquivos estão disponíveis no diretório `playwright-report`.

2. **Relatórios HTML:**
   Execute o comando abaixo para abrir o relatório gerado:
   ```bash
   npx playwright show-report
   ```

## Dicas

- Antes de rodar os testes, garanta que o backend do sistema esteja funcionando.
- Use o comando `npx playwright test --debug` para depurar os testes interativamente.

Para dúvidas ou problemas, consulte a documentação oficial do Playwright: [Playwright Docs](https://playwright.dev/).

