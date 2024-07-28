// import { editor } from "$sb/syscalls.ts";
import quotes from './quotes.json' with { type: "json" };

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return randomIndex;
}

export function dailyQuote() {

  const quoteData = Array.isArray(quotes) ? quotes[getRandomQuote()] : quotes;

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