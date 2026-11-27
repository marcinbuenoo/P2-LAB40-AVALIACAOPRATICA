# LAB40 – Laboratório de Funcionalidades Web

Projeto-base para avaliação prática de Integração e Entrega Contínua (CI/CD).

## Requisitos
- Node.js 20 ou superior.
- npm.

## Executar localmente
```bash
npm install
npm start
```
Acesse http://localhost:3000. Para desenvolvimento com reinicialização automática: `npm run dev`.

## Qualidade e testes

```bash
npm run format:check
npm run lint
npm test
npm run test:smoke
npm run audit
```

Os testes automatizados usam o test runner nativo do Node.js. O smoke test inicia a API em uma porta efêmera e valida `/health`, o catálogo e os cenários válido e inválido da Feature 14. Em 27/11/2026, `npm audit --audit-level=high` não identificou vulnerabilidades.

## Endpoints
- `GET /health`: verificação de disponibilidade.
- `GET /api/features`: lista as 40 funcionalidades e seus estados.
- `POST /api/features/:id`: executa uma funcionalidade, recebendo JSON no corpo.

Exemplo da funcionalidade implementada (Feature 14):
```bash
curl -X POST http://localhost:3000/api/features/14 -H "Content-Type: application/json" -d '{"texto":"A sacada da casa"}'
```

O resultado é `{"result":{"palindromo":true}}`. Para dados inválidos, como `{"texto":14}`, a API retorna HTTP 400 com uma mensagem explicativa.

## Estrutura
```text
lab40/
├── public/
├── src/
│   ├── app.js
│   ├── server.js
│   └── features/
├── package.json
└── package-lock.json
```

## Contrato de cada módulo
Cada arquivo `src/features/featureNN.js` exporta `id`, `name`, `description`, `implemented` e `execute(input)`.

1. Implemente `execute(input)`.
2. Valide os dados recebidos.
3. Retorne um objeto serializável em JSON.
4. Trate entradas inválidas lançando `Error` com mensagem clara.
5. Depois de implementar e validar, altere `implemented` para `true`.
6. Não altere o contrato dos outros módulos nem a API central sem autorização.

Enquanto `implemented` for `false`, a API retorna HTTP 501 para aquele módulo.

## Feature 14 — Verificador de palíndromo

A Feature 14 remove acentos, espaços, pontuação e diferenças entre maiúsculas/minúsculas antes de comparar o texto com seu inverso. Ela exige uma string que contenha ao menos um caractere alfanumérico e devolve `{ palindromo: boolean }`.

### Roteiro de teste manual

1. Execute `npm start`.
2. Abra `http://localhost:3000/health` e confirme `status: "ok"`.
3. Abra `http://localhost:3000` e selecione o cartão da Feature 14.
4. Execute com `{"texto":"A sacada da casa"}` e confirme `palindromo: true`.
5. Execute com `{"texto":"FATEC"}` e confirme `palindromo: false`.
6. Execute com `{"texto":14}` e confirme HTTP 400 e a mensagem de validação.

## CI e Docker

O workflow [ci.yml](.github/workflows/ci.yml) é acionado em `push` e `pull_request`. Ele instala dependências com `npm ci`, verifica formatação e lint, executa testes, smoke test, auditoria e constrói/testa a imagem Docker.

Para validar localmente a imagem:

```bash
docker build -t lab40:feature14 .
docker run --rm -p 3000:3000 lab40:feature14
```

## Importante
Este repositório é entregue intencionalmente sem testes automatizados, análise estática, workflow de CI, build ou configuração de deploy. O estudante deverá criar e justificar esses elementos durante a avaliação.

O servidor escuta `process.env.PORT` e `0.0.0.0`, e a aplicação não persiste dados em disco.
