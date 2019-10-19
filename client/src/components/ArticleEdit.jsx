import React from 'react';
import { get, patch } from 'axios';

class ArticleEdit extends React.Component {
  constructor() {
    super();
    this.state = { name: '', content: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const domain = 'http://localhost:3012'
    get(`${domain}/api/articles/${this.props.match.params.id}.json`)
      .then((response) => {
        this.setState(response.data);
      })
      .catch(error => console.log('error', error));
  }

  handleSubmit(event) {
    event.preventDefault();
    const domain = 'http://localhost:3012'
    patch(`${domain}/api/articles/${this.state.id}.json`, this.state)
      .then(() => {
        this.props.history.push(`/articles/${this.state.id}`);
      })
      .catch(error => console.log('error', error));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCancel() {
    this.props.history.push(`/articles/${this.state.id}`);
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
            <button type="button" onClick={this.handleCancel} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ArticleEdit;