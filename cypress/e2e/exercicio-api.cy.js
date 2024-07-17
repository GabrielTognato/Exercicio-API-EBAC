/// <reference types="cypress" />
const faker = require('faker');
import contrato from '../contracts/usuarios.contract'


describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
  })
     
  });

  it('Deve listar usuários cadastrados', () => {
     cy.request({
      method: 'GET',
      url: 'usuarios',
     }).then ((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
     })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
     cy.cadastrarUsuario().then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
     })
  });

  it('Deve validar um usuário com email inválido', () => {
     cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": "fulanotesteemailerrado",
        "email": "Gaston.Carroll@gmail.com",
        "password": "testeemailerrado",
        "administrador": "true"
      }, failOnStatusCode: false
     }).then ((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.contain('Este email já está sendo usado')
     })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
     cy.cadastrarUsuario().then((response) => {
      const userId = response.body._id;

      const novoNome = faker.name.findName();
      const novoEmail = faker.internet.email();
      const novaSenha = faker.internet.password();
      const admin = 'true';

      cy.request({
        method: 'PUT',
        url: `usuarios/${userId}`,
        body: {
          'nome': novoNome,
          'email': novoEmail,
          'password': novaSenha,
          'administrador': 'true'
        }
      }).then ((response) =>{
        expect(response.status).to.equal(200)
        expect(response.body.message).to.contain('Registro alterado com sucesso')
      })
     })  
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
     cy.cadastrarUsuario().then((response) => {
      const userId = response.body._id;

      cy.request({
        method: 'DELETE',
        url: `usuarios/${userId}`
      }).then (response => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })

     })
  });


});
