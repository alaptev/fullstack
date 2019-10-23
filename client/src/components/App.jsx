import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import '../stylesheets/App.css';
import ArticleList from './ArticleList';
import ArticleAdd from './ArticleAdd';

class App extends Component {
  render() {
    return (
      <div className="App">
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
    <Route exact path="/new" component={ArticleAdd} />
    <Route exact path="/edit/:id" component={ArticleAdd} />
  </Switch>
);

export default App;
