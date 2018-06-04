import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './InputCustomizado';
import InputSubmit from './InputSubmit';
import PubSub from 'pubsub-js';
import TratadorErros from './../exceptions/TradadorErros';

class FormularioAutor extends Component {
    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (novaListagem) {
                PubSub.publish('atuliza-lista-autores', novaListagem);
                this.setState({ nome: '', email: '', senha: '' })
            },
            error: function (resposta) {
                if (resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON)
                }
            },
            beforeSend: function () {
                PubSub.publish("limpaErros", {})
            }
        });
    }

    salvaAlteracao(nomeInput, evento) {
        this.setState({ [nomeInput]: evento.target.value })
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                {/*onSubmit={this.enviaForm.bind(this)}*/}
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this, 'nome')} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this, 'email')} label="Email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this, 'senha')} label="Senha" />
                    <InputSubmit label="Gravar" />
                </form>
            </div>
        );
    }
}

class TabelaAutores extends Component {
    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((autor) => {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        $.ajax({
            //url:"http://cdc-react.herokuapp.com/api/autores",
            url: "http://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success: function (res) {
                this.setState({ lista: res });
            }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-autores', function (topico, novaLista) {
            this.setState({ lista: novaLista })
        }.bind(this));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutores lista={this.state.lista} />
                </div>
            </div>
        );
    }
}