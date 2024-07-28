
# SilverBullet Daily Quote Plug

This plug was built due to Quoteables API being down.

This plug uses a copy of the [Quoteables Data](https://github.com/quotable-io/data).

Originally I built this using the Templater plugin built for Obsidian as inspiration, so it is currently only tailored to insert quotes into a template inside an admonition.

## Installation

### PLUG

If you would like to install this plug straight from Github simply add the below to your `PLUGS` file, run `Plugs: Update`:

```
- github:iamdangry/silverbullet-dailyquote/daily-quote.plug.js
```

### Space Script

Due to a limitation within SilverBullet to call a plug from a template, the following space script needs to be added to your space.

```space-script
silverbullet.registerFunction({name: "fetchDailyQuote"}, async () => {
  return await syscall("system.invokeFunction", "Daily-Quote.dailyQuote");
})
```

### Template

Within your template, call this space-script:

```
> **quote** Quote
> {{fetchDailyQuote}}
```

I use the custom quote admonition from [this](https://community.silverbullet.md/t/additional-admonition-types/281/3) communitiy post.
