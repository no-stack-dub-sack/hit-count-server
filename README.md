# Hit-Count-Server

## About
This app is a simple Node/Express server with a MongoDB backend designed to be used as an API for easily recording hits to a website. Where web traffic is low, standard analytics services will not effectively record even simple data about your site. This aims to solve that problem so you can see how many people have visited your personal portfolio site or latest pet project!

Be warned, though: you'll only get very simple stats. This app will tell you the following:
- Total hits to your site
- The date that you began recording
- Today's date
- How many people have visited today
- Average hits per day

That's it! Short and sweet. Here's a screenshot that illustrates what the frontend of this service will display:
![image](https://user-images.githubusercontent.com/18563015/33355015-9c28c2f0-d483-11e7-9f0a-68558d905fc8.png)
(of course, with a sweet color changing background)

__This service is also extensible, so you can keep records on multiple sites at once.__

Thanks to @bonham000 for [laying the groundwork](https://github.com/bonham000/counter) for this app.

## Use:
___NOTE:___ I have this particular repo configured for some apps that I'm tracking, but with minimal (ok, some) effort, this can be fairly easily configured for your own purposes should someone actually stumble upon this and want to use it. Let me know if so, and I'd be happy to point out the lines of code that need modification! :smile: In general, though, here's the process:
- Manually create an record in MongoDB using the Mongo Shell to initialize tracking (in lieu of proper authorization, this is an easy way of preventing outside users from disrupting the count in any way &mdash; the MongoDB query looks for a record based on the name of the site you are tracking. If the query does not return an existing record, nothing happens.) This will look something like this:
```shell
db.counters.insert({
  host: 'http://your-site-here.com/',   
  startDate: new Date(),
  total: 0,
  today: {
    date: new Date(),
    count: 0
  }
})
```
- Once the app is deployed (I used heroku and MLAB), use `axios` to make an http POST request in the entry point of your app to the `register-count` route. For example, in `componentDidMount()` of App.js in a React app:
```js
axios.post('https://your-deployed-hit-counter.com/register-count')
  .then(() => console.log('count registered'))
  .catch(err) => console.log(err));
```
- Here's some key lines of code that will need to be changed if you want to use this:
  - https://github.com/no-stack-dub-sack/hit-count-server/blob/master/src/utils/hostName.js (pretty much this whole file needs to be customized for your purposes)
  - https://github.com/no-stack-dub-sack/hit-count-server/blob/master/index.html#L38 (buttons either not needed if only tracking one site or arguments to `onclick` & text should be changed)
  - https://github.com/no-stack-dub-sack/hit-count-server/blob/master/index.html#L39
  - https://github.com/no-stack-dub-sack/hit-count-server/blob/master/index.html#L68 (should coincide with buttons or be set to default)
- Besides any further customization you want to do, that's it!
- I fully recognize that this documentation is terrible, but I also fully expect that no one will ever read or use this. Just in case though... If you do, please tell me that you found the easter egg: "dinosaur", and I will get a huge kick out of it. If you got this far, this might be useful to you, so feel free to reach out if any of this doesn't make any sense! (btw, there are probably services available via NPM that do the same thing as this if you're looking for something more rounded out).

Here's a live example (this repo IS this exact deployment), set up for tracking 2 sites: https://hit-count-server.herokuapp.com/
