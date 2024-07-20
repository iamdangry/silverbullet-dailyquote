// import { editor } from "$sb/syscalls.ts";

export async function dailyQuote() {
  const quoteAPI = "https://api.quotable.io/quotes/random";
  const response = await fetch(quoteAPI);

  if(!response.ok) {
    throw new Error('Failed to fetch quote');
  }

  const data = await response.json();
  const quoteData = Array.isArray(data) ? data[0] : data;

  if (quoteData.content && quoteData.author) {
    const quote = quoteData.content;
    const author = quoteData.author;
    const formattedQuote = `${quote}\n> — ${author}`;
    console.log(formattedQuote);
    return formattedQuote;
  } else {
    throw new Error('No quote in response');
  }
}