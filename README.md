# Bot Agendador CashBarber

Automação em Node.js e Playwright para agendamento mensal recorrente na plataforma CashBarber com execuções diárias via GitHub Actions e notificações via Telegram.

---

## Tecnologias e Pré-requisitos

- Node.js (v18+)
- Playwright
- GitHub Actions
- Conta na CashBarber e Bot no Telegram (@BotFather)

---

## Variáveis de Ambiente (`.env` ou GitHub Secrets)

Cadastre em **Settings > Secrets and variables > Actions**:

| Secret | Descrição | Exemplo |
| :--- | :--- | :--- |
| `TARGET_URL` | URL de login da barbearia | `https://cashbarber.com.br/login` |
| `USER_EMAIL` | E-mail de acesso | `seu-email@gmail.com` |
| `USER_PASSWORD` | Senha de acesso | `sua-senha` |
| `PREFERRED_TIME` | Horário preferencial | `14:00` |
| `TELEGRAM_TOKEN` | Token do Bot Telegram | `123456:ABCdef...` |
| `TELEGRAM_CHAT_ID` | ID do Chat Telegram | `98076254121` |

---

## Como Funciona

- **Frequência:** Executa diariamente às `00:05` (BRT) / `03:05` (UTC).
- **Validação:** Checa se faltam exatos **6 dias** para o primeiro sábado do mês subsequente.
  - **Diferente de 6 dias:** Encerra em segundos (envia status no Telegram se for domingo).
  - **Igual a 6 dias:** Loga na plataforma, seleciona a filial/serviço, marca o dia e seleciona o horário (`PREFERRED_TIME` ou fallback mais próximo).
- **Notificação:** Envia o resultado ou alerta de erro via Telegram.

---

## Execução Local

```bash
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
cd SEU_REPOSITORIO
npm install
npx playwright install chromium
node agendador.js
