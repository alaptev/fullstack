import React, { Component } from 'react';
import { post } from 'axios';
import { API_HOST, ARTICLE_TYPE } from '../constants'
import Select from 'react-select';

class ArticleAdd extends Component {
  constructor() {
    super();
    this.state = { story_name: 'default story', name: 'default article', content: '', a_type: '1' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const state = this.state;
    const data = {
      name: state.story_name,
      articles_attributes: [ { name: state.name, content: state.content, a_type: state.a_type} ]
    };
    post(`${API_HOST}/api/stories.json`, data)
      .then((response) => {
        this.props.history.push('/');
      })
      .catch(error => console.log('error', error));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCancel() {
    this.props.history.push("/");
  }

  handleSelectChange(selected) {
    // console.log(`Option selected:`, selected);
    if (!!selected && this.state.a_type !== selected.value) {
      // this.setState({ [selected.name]: selected.value });
      this.setState({ a_type: selected.value });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Story Name</label>
            <input type="text" name="story_name" value={this.state.story_name} onChange={this.handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Article Name</label>
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea name="content" rows="5" value={this.state.content} onChange={this.handleChange} className="form-control" />
          </div>
          <Select
            value={ARTICLE_TYPE[this.state.a_type - 1]}
            onChange={this.handleSelectChange}
            options={ARTICLE_TYPE}
          />
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
