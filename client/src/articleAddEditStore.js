import { API_HOST } from './host_constants'
import axios from 'axios'
import { action, configure, decorate, observable, runInAction } from 'mobx'
import find from 'lodash/find'

configure({ enforceActions: 'observed' });

export class articleAddEditStore {
  stories = []
  story = {}
  article = { id: null, name: '', content: '', a_type: 1 }

  constructor(props) {
    this.props = props
  }

  getArticleAndStories() {
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
          runInAction( () => { this.stories = storiesOnly; this.story = story; this.article = article });
        } else {
          const story = storiesOnly[0] || {}
          runInAction( () => { this.stories = storiesOnly; this.story = story });
        }
      })
      .catch(error => console.log('error', error));

  }
  typeSelectChange({ value }) { this.article.a_type = value }
  textChange({ target }) { this.article[target.name] = target.value }
  storySelectChange(selected) { this.story = selected }
  storySelectInputChange(text) { !!text && (this.story = {value: null, label: text}) }
  submit(event) {
    event.preventDefault();
    const data = {
      id: this.story.value,
      name: this.story.label,
      articles_attributes: [ this.article ]
    };
    let config = { data: data }

    if (data.id) { // create/update article for existent story
      config = { ...config,  method: 'patch', url: `${API_HOST}/api/stories/${data.id}` }
    } else { // create new story and new article
      config = { ...config,  method: 'post', url: `${API_HOST}/api/stories.json` }
    }

    axios(config)
      .then((response) => { this.props.history.push('/') })
      .catch(error => console.log('error', error));
  }
  delete(event) {
    const ArticleId = this.props.match.params.id

    event.preventDefault();
    axios.delete(`${API_HOST}/api/stories/${ArticleId}.json`)
      .then(() => { this.props.history.push('/') })
      .catch(error => console.log('error', error));
  }
  cancel() { this.props.history.push("/") }
}

decorate( articleAddEditStore, {
  stories: observable,
  story: observable,
  article: observable,

  typeSelectChange: action.bound,
  textChange: action.bound,
  storySelectChange: action.bound,
  storySelectInputChange: action.bound,
  submit: action.bound,
  delete: action.bound
})
