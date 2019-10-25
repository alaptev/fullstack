import React, { Component } from 'react';
import { get } from 'axios';
import { Link } from 'react-router-dom';
import { API_HOST, ARTICLE_TYPE, GROUP_BY } from '../constants';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, Table } from 'reactstrap';
import Select from 'react-select'

class ArticleList extends Component {
  constructor() {
    super();
    this.state = {
      filter: '',
      group: 0,
      articles: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGroupSelectChange = this.handleGroupSelectChange.bind(this);

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
    const params = {
      filter: this.state.filter,
      group: this.state.group
    }
    get(`${API_HOST}/api/stories.json?with_articles=true`, { params: params })
      .then(response => {
        this.setState({articles: response.data.storiesWithArticles});
      })
      .catch(error => console.log('error', error));
  }

  handleGroupSelectChange(selected) {
    console.log(`Group selected:`, selected);
    this.setState({ group: selected.value });
  }

  render() {
    const state = this.state

    return (
      <div>
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
            <th>Story</th>
            <th>Article Name</th>
            <th>Content</th>
            <th>Type</th>
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
