import React from 'react';
import axios from 'axios';
import { API_HOST } from '../constants'

class ArticleEdit extends React.Component {
  constructor() {
    super();
    this.state = { story_id: '1', name: '', content: '', a_type: '1' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    axios.get(`${API_HOST}/api/articles/${this.props.match.params.id}.json`)
      .then((response) => {
        this.setState(response.data);
      })
      .catch(error => console.log('error', error));
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.patch(`${API_HOST}/api/articles/${this.state.id}.json`, this.state)
      .then(() => {
        this.props.history.push('/');
      })
      .catch(error => console.log('error', error));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCancel() {
    this.props.history.push('/');
  }

  handleDelete(event) {
    event.preventDefault();
    axios.delete(`${API_HOST}/api/articles/${this.state.id}.json`)
      .then(() => {
        // it is essentially a redirect
        this.props.history.push('/')
      })
      .catch(error => console.log('error', error));
  }
  
  render() {
    return (
      <div>
        <h1>Edit {this.state.name}</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea name="content" rows="5" value={this.state.content} onChange={this.handleChange} className="form-control" />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-dark">Update</button>
            <button onClick={this.handleDelete} className="btn btn-outline-dark">Delete</button>
            <button type="button" onClick={this.handleCancel} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ArticleEdit;