# frozen_string_literal: true

class Article < ApplicationRecord
  belongs_to :story, inverse_of: :articles
  validates_presence_of :story

  validates :name, presence: true
  validates :content, presence: true
  # a_type:
  # 1-'blog',
  # 2-'facebook',
  # 3-'tweet'
  validates :a_type, presence: true
end
