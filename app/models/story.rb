class Story < ApplicationRecord
  has_many :articles, inverse_of: :story

  validates :name, presence: true

  # https://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html
  accepts_nested_attributes_for :articles #, reject_if: proc { |attributes| attributes['name'].blank? }
  # accepts_nested_attributes_for :articles, allow_destroy: true
end
