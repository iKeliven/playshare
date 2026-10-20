# PlayShare

Plataforma Web de Compartilhamento e Streaming de Músicas desenvolvida como projeto acadêmico do Curso Técnico em Informática para Internet.

O projeto simula o desenvolvimento de uma aplicação semelhante ao Spotify, permitindo que usuários descubram músicas, reproduzam conteúdos, criem playlists e recebam recomendações personalizadas.

---

## Sobre o Projeto

A PlayShare foi criada para aplicar conceitos de:

- UX e UI
- Levantamento de Requisitos
- Modelagem de Sistemas
- React
- Integração com APIs
- Versionamento com Git e GitHub
- Testes Automatizados
- Desenvolvimento Front-End

O projeto faz parte de uma Situação de Aprendizagem Integrada, simulando um ambiente real de desenvolvimento de software.

---

## Funcionalidades

### Cadastro e Login

- Cadastro de novos usuários
- Autenticação de acesso
- Gerenciamento de sessão

### Busca Musical

- Busca de músicas
- Busca de artistas
- Busca de álbuns

### Reprodução de Músicas

- Player de áudio
- Play/Pause
- Avançar faixa
- Retroceder faixa
- Barra de progresso

### Playlists

- Criar playlists
- Editar playlists
- Excluir playlists
- Adicionar músicas

### Recomendações

- Sugestões personalizadas
- Histórico de reprodução
- Descoberta de novos conteúdos

### Compartilhamento

- Compartilhamento de músicas
- Compartilhamento de playlists
- Geração de links públicos

---

## Publicação no Netlify

O arquivo `netlify.toml` configura o build com Node.js 22, comando `npm run build` e diretório de publicação `dist`.

- **Importação do Git:** selecione este repositório no Netlify e mantenha o diretório base na raiz do projeto. As configurações de build são lidas automaticamente.
- **Upload manual:** execute `npm ci` e `npm run build`, depois envie a pasta `dist` ao Netlify.

O arquivo `public/_redirects` é copiado para o build e permite acessar ou atualizar as rotas do React diretamente, sem erro 404, inclusive no upload manual.

O build padrão usa a raiz `/`. O workflow do GitHub Pages define `GITHUB_PAGES=true` para manter o caminho `/playshare/` nessa plataforma.

---

## Tecnologias Utilizadas

### Front-End

- React
- JavaScript
- HTML5
- CSS3
- React Router

### APIs

- iTunes Search API
- Apple Music RSS API

### Ferramentas

- Git
- GitHub
- Figma
- VS Code
- Postman

### Testes

- Jest
- Cypress

---

## APIs Utilizadas

### iTunes Search API

```txt
https://itunes.apple.com/search
```

Responsável por:

- Buscar músicas
- Buscar artistas
- Buscar álbuns
- Recuperar informações musicais

### Apple Music RSS API

```txt
https://rss.applemarketingtools.com/api/v2
```

Responsável por:

- Top músicas
- Álbuns em destaque
- Conteúdo musical atualizado

---

## Estrutura do Projeto

```bash
src/
├── assets/
├── components/
│   ├── Button/
│   ├── Card/
│   ├── Header/
│   ├── Sidebar/
│   └── Player/
├── pages/
│   ├── Home/
│   ├── Login/
│   ├── Musicas/
│   ├── Favoritos/
│   └── Usuario/
├── services/
│   ├── itunesService.js
│   └── rssService.js
├── routes/
├── hooks/
├── contexts/
└── App.jsx
```

---

## Objetivos de Aprendizagem

Durante o desenvolvimento deste projeto foram trabalhadas as seguintes competências:

- Levantamento de requisitos
- Prototipação de interfaces
- Desenvolvimento Front-End
- Consumo de APIs
- Responsividade
- Controle de estados
- Versionamento de software
- Testes automatizados
- Trabalho em equipe

---

## Protótipo

https://www.figma.com/proto/WSClrXzL7zq7nDdZ7ejlch/PlaayShare---spotifake

---

## Repositório

https://github.com/iKeliven/playshare

---

## Projeto Acadêmico

Projeto desenvolvido para fins educacionais no Curso Técnico em Informática para Internet.

Unidades Curriculares envolvidas:

- Projeto de Front-End
- Codificação para Front-End
- Interação com APIs
- Testes de Front-End

Instituição: SENAI/SC

---

## Autor

Keliven Demarchi

Docente de Desenvolvimento de Sistemas e Front-End
