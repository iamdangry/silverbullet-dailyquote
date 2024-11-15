import { editor, system } from "@silverbulletmd/silverbullet/syscalls";
import quotes from './quotes.json' with { type: "json" };

const VERSION = "0.4.0";

export async function showVersion() {
  await editor.flashNotification(`Daily Quote Version: ${VERSION}`)
}

async function loadSettings() {
  const defaultSettings = {
    includeTags: [],
    excludeTags: [],
    includeAuthors: [],
    excludeAuthors: []
  };
  const settingsFile = await system.getSpaceConfig("DailyQuote");
  const newSettings = { ...defaultSettings, ...settingsFile};
  return newSettings;
}

function getRandomIndex(indexLength: number) {
  const randomIndex = Math.floor(Math.random() * indexLength);
  return randomIndex;
}

async function getQuote() {
  const { includeTags, excludeTags, includeAuthors, excludeAuthors } = await loadSettings();

  const filteredQuotes = quotes.filter(quote => {
    const hasIncludedTag = includeTags.length === 0 || includeTags.some((tag: string) => quote.tags.includes(tag));
    const hasExcludedTag = excludeTags.some((tag: string) => quote.tags.includes(tag));
    const hasIncludedAuthor = includeAuthors.length === 0 || includeAuthors.includes(quote.author);
    const hasExcludedAuthor = excludeAuthors.includes(quote.author);
    
    return hasIncludedTag && !hasExcludedTag && hasIncludedAuthor && !hasExcludedAuthor;
  });

  if (filteredQuotes.length === 0) {
    await editor.flashNotification('No quotes match filters', 'error');
  }

  const quoteData = filteredQuotes[getRandomIndex(filteredQuotes.length)];

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
    await editor.flashNotification('No quote in response', "error");
  }
}
