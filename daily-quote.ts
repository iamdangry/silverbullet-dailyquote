import { readSetting } from "$sb/lib/settings_page.ts";
import quotes from './quotes.json' with { type: "json" };

async function loadSettings() {
  const defaultSettings = {
    tags: []
  };
  const settingsFile = await readSetting("DailyQuote", {});
  const newSettings = { ...defaultSettings, ...settingsFile};
  return newSettings;
}

function getRandomIndex(indexLength: number) {
  const randomIndex = Math.floor(Math.random() * indexLength);
  return randomIndex;
}

export async function dailyQuote() {
  const settings = await loadSettings();
  let filteredQuotes = quotes;

  if (settings.tags.length > 0) {
    console.log("Defined quote tags: " + settings.tags);
    const tag = settings.tags[getRandomIndex(settings.tags.length)];
    console.log("Selected tag: " + tag);
    filteredQuotes = quotes.filter(quote => quote.tags.includes(tag));
  } else {
    console.log("No tags set. Selecting from entire data set");
  }

  const quoteData = Array.isArray(filteredQuotes) ? filteredQuotes[getRandomIndex(filteredQuotes.length)] : filteredQuotes;

  if (quoteData.content && quoteData.author) {
    const quote = quoteData.content;
    const author = quoteData.author;
    console.log("Selected quote: " + quote + " - " + author);
    const formattedQuote = `> **quote** Quote\n> ${quote}\n> — ${author}`;
    return formattedQuote;
  } else {
    throw new Error('No quote in response');
  }
}