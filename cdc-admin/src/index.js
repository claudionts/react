import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import App from './App';
import AutorBox from './componentes/Autor';
import Home from './componentes/Home';
import Livro from './componentes/Livro';

ReactDOM.render(
    (<Router>
        <App>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/autor" component={AutorBox} />
                <Route path="/livro" component={Livro} />
            </Switch>
        </App>
    </Router>),
    document.getElementById('root'));
registerServiceWorker();
