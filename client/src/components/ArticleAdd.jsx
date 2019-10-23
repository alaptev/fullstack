import React, { Component } from 'react';
import axios from 'axios';
import { API_HOST, ARTICLE_TYPE } from '../constants'
import Select from 'react-select';
// import _ from 'lodash';
import find from 'lodash/find'

class ArticleAdd extends Component {
  constructor() {
    super();
    this.state = {
      stories: [],
      story: {},
      id: null, name: 'a', content: '', type: ARTICLE_TYPE[0]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    this.handleStorySelectChange = this.handleStorySelectChange.bind(this);
    this.handleStorySelectInputChange = this.handleStorySelectInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const transformToOptions = (data) => {
      return data.map((story) => {
          return { value: story.id, label: story.name}
        }
      )
    }

    axios(`${API_HOST}/api/stories.json`)
      .then((response) => {
        const stories = transformToOptions(response.data);
        this.setState( { stories: stories, story: stories[0] || {} });
      })
      .catch(error => console.log('error', error));

    //TODO: make requests one after another, not async
    const editArticleId = this.props.match.params.id

    const transformToState = (data) => {
      return {
        id: data.id, name: data.name, content: data.content, type: ARTICLE_TYPE[data.a_type - 1],
        story: find(this.state.stories, ['value', data.story_id])
      }
    }

    if (editArticleId) {
      axios.get(`${API_HOST}/api/stories/${editArticleId}.json`)
        .then((response) => {
          this.setState(transformToState(response.data));
        })
        .catch(error => console.log('error', error));
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const state = this.state;
    const data = {
      id: state.story.value,
      name: state.story.label,
      articles_attributes: [ { id: state.id, name: state.name, content: state.content, a_type: state.type.value} ]
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

  handleTypeSelectChange(selected) {
    console.log(`Type selected:`, selected);
    this.setState({ type: selected });
  }

  handleStorySelectChange(selected) {
    console.log(`Story selected:`, selected);
    this.setState({ story: selected });
  }

  handleStorySelectInputChange(selected) {
    console.log(`StoryInput selected:`, selected);
    if (!!selected) {
      const story = {value: '0', label: selected};
      this.setState({ stories: [story], story: story });
    }
  }

  handleDelete(event) {
    const ArticleId = this.props.match.params.id

    event.preventDefault();
    axios.delete(`${API_HOST}/api/stories/${ArticleId}.json`)
      .then(() => {
        this.props.history.push('/')
      })
      .catch(error => console.log('error', error));
  }

  render() {
    const editArticleId = this.props.match.params.id

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
              isDisabled={ editArticleId }
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
            onChange={this.handleTypeSelectChange}
            options={ARTICLE_TYPE}
          />
          <div className="btn-group">
            <button type="submit" className="btn btn-dark">{ editArticleId ? 'Update' : 'Create' }</button>
            { editArticleId && <button type="button" onClick={this.handleDelete} className="btn btn-outline-dark">Delete</button> }
            <button type="button" onClick={this.handleCancel} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ArticleAdd;
