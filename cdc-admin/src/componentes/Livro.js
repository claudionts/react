import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './InputCustomizado'
import InputSubmit from './InputSubmit';
import PubSub from 'pubsub-js';
import TratadorErros from './../exceptions/TradadorErros';

class FormularioAutor extends Component {
    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: '' };
        this.enviaForm = this.enviaForm.bind(this)
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: function (novaListagem) {
                PubSub.publish('atuliza-lista-livros', novaListagem);
                this.setState({ titulo: '', preco: '', autorId: '' })
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
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.salvaAlteracao.bind(this, 'titulo')} label="Título" />
                    <InputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.salvaAlteracao.bind(this, 'preco')} label="Preço" />
                    <div className="pure-control-group">
                        <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.salvaAlteracao.bind(this, 'autorId')}>
                            <option value="">Selecione autor</option>
                            {
                                this.props.autores.map(function (autor) {
                                    return <option key={autor.id} value={autor.id}>{autor.nome}</option>
                                })
                            }
                        </select>
                    </div>
                    <InputSubmit label="Gravar" />
                </form>
            </div>
        );
    }
}

class TabelaLivros extends Component {
    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((livro) => {
                                return (
                                    <tr key={livro.id}>
                                        <td>{livro.titulo}</td>
                                        <td>{livro.preco}</td>
                                        <td>{livro.autor.nome}</td>
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

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = { lista: [], autores: [] };
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            dataType: 'json',
            success: function (resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        });

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: function (resposta) {
                this.setState({ autores: resposta });
            }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-livros', function (topico, novaLista) {
            this.setState({ lista: novaLista })
        }.bind(this));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor autores={this.state.autores} />
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}