# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

stories = Story.create([
  {name: "Story One"},
  {name: "Story Two"}
])

stories[0].articles.create([
  {name: "Article One", content: "Content of the article one.", a_type: 1},
  {name: "Article Two", content: "Content of the article tow.", a_type: 2},
  {name: "Article Three", content: "Content of the article three.", a_type: 1}
])

stories[1].articles.create([
  {name: "Article 4", content: "Content of the article 4.", a_type: 2},
  {name: "Article 5", content: "Content of the article 5.", a_type: 3}
])
