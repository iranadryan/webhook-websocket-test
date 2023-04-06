import moment from 'moment';

moment.locale('pt-br');

export default function periodNameByCode(code) {
  if (code === 'hoje') {
    return `Hoje: ${moment().format('DD/MM/YYYY')}`
  }

  if (code === '7_dias') {
    return `Próximos 7 dias: ${moment().format('DD/MM/YYYY')} - ${moment().add(6, 'days').format('DD/MM/YYYY')}`
  }

  if (code === 'mes') {
    return `Mês de ${capitalizeString(moment().format('MMMM'))}`
  }
}