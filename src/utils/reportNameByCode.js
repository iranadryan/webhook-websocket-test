export default function reportNameByCode(code) {
  if (code === 'contas_pagar') {
    return 'Contas a Pagar'
  }

  if (code === 'contas_receber') {
    return 'Contas a Receber'
  }

  if (code === 'producao') {
    return 'Produção'
  } 

  if (code === 'produtividade') {
    return 'Produtividade'
  }

  return '';
}