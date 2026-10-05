<div align="center">

# Bot Agendador (CashBarber)

<p>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Playwright-1.40%2B-2EAD33?logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

<p>
  Automação feita em <strong>Node.js</strong> e <strong>Playwright</strong> para realizar agendamentos automáticos na plataforma CashBarber.
  O script é executado diariamente via <strong>GitHub Actions</strong> e envia notificações de status diretamente para o <strong>Telegram</strong>.
</p>

</div>



## Índice

* [Como Funciona](#como-funciona)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Pré-requisitos](#pré-requisitos)
* [Instalação e Execução Local](#instalação-e-execução-local)
* [Configuração na Nuvem](#configuração-na-nuvem-github-actions)


## Como Funciona

1. O GitHub Actions executa o script todos os dias às **00:05 (Horário de Brasília)** / **03:05 UTC**.
2. O script calcula a data do primeiro sábado do próximo mês e verifica a antecedência em dias antes de iniciar o fluxo de agendamento.

   * Se a antecedência for diferente de **6 dias**, o bot envia um log de status no domingo e encerra em segundos, sem abrir o navegador.
   * Quando faltam exatamente **6 dias** (domingo à meia-noite), a condição é satisfeita e o fluxo de agendamento é iniciado.
3. O bot tenta selecionar o horário preferencial configurado. Caso esteja ocupado, ele seleciona o horário alternativo mais próximo no mesmo período.
4. O sucesso ou eventuais erros críticos são reportados via API do Telegram.


## Tecnologias Utilizadas

- JavaScript / Node.js
- Playwright
- GitHub Actions
- Telegram Bot API



## Pré-requisitos

* [Node.js](https://nodejs.org/) **v18** ou superior
* Uma conta ativa na plataforma [CashBarber](https://cashbarber.com.br)
* Um bot no Telegram criado via [@BotFather](https://t.me/BotFather)


## Instalação e Execução Local

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO

# 2. Instale as dependências
npm install

# 3. Instale os navegadores do Playwright
npx playwright install chromium

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# 5. Execute o script
node agendador.js
```

> **Nota:** Para execução local, crie um arquivo `.env` na raiz do projeto com as variáveis descritas na seção abaixo.

### Exemplo de `.env`

```env
TARGET_URL=https://cashbarber.com.br/.../login
USER_EMAIL=seu-email@gmail.com
USER_PASSWORD=sua-senha-aqui
PREFERRED_TIME=13:30
TELEGRAM_TOKEN=123456:ABCdef...
TELEGRAM_CHAT_ID=987654321
```


## Configuração na Nuvem (GitHub Actions)

As credenciais são isoladas do código-fonte via **Secrets do GitHub**.

Acesse **Settings > Secrets and variables > Actions > New repository secret** e cadastre as seguintes variáveis:

| Secret             | Descrição                            | Exemplo                               |
| :----------------- | :----------------------------------- | :------------------------------------ |
| `TARGET_URL`       | URL da página de login da barbearia  | `https://cashbarber.com.br/.../login` |
| `USER_EMAIL`       | E-mail de acesso à sua conta         | `seu-email@gmail.com`                 |
| `USER_PASSWORD`    | Senha de acesso à sua conta          | `sua-senha-aqui`                      |
| `PREFERRED_TIME`   | Horário padrão desejado para o corte | `13:30`                               |
| `TELEGRAM_TOKEN`   | Token gerado pelo @BotFather         | `123456:ABCdef...`                    |
| `TELEGRAM_CHAT_ID` | Seu ID obtido via @UserInfoBot       | `987654321`                           |

