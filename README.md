# Next Test Auth



Make a `.env` file based on `.env.example`
You will need to make a twitter app, set credentials in .env and configure your callback.  
`server.js#L22 :: callbackURL: '/twitter/callback',` should match in twitter app

* `yarn`
* `yarn dev` - try to log in, will fail
* `yarn build` then `yarn start` - this will work
