# frozen_string_literal: true

class StoriesController < ApplicationController
  before_action :set_story, only: [:update]
  before_action :set_article, only: [:destroy]

  # GET /stories
  def index
    p = permitted_params
    order_by = (p[:order]).to_s
    order_by += ' DESC' if p[:desc] == 'true'
    group_by_field = GROUP_BY[p[:group]] ? GROUP_BY[p[:group]][:field_name] : ''
    data = if p[:with_articles] == 'true'
             # TODO: anton: add grouped by story with totals
             if group_by_field.present?
               ids = Article.select('max(id) as id').group(group_by_field).map(&:id)
               articles = Article.select('articles.*, stories.name AS story_name').joins(:story)
                            .where('(articles.name LIKE ? OR articles.content LIKE ?) AND articles.id in (?)', "%#{p[:filter]}%", "%#{p[:filter]}%", ids)
                            .order(order_by).order('articles.id')
             else
               articles = Article.select('articles.*, stories.name AS story_name').joins(:story)
                            .where('articles.name LIKE ? OR articles.content LIKE ?', "%#{p[:filter]}%", "%#{p[:filter]}%")
                            .order(order_by).order('articles.id')
             end

             { storiesWithArticles: articles }
           elsif p[:article_id]
             { storiesOnly: Story.all,
               articleToEdit: Article.find(p[:article_id]) }
           else
             { storiesOnly: Story.all }
           end

    render json: data
  end

  # POST /stories
  # create new story and new article
  def create
    @story = Story.new(create_params)

    if @story.save
      render json: @story, status: :created, location: @story
    else
      render json: @story.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /stories/:id
  # :id - this is story_id
  # create/update article for existent story
  def update
    if @story.update(update_params)
      render json: @story
    else
      render json: @story.errors, status: :unprocessable_entity
    end
  end

  # DELETE /stories/:id
  # :id - this is article id
  # delete the article and story(if it is empty)
  def destroy
    @article.destroy
    @article.story.destroy if @article.story.articles.count == 0
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_story
    @story = Story.find(params[:id])
  end

  def set_article
    @article = Article.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def create_params
    params.require(:story).permit(:name, articles_attributes: %i[name content a_type])
  end

  def update_params
    params.require(:story).permit(:id, :name, articles_attributes: %i[id name content a_type])
  end

  def permitted_params
    params.permit(:with_articles, :article_id, :filter, :order, :desc, :group)
  end

  GROUP_BY = {
    '0' => { value: '0', field_name: '',           label: 'no group' },
    '1' => { value: '1', field_name: 'story_id',   label: 'Story Name' },
    '2' => { value: '2', field_name: 'name',       label: 'Article Name' },
    '3' => { value: '3', field_name: 'content',    label: 'Article Content' },
    '4' => { value: '4', field_name: 'a_type',     label: 'Article Type' }
  }.freeze
end
