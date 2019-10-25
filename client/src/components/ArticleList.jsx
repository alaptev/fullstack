import React, { Component } from 'react';
import { get } from 'axios';
import { Link } from 'react-router-dom';
import { API_HOST, ARTICLE_TYPE, GROUP_BY } from '../constants';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, Table } from 'reactstrap';
import Select from 'react-select';
import isBoolean from 'lodash/isBoolean';

class ArticleList extends Component {
  constructor() {
    super();
    this.state = {
      filter: '',
      group: 0,
      order: {},
      articles: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGroupSelectChange = this.handleGroupSelectChange.bind(this);

    this.handleStoryNameOrderClick = this.handleStoryNameOrderClick.bind(this);
    this.handleNameOrderClick = this.handleNameOrderClick.bind(this);
  }

  componentDidMount() {
    get(`${API_HOST}/api/stories.json?with_articles=true`)
      .then(response => {
        this.setState({articles: response.data.storiesWithArticles});
      })
      .catch(error => console.log('error', error));
  }

  handleChange(event) {
    this.setState( { [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getArticles();
  }

  handleGroupSelectChange(selected) {
    console.log(`Group selected:`, selected);
    this.setState({ group: selected.value });
  }

  handleStoryNameOrderClick(event) {
    this.setState( (state) => { return {order: {story_name: !state.order.story_name}}})
    this.getArticles();
  }

  handleNameOrderClick(event) {
    this.setState((state) => { return {order: {name: !state.order.name}}})
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

  render() {
    const state = this.state

    return (
      <div style={{marginTop: '1em'}}>

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
                onClick={this.handleStoryNameOrderClick}>
                Story { isBoolean(this.state.order.story_name) && (this.state.order.story_name ? 'A' : 'V') }
              </Button>
            </th>
            <th>
              <Button
                onClick={this.handleNameOrderClick}>
                Article Name { isBoolean(this.state.order.name) && (this.state.order.name ? 'A' : 'V') }
              </Button>
            </th>
            <th>
              Content
            </th>
            <th>
              Type
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
