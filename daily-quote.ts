import { editor } from "$sb/syscalls.ts";

export async function dailyQuote() {
  const quoteAPI = "https://api.quotable.io/quotes/random";
  const response = await fetch(quoteAPI);

  if(!response.ok) {
    throw new Error('Failed to fetch quote');
    await editor.flashNotification("Failed to fetch quote", "error");
  }

  const data = await response.json();
  const quoteData = Array.isArray(data) ? data[0] : data;

  if (quoteData.content && quoteData.author) {
    await editor.flashNotification("Fetched Quote Successfully!", "info");
    const quote = quoteData.content;
    const author = quoteData.author;
    const formattedQuote = `${quote}\n> — ${author}`;
    // return formattedQuote;
    await editor.insertAtCursor(
      formattedQuote
    );
  } else {
    throw new Error('No quote in response');
  }
}