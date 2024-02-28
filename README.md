# ReviewHelper

A TamperMonkey script to aid in the writing process for Amazon Vine reviews


## License

[BSL-1.0](https://choosealicense.com/licenses/bsl-1.0/)

## Installation

To use the scripts for this project, you must install Tampermonkey, a free browser extension.

### Prerequisites

- any Chromium-based browser like Google Chrome, Mozilla Firefox, or Opera / Opera GX.

### Install Tampermonkey

Tampermonkey is a user script manager that allows you to manage and run user scripts. To install Tampermonkey on your browser, follow these steps:

#### Google Chrome and Chromium-based Browsers

1. Visit the [Chrome Web Store](https://chromewebstore.google.com/?hl=en).
2. Use the search bar to find "Tampermonkey".
3. Locate the Tampermonkey extension in the search results.
4. Click on 'Add to Chrome' to install the extension.
5. A pop-up window will appear detailing the permissions the extension requires. Please review the permissions, and if you agree, click 'Add extension'.

After installation, the Tampermonkey icon should appear in your browser's extension area, indicating that it is ready to use. Now, you can add user scripts and enhance your browsing experience.

### Step 1: Installing Script 

1. Go to this link [here](https://raw.githubusercontent.com/wattsoner/Vine-Review-Helper/master/AmazonReviewHelper.user.js) and click the "Install" button. Sometimes, it might show as "Reinstall" instead; click this anyway.
   
### Step 2: Save and Activate

1. To save the script, press `Ctrl + S` or click on the disk icon to save the script in Tampermonkey.
2. Once saved, the script should be active by default. If not, please ensure the script is enabled in the Tampermonkey dashboard.

### Step 2: Reload Amazon Page

1. Navigate to the Amazon Reviews Webpage [here](https://www.amazon.co.uk/review/create-review) (note: this link might only work if your country's TLD).
2. reload the page by pressing `F5` or clicking the reload button in your browser.
3. The user script should now be operational, and you should see the changes applied by `Amazon-Review-Helper.js`.



## How To find your webhook

```
Step 1: Create or Select Your Discord Server
```

*For a new server*

Open Discord and log in.
Click the "+" icon on the left sidebar to create a new server.
Follow the prompts to set up your server.

*For an Existing Server*

Open Discord and log in.
Select the server you own from the left sidebar.

```
Step 2: Create a Text Channel
```

Right-click on your server name on the left sidebar.
Select "Create Channel."
Choose "Text Channel," give it a name, and click "Create."

```
Step 3: Create a Webhook
```

You can just navigate to the text channel you want to use (either an existing one or the one you just created).
Click on the settings gear icon next to the channel name.
Scroll down and select "Integrations."
Click on "Create Webhook" or "View Webhooks" and then "New Webhook."
Could you give your webhook a name and select the channel to post messages?
Click "Copy Webhook URL." This is your Discord webhook URL.

```
Step 4: Use Your Webhook
```
You can now use this webhook URL, click the ⚙️ emoji (to enter settings) ,put the URL in the "Discord Webhook URL" textbox, then click `save.`


## Roadmap

- Script Optimisation

- Add Documentation

- Add more customisation to settings (change embed colour, webhook image, etc)

## Credits

- Developer [@wattsoner](https://www.github.com/wattsoner)
- Rubber Ducky [@Thorvarium](https://github.com/Thorvarium)



