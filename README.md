# GeoLocation Test

This is an application to find yourself data location and a website data location.

#### Resources
I built this app using:

- **Yarn:** npm@5 is good, but Yarn is still better (pioneers \\o/)
- **Webpack**
- **React**
- **ESlint (airbnb preset)**
- **Jest with Enzyme (testing):** Jest is all set up for testing, great for React and I like the reporter. Enzyme render the components awesomely.
- **Bulma (CSS framework):** Light, beautiful and simple.

The application was previously built in jQuery and it had already some sort of UI structure.

I thought about another UI, which would be better to navigate and interact with, so I rebuilt all the project using the frameworks I chose (more about this in the last section).

I was going to use **Redux**, but since this is a very simple project, with very few methods and variables traversing the components and it's only one level deep, I decided to don't use it. But I regretted it sometimes...

### Initial Setup

##### 1. Install
Install all the dependencies.

    yarn install

##### 2. .env file
Copy the `.env.example` and rename it to `.env`. It must be in the root folder, the same folder the `.env.example` is in. The only environment variable is the *Google API Key* (`GMAPS_KEY`), which we will get in the next step.

##### 3. Google API Key
You need a *Google API Key* to use the map. Get it here: https://console.developers.google.com.

Remember to get the API key and **enable** the *Google Maps Javascript API*.

Paste your generated *Google API Key* in the `.env` you copied before. It will be like this (the example is a fake key):

````
# Google maps key
GMAPS_KEY=GtYvGsIdB_Z4eRFfasSb2rNRZc
````

### Running
Open the terminal and run the command:

    npm run server

Webpack-Dev-Sever will run on `localhost:5000`. If you need to change the port, do so in the `package.json` file.

### Building
Build the distribution files running:

    npm run build

It will build in `/dist` folder.

> It is not optimized for production. I left this configuration for a future task (it is listed in the TODO below).

### Testing
Run test set with the command:

    npm run test

To run in *watch* mode use:

    npm run test-watch

##### Coverage
To get coverage report run:

    npm run test -- --coverage



### License
None

### TODO
- [ ] Configure Webpack for production
- [ ] Customized pins for user and for webpage on the map
- [ ] Add icons for *Your Location* nad *Website Location* next to <LocationData /> titles to ease understanding of the page
- [ ] Hide info balloon (which explains the request data) with timeout on mouseLeave
- [ ] Add spinner while page is loading

----

### Notes about test requirements

I followed the instructions given, but 2 of them were left aside.

> If this async call is successful, **a second panel must be rendered, below the form, displaying a map** showing the website's physical location from the latitude and longitude coordinates of the JSON response.

I didn't follow the highlighted instruction because I think the UI I built is better, with the map in the middle and all the rest.

> You must leverage reusability **with the existing code**. You might have to refactor some of it, especially when adopting a web framework. Make sure to **keep the existing functionality up and running** and also to fix any bugs you might run into.

I don't know if this means I **HAD** to use the previous jQuery code. I decided to don't use it, since I was going to restructure everything up with tests and all. Hope this is not a problem. Anyway, the previous functionality is up and running as you asked.
