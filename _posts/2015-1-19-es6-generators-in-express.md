---
layout: post
title:  "ES6 Generators in Express"
date:   2015-01-19 11:14:35
categories: javascript node.js
---

There has been a lot of news about Javascript lately. The release of [iojs][iojs] `1.0.1`
and new ES6 features popping in the latest version of Chrome, its a very exciting time
to be a Javascript developer. However the feature I am most interested in would be ES6 [Generator Functions][generators].

[Generator functions][generators] have the ability pause execution of the function using the `yield` statement.
That on its own might not seem very useful, but when combined with [Promises][promise] and a library like [co][co].
We can write asynchronous code that looks and somewhat behaves synchronous:

{% highlight javascript %}
app.get('/', function* (req, res) {
  var file = yield readFile('./file.txt');
  var file2 = yield readFile('./file2.txt');

  res.send([file, file2]);
});
{% endhighlight %}

Now this example above is actually an [express][express] `route` using a generator function
to handle the request. This feature is not available in [express][express] `4.11.0`, but I added support
for generator functions to a [fork][fork] of the project with this [commit][commit]. That said, [koa][koa] is a web framework built
from the ground up using generator functions but there a lot of existing projects using express
and rewritten them in [koa][koa] just to use generators is too much.

Let me briefly explain the example, `readFile` is going to take the path to a file and return a promise.
That promise will resolve or reject when the file has been read from disk. While we wait on the promise
the execution of the function will pause, not the event loop. When the promise is resolved the content
of the file will be stored in the `file` variable and `readFile` will be called again this time for `file2.txt`.
After `file2.txt`'s promise is resolved, `res.send` will complete the request send an array of file contents. For
more information on how this works visit [here][promise-gen].

I dont know about you, but that is very cool. No [callback hell][cb-hell] just clean code thats very easy to reason about.

The code for `readFile` looks like this:

{% highlight javascript %}
function readFile(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, function (err, data) {
      if (err) reject(err);
      else resolve(data.toString());
    });
  });
}
{% endhighlight %}

Just so you can appreciate how much nicer using generator functions and promises are, this is what the code
would look like without them:

{% highlight javascript %}
app.get('/', function (req, res) {  
  fs.readFile('./file.txt', function (err, file1) {
    fs.readFile('./file2.txt', function (err, file2) {
      res.send([file.toString(), file2.toString()]);
    });
  });
});
{% endhighlight %}

It might not look so bad now, but just imagine if there were another 2 files. Yikes!

##Conclusion

I'm very excited about ES6 in general and glad [iojs][iojs] is allowing developers to use these features today.
Also if you like to see Generator Functions support baked into express, they have started a [release `5.0`][release]
pull request so you can politely ask.


[iojs]:        https://iojs.org/
[express]:     http://expressjs.com/
[koa]:         http://koajs.com/
[generators]:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
[co]:          https://github.com/tj/co
[fork]:        https://github.com/kenrick/express
[commit]:      https://github.com/kenrick/express/commit/8dac72bc9b11a71ed52a54bf35768d2ead912238
[promise]:     https://www.promisejs.org
[promise-gen]: https://www.promisejs.org/generators/
[cb-hell]:     http://callbackhell.com/
[release]:     https://github.com/strongloop/express/pull/2237
