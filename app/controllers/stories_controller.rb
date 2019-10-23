class StoriesController < ApplicationController
  before_action :set_story, only: [:update]
  before_action :set_article, only: [:show, :destroy]

  # GET /stories
  def index
    if get_story_params[:with_articles]
      @stories = Story.joins(:articles).select('articles.*, stories.name AS story_name')
    else
      @stories = Story.all
    end

    render json: @stories
  end

  # GET /stories/:id
  # :id - this is article id
  def show
    # TODO: anton: remove sleep and make requests one after another, not async
    sleep 1
    
    render json: @article
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

  def get_story_params
    p = params.permit(:with_articles)
    logger.info "---log--- params = '#{p.inspect}' "
    p
  end
end
