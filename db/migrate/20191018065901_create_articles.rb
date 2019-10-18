class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.string :name
      t.string :text
      t.integer :type

      t.timestamps
    end
  end
end
