import React, { Component } from 'react';
import axios from 'axios';
import { API_HOST, ARTICLE_TYPE } from '../constants'
import Select from 'react-select';
import find from 'lodash/find'

// TODO: use MobX
class ArticleAddEdit extends Component {
  constructor (props) {
    super(props);
    this.state = {
      stories: [],
      story: {},
      article: { id: null, name: '', content: '', a_type: 1 }
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTypeSelectChange = this.handleTypeSelectChange.bind(this);
    this.handleStorySelectChange = this.handleStorySelectChange.bind(this);
    this.handleStorySelectInputChange = this.handleStorySelectInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const editArticleId = this.props.match.params.id
    const params = editArticleId && { article_id: editArticleId }

    const transformStoriesToOptions = (data) => {
      return data.storiesOnly && data.storiesOnly.map((story) => {
          return { value: story.id, label: story.name}
        }
      )
    }

    axios(`${API_HOST}/api/stories.json`, { params: params })
      .then((response) => {
        const storiesOnly = transformStoriesToOptions(response.data);
        if (editArticleId) {
          const article = response.data.articleToEdit
          const story = find(storiesOnly, ['value', article.story_id])
          this.setState( { stories: storiesOnly, story: story, article: article });
        } else {
          const story = storiesOnly[0] || {}
          this.setState( { stories: storiesOnly, story: story });
        }
      })
      .catch(error => console.log('error', error));

  }

  handleSubmit(event) {
    event.preventDefault();
    const { story, article } = this.state;
    const data = {
      id: story.value,
      name: story.label,
      articles_attributes: [ article ]
    };
    let config = { data: data }

    if (data.id) { // create/update article for existent story
      config = { ...config,  method: 'patch', url: `${API_HOST}/api/stories/${data.id}` }
    } else { // create new story and new article
      config = { ...config,  method: 'post', url: `${API_HOST}/api/stories.json` }
    }

    axios(config)
      .then((response) => {
        this.props.history.push('/');
      })
      .catch(error => console.log('error', error));
  }

  handleTextChange({ target }) {
    this.setState( (state) => { return { article: { ...state.article, [target.name]: target.value } } });
  }

  handleCancel() {
    this.props.history.push("/");
  }

  handleTypeSelectChange({ value }) {
    this.setState((state) => { return { article: { ...state.article, a_type: value } } });
  }

  handleStorySelectChange(selected) {
    this.setState({ story: selected });
  }

  handleStorySelectInputChange(text) {
    !!text && this.setState({ story: {value: null, label: text} });
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
    const {article, story, stories} = this.state

    // TODO: add js validation for form fields
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Story Name</label>
            <Select
              value={story}
              onChange={this.handleStorySelectChange}
              onInputChange={this.handleStorySelectInputChange}
              options={stories}
              placeholder='enter story name ...'
              isDisabled={ editArticleId }
            />
          </div>
          <div className="form-group">
            <label>Article Name</label>
            <input type="text" name="name" value={article.name} onChange={this.handleTextChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea name="content" rows="5" value={article.content} onChange={this.handleTextChange} className="form-control" />
          </div>
          <Select
            value={ARTICLE_TYPE[article.a_type - 1]}
            onChange={this.handleTypeSelectChange}
            options={ARTICLE_TYPE}
          />
          <br />
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

export default ArticleAddEdit;
