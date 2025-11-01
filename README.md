# Task Manager API - TypeScript

Uma API de gerenciamento de tarefas moderna construída com Node.js, Express e TypeScript.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática  
- **Express** - Framework web
- **LevelDB** - Banco de dados NoSQL 
- **Jest + ts-jest** - Framework de testes
- **Supertest** - Testes de integração da API

## 📁 Estrutura do Projeto

```
├── index.ts             # Servidor principal
├── taskManager.ts       # Gerenciador de tarefas  
├── dist/                # Arquivos JavaScript compilados
├── public/              # Arquivos estáticos (frontend)
├── *.test.ts            # Arquivos de teste TypeScript
└── package.json         # Configurações e dependências
```

## 🛠️ Instalação

1. Clone o repositório e instale as dependências:
```bash
npm install
```

2. Compile o TypeScript:
```bash
npm run build
```

## 🎯 Scripts Disponíveis

- `npm run build` - Compila o código TypeScript para JavaScript
- `npm run dev` - Executa o servidor em modo desenvolvimento (ts-node)
- `npm start` - Executa o servidor compilado (produção)
- `npm test` - Executa todos os testes
- `npm run clean` - Remove arquivos compilados

## 🔥 Executando a Aplicação

### Desenvolvimento (com TypeScript direto)
```bash
npm run dev
```

### Produção (código compilado)
```bash
npm run build
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Executando os Testes

```bash
npm test
```

## Estrutura do Projeto

```
helloworld/
├── README.md            # Este arquivo
└── server/              # Pasta do servidor
    ├── index.js              # Servidor Express e rotas da API
    ├── taskManager.js        # Gerenciador de tarefas com LevelDB
    ├── public/
    │   ├── index.html        # Interface do usuário
    │   └── app.js           # Lógica frontend
    ├── taskManager.test.js   # Testes do TaskManager
    ├── api.test.js          # Testes da API
    └── jest.config.js       # Configuração do Jest
```

## API Endpoints

### Criar Tarefa
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Título da tarefa",
  "description": "Descrição opcional"
}
```

### Listar Todas as Tarefas
```
GET /api/tasks
```

### Obter Tarefa Específica
```
GET /api/tasks/:id
```

### Atualizar Tarefa
```
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Novo título",
  "description": "Nova descrição",
  "completed": true
}
```

### Deletar Tarefa
```
DELETE /api/tasks/:id
```

### Health Check
```
GET /health
```

## Uso da Interface Web

1. Acesse `http://localhost:3000` no navegador
2. Digite o título da tarefa (obrigatório) e descrição (opcional)
3. Clique em "Adicionar Tarefa"
4. Use os botões para:
   - ✓ Concluir / ↩ Reabrir: Marcar tarefa como concluída ou reabrir
   - 🗑 Excluir: Remover a tarefa

## Exemplos de Uso da API

### Criar uma nova tarefa
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar leite", "description": "No supermercado"}'
```

### Listar todas as tarefas
```bash
curl http://localhost:3000/api/tasks
```

### Marcar tarefa como concluída
```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Deletar uma tarefa
```bash
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID
```

## Persistência de Dados

Os dados são armazenados localmente no diretório `./db` usando LevelDB. As tarefas são mantidas mesmo após reiniciar a aplicação.

## Testes

A aplicação inclui testes completos para:
- ✅ Todas as operações CRUD do TaskManager
- ✅ Todos os endpoints da API
- ✅ Validações e tratamento de erros

Total de testes: 31 casos de teste

## Licença

ISC
