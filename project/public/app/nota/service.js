import { handleStatus } from '../utils/promise-helpers.js';

const API = `http://localhost:3000/notas`;

// flatMap = retornará para o próximo then uma lista de itens
// filter = retornará para o próximo then uma lista de itens filtrada
// reduce = retornará para o próximo then o total 
const sumItems = code => notas => 
    notas.$flatMap(nota => nota.itens)
    .filter(item => item.codigo == code)
    .reduce((total, item) => total + item.valor, 0)

export const notasService = {
    listAll() {
        return fetch(API)
        // lida com o status da requisição
        .then(handleStatus)
        .catch(err => {
            // a responsável pelo logo é do serviço
            console.log(err);
            // retorna uma mensagem de alto nível
            return Promise.reject('Não foi possível obter as notas fiscais');
        });
    },

    sumItems(code) {
      return this.listAll().then(sumItems(code));
    }
};