class Article < ApplicationRecord
  # a_type:
  # 1-'blog',
  # 2-'facebook',
  # 3-'tweet'
  belongs_to :story
end
