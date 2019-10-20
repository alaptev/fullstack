class StoriesController < ApplicationController
  before_action :set_story, only: [:show, :update, :destroy]

  # GET /stories
  def index
    # @stories = Story.includes(:articles)
    # @stories = Article.includes(:story)
    # @stories = Story.joins(:articles)
    # @stories = Article.joins(:story)
    @stories = Story.joins(:articles).select('articles.*, stories.name AS story_name')

    render json: @stories
  end

  # GET /stories/1
  def show
    render json: @story
  end

  # POST /stories
  def create
    @story = Story.new(story_params)

    if @story.save
      render json: @story, status: :created, location: @story
    else
      render json: @story.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /stories/1
  def update
    if @story.update(story_params)
      render json: @story
    else
      render json: @story.errors, status: :unprocessable_entity
    end
  end

  # DELETE /stories/1
  def destroy
    @story.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_story
      @story = Story.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def story_params
      p = params.require(:story).permit(:name, articles_attributes: [ :id, :name, :content, :a_type ])
      logger.info "---log--- params = '#{p.inspect}' "
      p
    end
end
