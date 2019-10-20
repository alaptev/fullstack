import React, { Component } from 'react';
import { post } from 'axios';
import { API_HOST } from '../constants'

class ArticleAdd extends Component {
  constructor() {
    super();
    // this.state = { story_id: '1', name: '', content: '', a_type: '1'};
    this.state = { name: 'story 2222', articles_attributes: [ { name: 'test', content: 'asdfsdf', a_type: '1'} ]};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    post(`${API_HOST}/api/stories.json`, this.state)
      .then((response) => {
        this.props.history.push('/articles');
      })
      .catch(error => console.log('error', error));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCancel() {
    this.props.history.push("/articles");
  }

  render() {
    return (
      <div>
        <h4>Create Article</h4>
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
            <button type="submit" className="btn btn-dark">Create</button>
            <button type="button" onClick={this.handleCancel} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ArticleAdd;
