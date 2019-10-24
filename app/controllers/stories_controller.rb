class StoriesController < ApplicationController
  before_action :set_story, only: [:update]
  before_action :set_article, only: [:destroy]

  # GET /stories
  def index
    p = permitted_params
    order_by = "#{p[:order]}"
    order_by = order_by + " DESC" if p[:desc] == '1'
    data = if p[:with_articles]
             articles = Article.select('articles.*, stories.name AS story_name')
                          .joins(:story)
                          .where('articles.name LIKE ? OR articles.content LIKE ?', "%#{p[:filter]}%", "%#{p[:filter]}%")
                          .order(order_by)
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
      p = params.require(:story).permit( :name, articles_attributes: [ :name, :content, :a_type ])
      logger.info "---log--- params = '#{p.inspect}' "
      p
    end

  def update_params
    p = params.require(:story).permit( :id, :name, articles_attributes: [ :id, :name, :content, :a_type ])
    logger.info "---log--- params = '#{p.inspect}' "
    p
  end

  def permitted_params
    p = params.permit(:with_articles, :article_id, :filter, :order, :desc)
    logger.info "---log--- params = '#{p.inspect}' "
    p
  end
end
