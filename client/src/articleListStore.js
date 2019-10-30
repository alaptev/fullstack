import { API_HOST } from './constants'
import { subscribe } from './subscribe'
import { get } from 'axios'
import { action, configure, decorate, observable, runInAction } from 'mobx'

configure({ enforceActions: 'observed' });

export class articleListStore {
  filter = ''
  group = 0
  order = ''
  desc = false
  articles = []

  constructor() {
    // this.getArticles()
    subscribe(this)
  }

  filterChange(value) { this.filter = value };
  groupSelectChange(value) { this.group = value };
  orderClick(value) {
    if (this.order === value) {
      this.desc = !this.desc
    }else{
      this.order = value
      this.desc = false
    }
    this.getArticles()
  };
  formSubmit() { this.getArticles() }

  getArticles() {
    //console.log('---log--- getArticles()');
    const params = {
      filter: this.filter,
      group: this.group,
      order: this.order,
      desc: this.desc
    }
    get(`${API_HOST}/api/stories.json?with_articles=true`, { params: params })
      .then(response => { runInAction( () => { this.articles = response.data.storiesWithArticles}) })
      .catch(error => console.log('error', error));
  }
}

decorate( articleListStore, {
  filter: observable,
  group: observable,
  order: observable,
  desc: observable,
  articles: observable,

  filterChange: action,
  groupSelectChange: action,
  orderClick: action,
  formSubmit: action

  // getArticles: action
})
