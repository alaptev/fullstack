import React, { Component } from 'react';
import axios from 'axios';
import { API_HOST, ARTICLE_TYPE } from '../constants'
import Select from 'react-select';

class ArticleAdd extends Component {
  constructor() {
    super();
    this.state = {
      stories: [],
      story: {},
      name: 'default article', content: '',
      type: ARTICLE_TYPE[0]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleStorySelectChange = this.handleStorySelectChange.bind(this);
    this.handleStorySelectInputChange = this.handleStorySelectInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const transformToOptions = (data) => {
      return data.map((story) => {
          return { stateVarName: 'story', value: story.id, label: story.name}
        }
      )
    }

    axios(`${API_HOST}/api/stories.json?stories_only=true`)
      .then((response) => {
        const stories = transformToOptions(response.data);
        this.setState( { stories: stories, story: stories[0] || {} });
      })
      .catch(error => console.log('error', error));
  }

  handleSubmit(event) {
    event.preventDefault();
    const state = this.state;
    const data = {
      id: state.story.value,
      name: state.story.label,
      articles_attributes: [ { name: state.name, content: state.content, a_type: state.type.value} ]
    };
    axios.post(`${API_HOST}/api/stories.json`, data)
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
    console.log(`Option selected:`, selected);
    this.setState({ [selected.stateVarName]: selected });
  }

  handleStorySelectChange(selected) {
    console.log(`Story selected:`, selected);
    this.setState({ story: selected });
  }

  handleStorySelectInputChange(selected) {
    console.log(`Input selected:`, selected);
    if (!!selected) {
      const story = {value: '0', label: selected};
      this.setState({ stories: [story], story: story });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Story Name</label>
            <Select
              value={this.state.story}
              onChange={this.handleStorySelectChange}
              onInputChange={this.handleStorySelectInputChange}
              options={this.state.stories}
              placeholder='enter story name ...'
            />
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
            value={this.state.type}
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
