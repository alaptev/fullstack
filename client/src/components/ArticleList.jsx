import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ARTICLE_TYPE, GROUP_BY } from '../constants';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, Table } from 'reactstrap';
import Select from 'react-select';
import { observer } from 'mobx-react'
import { articleListStore } from '../articleListStore'

@observer class ArticleList extends Component {

  constructor (props) {
    super(props);
    this.store = new articleListStore();
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
