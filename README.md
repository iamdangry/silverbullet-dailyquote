
# SilverBullet Daily Quote Plug

This plug uses a copy of the [Quoteables Data](https://github.com/quotable-io/data).

Originally I built this using the Templater plugin built for Obsidian as inspiration, so it is currently only tailored to insert quotes into a template inside an admonition.

## Installation

### PLUG

If you would like to install this plug straight from Github simply add the below to your `PLUGS` file, run `Plugs: Update`:

```
- https://github.com/iamdangry/silverbullet-dailyquote/releases/latest/download/daily-quote.plug.js
```

### Space Script

Due to a limitation within SilverBullet to call a plug from a template, the following space script is required.

```space-script
silverbullet.registerFunction({name: "fetchDailyQuote"}, async () => {
  return await syscall("system.invokeFunction", "daily-quote.dailyQuote");
})
```

### Template

Within your template, call this space-script:

```
> **quote** Quote
> {{fetchDailyQuote}}
```

I use the custom quote admonition from [this community post](https://community.silverbullet.md/t/additional-admonition-types/281/3).

### Settings

Daily Quote plugin can either be set to select from the entire data set, include/exclude certain tags, include/exclude authors or a mix of both. This can be defined in the SETTINGS page like below:

```yaml
DailyQuote:
  includeTags: ["Wisdom", "Success", "Famous Quotes"]
  excludeTags: ["Change", "Life"]
  includeAuthors: ["Confucius"]
  excludeAuthors: ["Anatole France"]
```

Be careful not to define too many/narrow filter as this rapidly reduces the number of results returned and could lead to no results being returned.

#### Available Tags

Age, Athletics, Business, Change, Character, Competition, Conservative, Courage, Creativity, Education, Failure, Faith, Family, Famous Quotes, Film, Freedom, Friendship, Future, Generosity, Genius, Gratitude, Happiness, Health, History, Honor, Humor, Humorous, Imagination, Inspirational, Knowledge, Leadership, Life, Literature, Love, Mathematics, Motivational, Nature, Opportunity, Perseverance, Philosophy, Polictics, Power Quotes, Proverb, Religion, Sadness, Science, Self, Self Help, Social Justice, Society, Spirituality, Sports, Stupidity, Success, Technology, Time, Tolerance, Truth, Virtue, War, Weakness, Wellness, Wisdom, Work
