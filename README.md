# TicTacSchedule

[![TicTacSchedule CI](https://github.com/pedro-newlands/schedule_project/actions/workflows/ci.yml/badge.svg)](https://github.com/pedro-newlands/schedule_project/actions)

## Sobre o Projeto
O **TicTacSchedule** é o mvp de um organizador de rotina gamificado, desenvolvido para transformar a gestão de tarefas diárias em uma experiência intuitiva, familiar e prazerosa. Utilizando a mecânica universal do **Jogo da Velha (Tic-Tac-Toe)**, a aplicação foca no equilíbrio essencial entre categorias pré-definidas.

### O Problema: Barreiras Digitais na Terceira Idade
Muitos aplicativos de produtividade atuais falham com o público idoso devido a:
* **Layouts Complexos:** Excesso de botões, menus escondidos e termos técnicos que geram frustração.
* **Falta de Estímulo:** Interfaces puramente utilitárias que não engajam o usuário a retornar.
* **Carga Cognitiva Alta:** Dificuldade em visualizar rapidamente se o dia foi equilibrado ou se uma área vital (como a saúde) foi negligenciada.

### A Solução: Familiaridade e Lúdico
O TicTacSchedule resolve essa "dor" ao adotar um cenário que é parte da memória afetiva e cultural de quase todos os idosos: o **Jogo da Velha**.
* **Interface Afetiva:** Ao marcar uma tarefa, o usuário não apenas "conclui um item", ele "faz uma jogada".
* **Equilíbrio Visual:** As categorias estabelecidas(linhas) e períodos (colunas) são organizados organicamente no grid 3x3.
* **Feedback Positivo:** Completar uma linha ou coluna gera celebrações visuais imediatas, incentivando o usuário a buscar a "Harmonia Absoluta" (completar todo o tabuleiro).

---

## Público-Alvo
* **Idosos:** Que buscam autonomia para gerir seus medicamentos, exercícios e momentos de lazer.
* **Familiares e Cuidadores:** Como uma ferramenta lúdica de apoio para estimular a organização diária.
* **Pessoas Neurodivergentes:** Que se beneficiam de estruturas visuais simples, previsíveis e gamificadas.

---

## Funcionalidades
* **Grid Gamificado:** Marcação de tarefas intuitiva com detecção automática de sequências.
* **Mensagens Dinâmicas:** Incentivos personalizados que variam conforme o progresso do usuário no dia.
* **Arquitetura Profissional:** Código modular, testado e preparado para futuras expansões.

---

## Tecnologias Utilizadas
* **Linguagem:** JavaScript (ES6+ Modules)
* **Estilização:** CSS3 (Grid Layout & Flexbox)
* **Testes Automatizados:** Jest
* **Qualidade de Código:** ESLint (Análise Estática)
* **Integração Contínua:** GitHub Actions (CI)
* **Tooling:** Babel (Transpilação para ambiente de testes)
* **CI automatizado:** GitHub Actions

---

## Como Executar o Projeto

### Pré-requisitos
* **Node.js:** Versão 24 ou superior.

### Instalação
1. Clone este repositório:
   ```bash
   git clone [https://github.com/pedro-newlands/TicTacSchedule.git](https://github.com/SEU_USUARIO/TicTacSchedule.git)

2. Acesse a pasta do projeto: 
   ```bash
   cd schedule_project

3. Instale as dependências:
   ```bash
   npm install

### Execução
Devido ao uso de Módulos JavaScript (ES6), a aplicação requer um ambiente de servidor para contornar políticas de segurança de arquivos locais (CORS).

* **Opção recomendada:** Utilize a extensão **Live Server** no VS Code (clique em "Go Live" na barra inferior).
* **Opção via Terminal:** Execute `npx serve .` e acesse o endereço fornecido.
* **Link do projeto:** [Acesse o TicTacSchedule aqui](https://pedro-newlands.github.io/schedule_project/)

## Qualidade e Testes

1. ### Testes Automatizados (Jest)
   Para garantir que as regras de negócio (vitórias, diagonais e mensagens) funcionem corretamente:
   ```bash
   npm test

2. ### Linting (Análise Estática com ESLint)
   Para verificar a padronização e qualidade do código: 
   ```bash
   npm run lint

## Versionamento Semântico
Este projeto utiliza o padrão **MAJOR.MINOR.PATCH:**
* **Versão Atual:** 1.0.0

***Autor***
* ***Pedro Silveira Newlands Machado***