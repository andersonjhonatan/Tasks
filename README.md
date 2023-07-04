# Task+

Criação de Tarefas na qua você possa adicionar e compartilhar com seus amigos!

![Imagem do Projeto](Imagens/task.png)

## Tecnologias utilizadas
- Next.js
- TypeScript
- Firebase
- NextAuth.js

## Pré-requisitos
Antes de começar, certifique-se de ter instalado o seguinte:

- Node.js (versão 18.16.1)
- npm ou yarn

## Instalação
Siga os passos abaixo para instalar e configurar o projeto:

1. Clone o repositório do projeto:
   ```bash
   git clone https://github.com/seu-usuario/seu-projeto.git
   cd seu-projeto


## Instale as dependências:
npm install
# ou
yarn


## CConfiguração do Firebase
Crie um projeto no Firebase Console.
Copie as credenciais do projeto (apiKey, authDomain, projectId, etc.).
Cole as credenciais no arquivo de configuração do Firebase (src/firebaseConfig.ts).

## Configuração do NextAuth.js
Defina as provedoras de autenticação que você deseja utilizar (ex: Google, GitHub, etc.) no arquivo src/pages/api/auth/[...nextauth].ts.
Configure as informações de autenticação para cada provedor no arquivo de configuração do Firebase (src/firebaseConfig.ts).

## Uso
Para iniciar o servidor de desenvolvimento, execute o seguinte comando:
npm run dev
# ou
yarn dev

O projeto estará disponível em http://localhost:3000.

## Estrutura do Projeto
|-- src/
|   |-- components/
|   |-- pages/
|   |-- styles/
|   |-- firebaseConfig.ts
|-- public/

## Contribuição
Se você quiser contribuir com o projeto, siga os passos abaixo:

Crie um fork do projeto.
Crie uma branch para a sua feature (git checkout -b feature/MinhaFeature).
Faça suas alterações e faça o commit delas (git commit -m 'Adicionar minha feature').
Faça o push para a branch (git push origin feature/MinhaFeature).
Abra um Pull Request na branch principal.


Agradeço o uso do Tasks+. Caso tenha alguma dúvida ou sugestão, entre em contato conosco através das nossas informações de contato.

Contato email: ajhonatan76@gmail.com
