import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import '../stylesheets/App.css';
import ArticleList from './ArticleList';
import ArticleAddEdit from './ArticleAddEdit';
import { observer } from 'mobx-react';

@observer class App extends Component {

  handleIncrement = () => { this.props.store.increment() };
  handleDecrement = () => { this.props.store.decrement() };

  render() {
    return (
      <div className="App">
        <h1>{this.props.store.nickName}</h1>
        <h1>{this.props.store.age}</h1>
        <button onClick={this.handleDecrement}>-1</button>
        <button onClick={this.handleIncrement}>+1</button>

        <Router>
          <div className="container">
            <Main />
          </div>
        </Router>
      </div>
    );
  }
}

const Main = () => (
  <Switch>
    <Route exact path="/" component={ArticleList} />
    <Route exact path="/new" component={ArticleAddEdit} />
    <Route exact path="/edit/:id" component={ArticleAddEdit} />
  </Switch>
);

export default App;
