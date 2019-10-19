import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class ArticleInfo extends Component {
  constructor() {
    super();
    this.state = { article: {} };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const domain = 'http://localhost:3012'
    axios.get(`${domain}/api/articles/${this.props.match.params.id}.json`)
      .then((response) => {
        this.setState({
          article: response.data
        })
      })
      .catch(error => console.log('error', error));
  }

  handleDelete() {
    const domain = 'http://localhost:3012'
    axios.delete(`${domain}/api/articles/${this.props.match.params.id}.json`)
      .then(() => {
        // it is essentially a redirect
        this.props.history.push("/articles")
      })
      .catch(error => console.log('error', error));
  }

  render() {
    return (
      <div>
        <h2>{this.state.article.id}: {this.state.article.name}</h2>
        <p>{this.state.article.content}</p>
        <p>
          <Link to={`/articles/${this.state.article.id}/edit`} className="btn btn-outline-dark">Edit</Link>
          <button onClick={this.handleDelete} className="btn btn-outline-dark">Delete</button>
          <Link to="/articles" className="btn btn-outline-dark">Close</Link>
        </p>
        <hr/>
      </div>
    )
  }
}

export default ArticleInfo;
