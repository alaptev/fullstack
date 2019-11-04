import React, { Component } from 'react';
import { ARTICLE_TYPE } from '../constants'
import Select from 'react-select';
import { articleAddEditStore } from '../articleAddEditStore'
import { observer } from 'mobx-react'
import { trace } from "mobx" // for debug only!!! https://mobx.js.org/best/trace.html

@observer class ArticleAddEdit extends Component {
  constructor (props) {
    super(props);
    this.store = new articleAddEditStore(props);
  }

  componentDidMount() { this.store.getArticleAndStories() }

  render() {
    // trace(true) // enter the debugger whenever an observable value causes this component to re-run
    const editArticleId = this.props.match.params.id
    const store = this.store

    // TODO: add js validation for form fields
    return (
      <div>
        <form onSubmit={store.submit}>
          <div className="form-group">
            <label>Story Name</label>
            <Select
              value={store.story}
              onChange={store.storySelectChange}
              onInputChange={store.storySelectInputChange}
              options={store.stories}
              placeholder='enter story name ...'
              isDisabled={ editArticleId }
            />
          </div>
          <div className="form-group">
            <label>Article Name</label>
            <input type="text" name="name" value={store.article.name} onChange={store.textChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea name="content" rows="5" value={store.article.content} onChange={store.textChange} className="form-control" />
          </div>
          <Select
            value={ARTICLE_TYPE[store.article.a_type - 1]}
            onChange={store.typeSelectChange}
            options={ARTICLE_TYPE}
          />
          <br />
          <div className="btn-group">
            <button type="submit" className="btn btn-dark">{ editArticleId ? 'Update' : 'Create' }</button>
            { editArticleId && <button type="button" onClick={store.delete} className="btn btn-outline-dark">Delete</button> }
            <button type="button" onClick={store.cancel.bind(this)} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ArticleAddEdit;
