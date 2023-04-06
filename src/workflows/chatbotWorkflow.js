import moment from 'moment';
import 'moment/locale/pt-br.js';

import sendTextMessage from '../utils/sendTextMessage.js';
import capitalizeString from '../utils/capitalizeString.js';
import reportNameByCode from '../utils/reportNameByCode.js';
import periodNameByCode from '../utils/periodNameByCode.js';

moment.locale('pt-br');

const conversations = [];
const initTerms = ['oi', 'ola', 'olá', 'gsafra', 'iniciar'];

export async function chatbotWorkflow(body, socket) {
  const userNumber = body.key.remoteJid.split('@')[0];
  const userName = body.pushName;
  const message = body.message.conversation.trim().toLowerCase();

  let conversationIndex = conversations.findIndex((item) => item.userNumber === userNumber);

  if (initTerms.includes(message)) {
    if (conversationIndex === -1) {
      conversations.push({
        userNumber,
        userName,
        stage: 0,
        report: [],
      });

      conversationIndex = conversations.length - 1;
    } else {
      conversations[conversationIndex].stage = 0;
    }
  }

  if (conversationIndex === -1) {
    return await sendTextMessage(userNumber, `
Desculpa, não entendi! 😕
Você poder iniciar uma nova conversar com um desses *termos*:

_- Oi_
_- Olá_
_- Inciar_
_- GSafra_
    `.trim());
  }

  if (message === 'v' && conversations[conversationIndex].stage > 1) {
    conversations[conversationIndex].stage -= 2;
    conversations[conversationIndex].report.pop();
  }

  if (conversations[conversationIndex].stage === 0) {
    conversations[conversationIndex].stage = 1;

    return await sendTextMessage(userNumber, `
Olá, *${userName}*! 👋
Sou o *assistente virtual* do GSafra, como posso te ajudar?

*1 - _Relatório Financeiro_*
*2 - _Relatório de Produção_*

_Responda com o número referente ao que deseja_
    `.trim());
  }

  if (conversations[conversationIndex].stage === 1) {
    conversations[conversationIndex].stage = 2;

    if (message === '1' || conversations[conversationIndex].report[0] === 'financeiro') {
      conversations[conversationIndex].report[0] = 'financeiro';

      return await sendTextMessage(userNumber, `
Você está no módulo *Financeiro* 🏦
Qual relatório você gostaria?

*1 - _Contas a Pagar_*
*2 - _Contas a Receber_*
*V - _Voltar_*

_Responda com o número referente ao que deseja_
      `.trim());
    }

    if (message === '2' || conversations[conversationIndex].report[0] === 'producao') {
      conversations[conversationIndex].report[0] = 'producao';

      return await sendTextMessage(userNumber, `
Você está no módulo *Produção* 🌾
Qual relatório você gostaria?

*1 - _Produção_*
*2 - _Produtividade_*
*V - _Para voltar_*

_Responda com o número referente ao que deseja_
      `.trim());
    }
  }

  if (conversations[conversationIndex].stage === 2) {
    conversations[conversationIndex].stage = 3;

    let report = '';

    if (conversations[conversationIndex].report[0] === 'financeiro') {
      if (message === '1') {
        conversations[conversationIndex].report[1] = 'contas_pagar';
        report = 'Contas a Pagar 📝';
      }

      if (message === '2') {
        conversations[conversationIndex].report[1] = 'contas_receber';
        report = 'Contas a Pagar 📝';
      }
    }

    if (conversations[conversationIndex].report[0] === 'producao') {
      if (message === '1') {
        conversations[conversationIndex].report[1] = 'producao';
        report = 'Produção 🌾';
      }

      if (message === '2') {
        conversations[conversationIndex].report[1] = 'produtividade';
        report = 'Produtividade 🌾';
      }
    }

    return await sendTextMessage(userNumber, `
Você já vai receber seu relatório de *${report}*
Pra finalizar, escolha o período desejado?

*1 - _Do dia atual:_* _${moment().format('DD/MM/YYYY')}_
*2 - _Dos próximos 7 dias:_* _${moment().format('DD/MM/YYYY')} - ${moment().add(6, 'days').format('DD/MM/YYYY')}_
*3 - _Do mês atual:_* _${capitalizeString(moment().format('MMMM'))}_
*V - _Voltar_*

_Responda com o número referente ao que deseja_
    `.trim());
  }

  if (conversations[conversationIndex].stage === 3) {
    if (message === '1') {
      conversations[conversationIndex].report[2] = 'hoje';
    }
    if (message === '2') {
      conversations[conversationIndex].report[2] = '7_dias';
    }
    if (message === '3') {
      conversations[conversationIndex].report[2] = 'mes';
    }

    socket.emit('newreport', JSON.stringify({
      userNumber,
      userName,
      report: conversations[conversationIndex].report
    }));

    return await sendTextMessage(userNumber, `
Processando seu relatório 🚀

*${reportNameByCode(conversations[conversationIndex].report[1])}, _${periodNameByCode(conversations[conversationIndex].report[2])}_*

_Aguarde..._
    `.trim());
  }
}