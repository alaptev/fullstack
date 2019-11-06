## Tech stack:

Ruby 2.6.5

Rails 5.2.3

DB: Postgresql and sqlite3(dev env)


react@16.11.0

mobx@5.14.2

mobx-react@6.1.4


## Task description:

## Rails api back-end:

Given we have two models, Article and Story. Article has name, text and type (like blog post, facebook post or tweet).
Story has name and contains one or more articles.

There should be a single API enpoint that returns list of articles. Basing on query params list could be:

 - searched by article name or text
 - sorted on any field
 - grouped by any of field
 - grouped by story with totals:
   - article count
   - article type count
   - last article according to current sort
   

## UI

Display the data using React.JS and Mobx.

UI should consist of:

- table of articles with sort controls in column headers
- select box with options to group by
- search input field


## Realtime

Let's suppose there are two users are on the same page and if one of them will create/delete/update article, second user should see these changes in real time.


## Deploy

Deploy the project to server and provide SSH access
