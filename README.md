# node-example-services

Ok, let's try to recreate the example REST service I created in [Java](https://github.com/banksone/java-example-services) before, now using NodeJs. We will have to connect Apache Cassandra cluster. To do that, I used cassandra-driver.

Once we succeed, we going to try to deploy this example app into a Docker container and expose the service via the Http Docker container provided [here](https://github.com/banksone/spark-dataprocessing)

We do not need any HTML here since we are going to serve REST only, so the app itself seems to be trivial - just call node src/app.js and voila!
But it is not enough, I would like to bundle the app for the production environment.

Let's use Webpack and create webpack.config.js

```
npm install webpack webpack-cli --save-dev
```

Finally, we need to add the scripts section to package.json to use Webpack. That's it - now our app builds into the dist folder.
The application works fine returning test value;

To get a real result from Cassandra we have to run the app inside a Docker container, app to be able to access DB in the internal network (Cassandra ports are not exposed and never should be). From the official NodeJS Docker images I decided to use 17-alpine (alpine is a very compact linux version).
Now it's time to add the container to the [docker-compose.yml](https://github.com/banksone/spark-dataprocessing)

The built version of our app has to be copied into 'nodejs' folder of the [Spark Sataprocessing](https://github.com/banksone/spark-dataprocessing) project

Next, after Cassandra has started, from the [Spark Sataprocessing](https://github.com/banksone/spark-dataprocessing) project just run nodejs container

```
docker-compose up nodejs
```

To be able to use the Nodejs service instead of Java - you have to modify Apache Httpd conf. Just change:

```
       <Location /moviesapi>
               AddDefaultCharset Off
               Order deny,allow
               Allow from all
               --ProxyPass http://java:8080/moviesapi
               ++ProxyPass http://nodejs:8080/moviesapi
               --ProxyPassReverse http://java:8080/moviesapi
               ++ProxyPassReverse http://nodejs:8080/moviesapi
       </Location>

```

Ok, I have to admit - NodeJS is really cool.