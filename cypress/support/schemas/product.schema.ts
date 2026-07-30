const productSchema = {
  nome: 'string',
  preco: 'number',
  descricao: 'string',
  quantidade: 'number',
  _id: 'string',
} as const;

export default productSchema;
