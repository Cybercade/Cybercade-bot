# ✨ Cybercade Bot ✨

Welcome to **Cybercade Bot**! A versatile Discord bot designed to enrich your server with music, news feeds, and much more. This project is based on the robust **tscord** template, which in turn is built upon the powerful **discordx-ts** framework and developed in TypeScript.

![Cybercade Bot-Banner](https://camo.githubusercontent.com/81c6e2a2801cfaf7c3a9401c80a0796f619536b224cbc869d93abf2074debb4f/68747470733a2f2f64726976652e637962657263612e64652f617070732f66696c65735f73686172696e672f7075626c6963707265766965772f64715164616f6264797a51705335773f66696c653d2f2666696c6549643d39303326783d3334343026793d3134343026613d7472756526657461673d36376564643433333139363265) ---

## 🌟 Features

**Cybercade Bot** offers a growing range of features to support and entertain your Discord community:

### Currently Available:
* 🎶 **Music Playback:**
    * Play music from YouTube, Spotify and SoundCloud.
    * Queue management (add, remove, view).
    * Play, pause, skip and stop controls.
    * Displays the currently playing song.
* 📰 **RSS Feed Subscriptions:**
    * Subscribe to RSS feeds from your favorite websites.
    * Automatic notifications in designated channels for new posts.
    * Manage your subscriptions (add, remove, list).

### 🚀 Planned Features (Roadmap):
* 🛡️ **Role and Permission Management:**
    * Fine-grained control over who can use which commands.
    * Configurable auto-roles on join or other events.
* 📺 **YouTube & Twitch Channel Subscriptions:**
    * Notifications when subscribed YouTube channels upload new videos.
    * Notifications when subscribed Twitch streamers go live.
* 🎫 **Ticket System:**
    * Easy creation and management of support tickets by users.
    * Configurable ticket categories and assigned support teams.
* And much more! Suggestions are welcome!

---

## 🛠️ Technology Stack

* **Framework:** [discordx-ts](https://discordx.js.org/) (via [tscord Template](https://github.com/oceanroleplay/tscord))
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Runtime Environment:** [Node.js](https://nodejs.org/)
* **Discord API Library:** [discord.js](https://discord.js.org/)
* **(Optional, if you use a database, e.g., for RSS feeds):** [SQLite (planned to get replaced)](https://sqlite.org/index.html)

---

## ⚙️ Prerequisites

Before you start, make sure you have the following software installed:

* Node.js (v16.9.0 or higher recommended)
* npm

---

## 🚀 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)Cybercade/Cybercade-bot.git
    cd [Your Repo Name]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configuration:**
    * Copy the `.env.example` file to `.env`:
        ```bash
        cp .env.example .env
        ```
    * Open the `.env` file and fill in the necessary environment variables:
        ```dotenv
        # Your Discord Bot Token (found in the Discord Developer Portal)
        BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
        
        # (Optional) The ID of your test server (Guild ID) for quick deployment of slash commands during development
        DEV_GUILD_ID=YOUR_TEST_SERVER_ID
        ```
    * **IMPORTANT:** Never commit your `.env` file or your tokens to Git! It is already listed in `.gitignore`.

4.  **Compile the TypeScript code:**
    ```bash
    npm run build
    ```

5.  **Start the bot:**
    * For production mode:
        ```bash
        npm start
        ```
    * For development mode with automatic restart on changes (using `ts-node-dev`):
        ```bash
        npm run dev
        ```

6.  **Register Slash Commands:**
    On the first start (or when new commands are added), slash commands need to be registered with Discord. This usually happens automatically at bot startup through `discordx`.

---

## 📖 Usage

**Cybercade Bot** primarily uses Slash Commands (`/`) for modern and intuitive operation.

### Music Commands (Examples):
* `/music play <song-name or YouTube-URL>`: Plays a song or adds it to the queue.
* `/music skip`: Skips the current song.
* `/music queue`: Displays the current queue.
* `/music pause`: Pauses playback. (TODO)
* `/music resume`: Resumes playback. (TODO)
* `/music stop`: Stops the music and clears the queue.

### RSS Feed Commands (Examples):
* `/rss add <feed-URL>`: Subscribes to an RSS feed and posts updates in the specified channel.
* `/rss remove <feed-ID>`: Removes an RSS feed subscription.
* `/rss list`: Displays all active RSS feed subscriptions on the server.

A complete list of all commands can be obtained with `/help` (if implemented).

---

## ❤️ Sponsoring & Support

The development and maintenance of **Cybercade Bot** require time and resources (e.g., for server hosting if the bot is publicly hosted). If you like this bot and want to support its further development, please consider making a donation. Any support helps tremendously and is greatly appreciated!

### 💚 Special Sponsors

<div style="display: flex !important;">
  <img src="https://github.com/Cybercade/Cybercade-bot/blob/main/assets/images/termius-icon-512.png?raw=true" style="width: 25%; height: auto; aspect: 1/1; margin-right: 63px" />
  <span class="margin-bottom: auto;"><a href="https://termius.com" target="_blank">Termius</a> provides a secure, reliable, and collaborative SSH client.</span>
</div>


### Sponsoring our project
<!-- * **GitHub Sponsors:** [Link to your GitHub Sponsors profile] -->
* **Ko-fi:** https://ko-fi.com/cybercade

Your support allows us to:
* Invest more time in developing new features.
* Cover hosting costs.
* Keep the bot up-to-date and bug-free.

Thank you to everyone who supports this project! 🙏

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, find bugs, or want to improve the code, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bugfix (`git checkout -b feature/YourFeature` or `git checkout -b fix/YourBug`).
3.  Commit your changes (`git commit -m 'Feature: Add XYZ'`).
4.  Push your changes to your fork (`git push origin feature/YourFeature`).
5.  Open a Pull Request to the `main` (or `develop`) branch of this repository.

Please ensure your code follows existing coding style guidelines and that tests (if any) pass successfully.

---

## 📜 License

This project is licensed under the **MIT LICENSE**. See the `LICENSE` file for more details.

---

## 🙏 Acknowledgements

* A big thank you to the **discordx** team for the fantastic framework.
* Thanks to **oceanroleplay** for the **tscord** template, which makes getting started easier.
* Thanks to the Discord.js community.
* (Optional) Further acknowledgements for libraries, helpers, etc.

---

*For questions, issues, or suggestions, please create an [Issue](https://github.com/Cybercade/Cybercade-bot/issues) in this repository.*
