# Inventário TI - publicação segura na Vercel Free

## Arquivos seguros para GitHub
Pode subir estes arquivos:

- app/page.tsx
- app/layout.tsx
- app/globals.css
- app/api/items/route.ts
- public/legacy.html
- middleware.ts
- .env.example
- .gitignore
- apps-script/Code.gs.example

## Arquivos que NÃO devem ir para GitHub
Não suba:

- .env.local
- .env
- apps-script/Code.gs real
- qualquer arquivo contendo APPS_SCRIPT_URL real
- qualquer arquivo contendo APPS_SCRIPT_TOKEN real
- qualquer arquivo contendo senha do Basic Auth

## Variáveis na Vercel
Configure em Project Settings > Environment Variables:

APPS_SCRIPT_URL = sua URL real do Apps Script/googleusercontent
APPS_SCRIPT_TOKEN = mesmo token forte do Code.gs
APP_REQUIRE_AUTH = true
APP_BASIC_USER = usuário para abrir o sistema
APP_BASIC_PASSWORD = senha forte para abrir o sistema

## Apps Script
O arquivo apps-script/Code.gs.example é somente modelo sem segredo.
O Code.gs real deve ficar apenas no Google Apps Script.

Troque no Apps Script:

const API_TOKEN = 'SEU_TOKEN_FORTE';

E configure os e-mails reais apenas lá.

## Segurança gratuita aplicada
- Segredos ficam em variáveis de ambiente da Vercel.
- /api/items não expõe APPS_SCRIPT_URL nem APPS_SCRIPT_TOKEN ao navegador.
- middleware.ts protege o site e a API com usuário/senha sem recurso pago da Vercel.
- .gitignore impede .env.local e Code.gs real de irem ao GitHub.
