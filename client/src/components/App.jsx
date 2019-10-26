import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import '../stylesheets/App.css';
import ArticleList from './ArticleList';
import ArticleAddEdit from './ArticleAddEdit';
import DevTools from 'mobx-react-devtools';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<DevTools />*/}
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
