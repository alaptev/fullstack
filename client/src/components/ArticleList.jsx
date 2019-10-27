import React, { Component } from 'react';
import { get } from 'axios';
import { Link } from 'react-router-dom';
import { API_HOST, ARTICLE_TYPE, GROUP_BY } from '../constants';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, Table } from 'reactstrap';
import Select from 'react-select';
import { observer } from 'mobx-react'
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

@observer class ArticleList extends Component {

  constructor() {
    super();
    this.store = new Store();
    this.state = {
      filter: '',
      group: 0,
      order: {},
      articles: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGroupSelectChange = this.handleGroupSelectChange.bind(this);
    this.handleOrderClick = this.handleOrderClick.bind(this);
  }

  componentDidMount() {
    this.getArticles();
  }

  handleChange(event) {
    this.setState( { [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getArticles();
  }

  handleGroupSelectChange(selected) {
    this.setState({ group: selected.value });
  }

  handleOrderClick(event) {
    const fieldName = event.target.name;
    this.setState( (state) => { return {order: { field: fieldName, desc: !state.order.desc }}}, this.getArticles)
  }

  getArticles() {
    const params = {
      filter: this.state.filter,
      group: this.state.group,
      order: this.state.order.field,
      desc: this.state.order.desc
    }
    get(`${API_HOST}/api/stories.json?with_articles=true`, { params: params })
      .then(response => {
        this.setState({articles: response.data.storiesWithArticles});
      })
      .catch(error => console.log('error', error));
  }

  handleIncrement = () => { this.store.increment() };
  handleDecrement = () => { this.store.decrement() };

  render() {
    const state = this.state
    const orderFlagFor = (field_name) => {
      return this.state.order.field === field_name && (this.state.order.desc ? '\u2191' : '\u2193')
    }

    return (
      <div style={{marginTop: '1em'}}>

        <h1>{this.store.nickName}</h1>
        <h1>{this.store.age}</h1>
        <button onClick={this.handleDecrement}>-1</button>
        <button onClick={this.handleIncrement}>+1</button>

        <Form onSubmit={this.handleSubmit} inline>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <InputGroup>
              <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
              <Input
                name="filter"
                type="search"
                value={state.filter}
                onChange={this.handleChange}
                placeholder="search by name and content ..."
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <InputGroup>
              <InputGroupAddon addonType="prepend">Group by</InputGroupAddon>
              <Select
                id="group"
                value={GROUP_BY[state.group]}
                onChange={this.handleGroupSelectChange}
                options={GROUP_BY}
                placeholder=" select ..."
              />
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
            {this.state.articles.map((article) => {
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
