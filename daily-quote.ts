import { readSetting } from "$sb/lib/settings_page.ts";
import quotes from './quotes.json' with { type: "json" };

async function loadSettings() {
  const defaultSettings = {
    includeTags: [],
    excludeTags: [],
    includeAuthors: [],
    excludeAuthors: []
  };
  const settingsFile = await readSetting("DailyQuote", {});
  const newSettings = { ...defaultSettings, ...settingsFile};
  return newSettings;
}

function getRandomIndex(indexLength: number) {
  const randomIndex = Math.floor(Math.random() * indexLength);
  return randomIndex;
}

async function getQuote() {
  const settings = await loadSettings();
  let filteredQuotes = quotes;

  if (settings.includeTags.length > 0) {
    console.log("Defined quote tags: " + settings.includeTags);
    const tag = settings.includeTags[getRandomIndex(settings.includeTags.length)];
    console.log("Selected tag: " + tag);
    filteredQuotes = quotes.filter(quote => quote.tags.includes(tag));
  } else {
    console.log("No tags set. Selecting from entire data set");
  }

  if (settings.excludeTags.length > 0) {
    console.log("Defined exclude tags: " + settings.excludeTags);
    filteredQuotes = filteredQuotes.filter(quote => 
      !settings.excludeTags.some(excludeTag => quote.tags.includes(excludeTag))
    );
  }

  if (settings.includeAuthors.length > 0) {
    console.log("Include authors: " + settings.includeAuthors);
    filteredQuotes = filteredQuotes.filter(quote => settings.includeAuthors.includes(quote.author)
    );
  }

  if (settings.excludeAuthors.length > 0) {
    console.log("Exclude authors: " + settings.excludeAuthors);
    filteredQuotes = filteredQuotes.filter(quote => !settings.excludeAuthors.includes(quote.author)
    );
  }

  if (filteredQuotes.length === 0) {
    throw new Error('No quotes match filters');
  }

  const quoteData = Array.isArray(filteredQuotes) ? filteredQuotes[getRandomIndex(filteredQuotes.length)] : filteredQuotes;

  return quoteData;
}

export async function dailyQuote() {
  const quoteData = await getQuote();

  if (quoteData.content && quoteData.author) {
    const quote = quoteData.content;
    const author = quoteData.author;
    console.log("Selected quote: " + quote + " - " + author);
    const formattedQuote = `${quote}\n> — ${author}`;
    return formattedQuote;
  } else {
    throw new Error('No quote in response');
  }
}
