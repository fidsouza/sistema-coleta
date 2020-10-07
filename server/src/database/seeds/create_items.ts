import Knex from 'knex'

export async function seed (knex: Knex){
   await knex('items').insert([
        { title : 'Lâmpadas' , image : 'Lampadas.svg'},
        { title : 'Pilhas e Baterias' , image : 'baterias.svg'},
        { title : 'Pápeis e Papelão' , image : 'papeis-papelao.svg'},
        { title : 'Resíduos Eletrônicos' , image : 'eletrônicos.svg'},
        { title : 'Resíduos Orgânicos' , image : 'orgânicos.svg'},
        { title : 'Óleo de Cozinha' , image : 'oleo.svg'},

    ])
}