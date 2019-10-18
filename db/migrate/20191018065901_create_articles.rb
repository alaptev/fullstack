class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.references :story
      t.string :name
      t.string :content
      t.integer :a_type

      t.timestamps
    end
  end
end
