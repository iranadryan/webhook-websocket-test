import axios from 'axios';

async function sendTextMessage(number, message) {
  try {
    await axios({
      method: 'post',
      url: 'http://44.203.115.176:3333/message/text?key=gsafra_server',
      data: {
        id: number,
        message: message
      }
    });

    console.log({ message: 'Mensagem enviada com sucesso' });
  } catch {
    console.log({ message: 'Mensagem não enviada' });
  }
}

export default sendTextMessage