class Article < ApplicationRecord
  # a_type:
  # 1-'blog',
  # 2-'facebook',
  # 3-'tweet'
  belongs_to :story, inverse_of: :articles
  validates_presence_of :story

  # validates :name, presence: true #, uniqueness: true
  # validates :content, presence: true
  # validates :a_type, presence: true
end
