import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ARTICLE_TYPE, GROUP_BY } from '../constants';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, Table } from 'reactstrap';
import Select from 'react-select';
import { observer } from 'mobx-react'
import { articleListStore } from '../articleListStore'
import { trace } from "mobx" // for debug only!!!  https://mobx.js.org/best/trace.html

@observer class ArticleList extends Component {

  constructor (props) {
    super(props);
    this.store = new articleListStore();
  }

  componentDidMount () { this.store.getArticles() }

  render() {
    const store = this.store
    const orderFlagFor = (field_name) => {
      return this.store.order === field_name && (this.store.desc ? '\u2191' : '\u2193')
    }

    return (
      <div style={{marginTop: '1em'}}>
        <Form onSubmit={store.submit} inline>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <InputGroup>
              <InputGroupAddon addonType="prepend">Search</InputGroupAddon>
              <Input
                name="filter"
                type="search"
                value={store.filter}
                onChange={store.filterChange}
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
                  onChange={store.groupSelectChange}
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
                onClick={store.orderClick}>
                Story { orderFlagFor('story_name') }
              </Button>
            </th>
            <th>
              <Button
                name='name'
                onClick={store.orderClick}>
                Article Name { orderFlagFor('name') }
              </Button>
            </th>
            <th>
              <Button
                name='content'
                onClick={store.orderClick}>
                Content { orderFlagFor('content') }
              </Button>
            </th>
            <th>
              <Button
                name='a_type'
                onClick={store.orderClick}>
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
