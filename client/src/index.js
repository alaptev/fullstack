import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { action, computed, configure, decorate, observable } from 'mobx'

configure({ enforceActions: 'observed' });

class Store {
  firstName = 'Yauhen';
  age = 0;

  get nickName() {
    console.log('Generate nickName!');
    return `${this.firstName} ${this.age}`;
  }

  increment() { this.age++ };
  decrement() { this.age-- };
}

decorate( Store, {
  firstName: observable,
  age: observable,
  nickName: computed,
  increment: action,
  decrement: action
})

const appStore = new Store();

ReactDOM.render(<App store={appStore} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
