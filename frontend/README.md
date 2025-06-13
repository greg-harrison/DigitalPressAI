# digitalpressai

To install dependencies:

```bash
bun install
```

To run the story generator UI you need both the backend and the frontend running.

Start the backend from the project root:

```bash
bun run ../backend/server.ts
```

In another terminal start the frontend:

```bash
bun run index.ts
```

Once both servers are running open `http://localhost:3000` in your browser.
Enter a prompt and the page will display the generated story and its sentiment score returned by the backend.

This project was created using `bun init` in bun v1.0.19. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
