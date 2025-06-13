# digitalpressai-backend

To install dependencies:

```bash
bun install
```

The backend can be started on its own with:

```bash
bun run server.ts
```

During development it is usually launched together with the frontend via
`../start.sh`.

## Database

The backend uses a lightweight SQLite database stored in `stories.db`.
The `stories` table has the following columns:

| Column    | Type    | Description                      |
|-----------|---------|----------------------------------|
| `id`      | INTEGER | Primary key                      |
| `title`   | TEXT    | Title of the generated story     |
| `body`    | TEXT    | Story body text                  |
| `sentiment` | REAL  | Sentiment score returned by the model |

## API

- `POST /generate` – Generate a story and sentiment score. When using the
  `Thorin` model the result is saved to the database and the created `id` is
  returned.
- `GET /stories` – List all stored stories.
- `GET /stories/:id` – Retrieve a single story by `id`.
- `POST /stories` – Manually create a story record.
- `PUT /stories/:id` – Update a stored story.
- `DELETE /stories/:id` – Remove a story from the database.

This project was created using `bun init` in bun v1.0.19. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
