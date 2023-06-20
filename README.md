# Agendamento descomplicado | Call

<img
  alt='Imagem do projeto'
  src='public/call.png'
/>

## Sobre

O projeto call é uma aplicação full stack de agendamento, integrada ao Google Calendar que permite agendar compromissos com outros usuários, basta criar uma conta no app e enviar o link do seu calendário, ai a pessoa ja vai poder agendar um horário com voce e o agendamento vai aparecer no seu Google Calendar.

## Instalação

```zsh
git clone https://github.com/manoguii/call.git
```

- Para rodar o projeto localmente
  1. Primeiro você precisa criar uma conta nas plataformas na qual o projeto tem integração, o projeto usa o [Google](https://console.cloud.google.com/) para autenticação do usuário, caso tenha duvidas consulte a documentação das ferramentas.
  2. Crie um arquivo ```.env.local``` na raiz do projeto e preencha as variáveis ambiente, o exemplo de como deve ficar esta em ```.env.example```
  3. Instale as dependências ```pnpm install```
  4. Crie o banco de dados local ```docker run --name mysql -e MYSQL_ROOT_PASSWORD=docker -p 3306:3306 mysql:latest```
  5. Rodar as migrations ```pnpm exec prisma migrate dev```
  6. Execute a aplicação. ```pnpm dev```
  7. Acesse `http://localhost:3000`

## Tecnologias utilizadas 👩🏻‍💻

Algumas tecnologias utilizadas para construção da aplicação.

- [ReactJS](https://reactjs.org/)
- [NextJS](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [stitches](https://stitches.dev/)
- [React Hook Form](https://www.react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Next Auth](https://next-auth.js.org/)
- [Next Seo](https://github.com/garmeeh/next-seo#readme)
- [Google Api](https://github.com/googleapis/google-api-nodejs-client#readme)
- [Prisma](https://www.prisma.io/)
- [React Query](https://tanstack.com/query/v3/)

---

<center>Made with 💙 by Guilherme David</center>
