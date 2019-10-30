import React, { Component } from 'react';
import { get } from 'axios';
import { Link } from 'react-router-dom';
import { API_HOST, ARTICLE_TYPE, GROUP_BY, WS_HOST } from '../constants';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, Table } from 'reactstrap';
import Select from 'react-select';
import { observer } from 'mobx-react'
import { action, configure, decorate, observable, runInAction } from 'mobx'

configure({ enforceActions: 'observed' });

const openConnection = () => { return new WebSocket(`${WS_HOST}/cable`) }

const subscribe = () => {
  const realTimeWebSocket = openConnection();
  realTimeWebSocket.onopen = (event) => {
    const identifierMsg = JSON.stringify({
      "channel":"RealTimeChannel"
    })
    const subscribeMsg = {
      "command":"subscribe",
      "identifier":identifierMsg
    }
    realTimeWebSocket.send(JSON.stringify(subscribeMsg))
  }
  realTimeWebSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('---log--- data = ', data)
    if (data.message === 'ARTICLES_WERE_UPDATED') {
      appStore.getArticles();
    }
  }
}

class Store {
  filter = ''
  group = 0
  order = ''
  desc = false
  articles = []

  constructor() {
    // this.getArticles()
    subscribe()
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

decorate( Store, {
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

const appStore = new Store();

// autorun(() => {
//   // console.log(`Count value is: ${appStore.desc}`);
//   appStore.getArticles();
// }, {
//   name: 'Custom autorun'
// })

@observer class ArticleList extends Component {

  constructor() {
    super();
    this.store = appStore;
  }

  componentDidMount () { this.store.getArticles() }

  handleSubmit = (event) => { event.preventDefault(); this.store.formSubmit(); }
  handleFilterChange = ({ target: { value } }) => { this.store.filterChange(value) };
  handleGroupSelectChange = ({ value }) => { this.store.groupSelectChange(value) };
  handleOrderClick = ({ target: { name } }) => { this.store.orderClick(name) };

  render() {
    const store = this.store
    const orderFlagFor = (field_name) => {
      return this.store.order === field_name && (this.store.desc ? '\u2191' : '\u2193')
    }

    return (
      <div style={{marginTop: '1em'}}>
        <Form onSubmit={this.handleSubmit} inline>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <InputGroup>
              <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
              <Input
                name="filter"
                type="search"
                value={store.filter}
                onChange={this.handleFilterChange}
                placeholder="search by name and content ..."
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <InputGroup>
              <InputGroupAddon addonType="prepend">Group by</InputGroupAddon>
              <div style={ {width: '300px'} }>
                <Select
                  id="group"
                  value={GROUP_BY[store.group]}
                  onChange={this.handleGroupSelectChange}
                  options={GROUP_BY}
                />
              </div>
            </InputGroup>
          </FormGroup>

          <Button>Submit</Button>
        </Form>
        
        <br />

        <Table hover>
          <thead>
          <tr>
            <th>
              <Button
                name='story_name'
                onClick={this.handleOrderClick}>
                Story { orderFlagFor('story_name') }
              </Button>
            </th>
            <th>
              <Button
                name='name'
                onClick={this.handleOrderClick}>
                Article Name { orderFlagFor('name') }
              </Button>
            </th>
            <th>
              <Button
                name='content'
                onClick={this.handleOrderClick}>
                Content { orderFlagFor('content') }
              </Button>
            </th>
            <th>
              <Button
                name='a_type'
                onClick={this.handleOrderClick}>
                Type { orderFlagFor('a_type') }
              </Button>
            </th>
          </tr>
          </thead>
          <tbody>
            {this.store.articles.map((article) => {
              return(
                <tr key={article.id}>
                  <td>{article.story_name}</td>
                  <td><Link to={`/edit/${article.id}`}>{article.name}</Link></td>
                  <td>{article.content}</td>
                  <td>{ARTICLE_TYPE[article.a_type - 1].label}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>

        <Link to="/new" className="btn btn-outline-primary">Create Article</Link>
      </div>
    )
  }
}

export default ArticleList;
