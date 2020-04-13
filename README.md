# Memories app bootstrap

## `memories/general.js`

List of the years, with a quick summary for each of them.

## `memories/${year}.js`

Definition of each memories. The media have to be in the media directory. Each memories has its media directory (media/${year}/${slugWithoutTheYear}).

## Bump version to disable browser cache

Once you added memories, update the date in the index.html: `styles.css?200413`. This hash will be used by the JS importer.
