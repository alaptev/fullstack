import React, { Component } from 'react';
import {BrowserRouter as Router, Route, NavLink, Switch} from 'react-router-dom';

import '../stylesheets/App.css';
import ArticleList from './ArticleList';
import ArticleInfo from './ArticleInfo';
import ArticleAdd from './ArticleAdd';
import ArticleEdit from './ArticleEdit';

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
    <Route exact path="/articles" component={ArticleList} />
    <Route exact path="/articles/new" component={ArticleAdd} />
    <Route exact path="/articles/:id" component={ArticleInfo} />
    <Route exact path="/articles/:id/edit" component={ArticleEdit} />
  </Switch>
);

export default App;
