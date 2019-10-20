import React, { Component } from 'react';
import { get } from 'axios';
import { Link } from 'react-router-dom';
import { API_HOST, ARTICLE_TYPE } from '../constants';
import { Table } from 'reactstrap'

class ArticleList extends Component {
  constructor() {
    super();
    this.state = { articles: [] };
  }

  componentDidMount() {
    get(`${API_HOST}/api/stories.json`)
      .then(response => {
        this.setState({articles: response.data});
      })
      .catch(error => console.log('error', error));
  }

  render() {
    return (
      <div>
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
                  <td>{ARTICLE_TYPE[article.a_type]}</td>
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
