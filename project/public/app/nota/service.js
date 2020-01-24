import { handleStatus } from '../utils/promise-helpers.js';
import { partialize, pipe } from '../utils/operators.js';

const API = `http://localhost:3000/notas`;

// não existe mais a função `sumItems`. Ela foi substituída por três funções
const getItemsFromNotas = notas => notas.$flatMap(nota => nota.itens);
const filterItemsByCode = (code, items) => items.filter(item => item.codigo === code);
const sumItemsValue = items => items.reduce((total, item) => total + item.valor, 0);

// flatMap = retornará para o próximo then uma lista de itens
// filter = retornará para o próximo then uma lista de itens filtrada
// reduce = retornará para o próximo then o total 
// const sumItems = code => notas => 
//     notas.$flatMap(nota => nota.itens)
//     .filter(item => item.codigo == code)
//     .reduce((total, item) => total + item.valor, 0)

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
      // usando pipe e alterando a ordem dos parâmetros
      const sumItems = pipe(
        getItemsFromNotas,
        partialize(filterItemsByCode, code), 
        sumItemsValue, 
      );

      return this.listAll().then(sumItems);
    }
};