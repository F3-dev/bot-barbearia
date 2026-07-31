const { chromium } = require('playwright');
require('dotenv').config();

async function enviarNotificacaoTelegram(mensagem) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('TELEGRAM_TOKEN ou TELEGRAM_CHAT_ID não configurados. Notificação não enviada.');
    return;
  }
  
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: mensagem
    })
    });
    console.log('Notificação enviada para o Telegram com sucesso.');
  } catch (error) {
    console.error('Falha ao enviar notificação para o Telegram:', error);
  }
}

function getFirstSaturdayOfNextMonth() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const dayOfWeek = nextMonth.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  nextMonth.setDate(nextMonth.getDate() + daysUntilSaturday);
  return nextMonth;
}

(async () => {
  const targetDate = getFirstSaturdayOfNextMonth();
  
  const dataAlvoZerada = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const hojeZerado = new Date();
  hojeZerado.setHours(0, 0, 0, 0);
  
  const diffTime = dataAlvoZerada - hojeZerado;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const diaDaSemana = hojeZerado.getDay(); // 0 = Domingo

  if (diaDaSemana === 0) {
    const msgStatus = `ℹ️ Bot Barbearia Ativo: Faltam ${diffDays} dias para o sábado alvo (${targetDate.toLocaleDateString('pt-BR')}).`;
    await enviarNotificacaoTelegram(msgStatus);
  }

  if (diffDays !== 6) {
    console.log(`Ainda não é o momento do agendamento principal. Faltam ${diffDays} dias.`);
    return; 
  }

  console.log(`Iniciando agendamento para: ${targetDate.toLocaleDateString('pt-BR')} às 13:30`);

  const browser = await chromium.launch({ headless: true }); 
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(process.env.TARGET_URL);
    await page.locator('input[name="email"]').fill(process.env.USER_EMAIL);
    await page.locator('input[name="password"]').fill(process.env.USER_PASSWORD);
    await page.getByRole('button', { name: 'Entrar' }).click();
    
    await page.getByRole('button', { name: ' Novo agendamento' }).click();
    await page.getByRole('button', { name: 'Não tenho interesse' }).click();
    
    await page.getByText('Selecione a filial').click();
    await page.getByText('Centro').click();
    await page.getByRole('img').nth(1).click();
    await page.getByText('Corte de cabeloR$').click();
    await page.getByRole('button', { name: 'Confirmar' }).click();
    
    const dayString = String(targetDate.getDate()).padStart(2, '0');
    await page.getByText(dayString, { exact: true }).click();
    
    try {
      console.log(`Tentando selecionar o horário preferido: ${process.env.PREFERRED_TIME}`);
      await page.getByText(process.env.PREFERRED_TIME).click({ timeout: 5000 });
    } catch (e) {
      console.log(`Horário ${process.env.PREFERRED_TIME} ocupado ou não encontrado. Buscando alternativa por aproximação...`);
      
      const horarioAlternativo = page.getByText(/^13:/).first();
      if (await horarioAlternativo.isVisible()) {
        const textoHorario = await horarioAlternativo.innerText();
        await horarioAlternativo.click();
        console.log(`Selecionado horário alternativo mais próximo: ${textoHorario}`);
      } else {
        const primeiroDisponivel = page.locator('.horario, button, .time-slot').first();
        const textoDisponivel = await primeiroDisponivel.innerText();
        await primeiroDisponivel.click();
        console.log(`Selecionado primeiro horário disponível na tela: ${textoDisponivel}`);
      }
    }
    
    await page.getByRole('button', { name: 'Agendar' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    
    const msgSucesso = `✅ Barbearia: Agendado com sucesso para o dia ${targetDate.toLocaleDateString('pt-BR')}!`;
    console.log(msgSucesso);
    await enviarNotificacaoTelegram(msgSucesso);

  } catch (error) {
    console.error('Erro na execução do agendamento:', error);
    await enviarNotificacaoTelegram(`❌ Erro crítico no bot da barbearia: ${error.message}. Por favor, realize o agendamento manualmente.`);
  } finally {
    await browser.close();
  }
})();
