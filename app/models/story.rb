class Story < ApplicationRecord
  has_many :articles #, dependent: :destroy

  # validates :name, presence: true, uniqueness: true

  # https://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html
  accepts_nested_attributes_for :articles #, reject_if: proc { |attributes| attributes['name'].blank? }
  # accepts_nested_attributes_for :articles, allow_destroy: true
end
