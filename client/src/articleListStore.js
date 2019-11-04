import { API_HOST } from './host_constants'
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

  constructor() { subscribe(this) }

  filterChange({ target: { value } }) { this.filter = value };

  groupSelectChange({ value }) { this.group = value };

  orderClick({ target: { name } }) {
    if (this.order === name) {
      this.desc = !this.desc
    }else{
      this.order = name
      this.desc = false
    }
    this.getArticles()
  };

  submit(event) {
    event.preventDefault()
    this.getArticles()
  }

  getArticles() {
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

  filterChange: action.bound,
  groupSelectChange: action.bound,
  orderClick: action.bound,
  submit: action.bound
})
