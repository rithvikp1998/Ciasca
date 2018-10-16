# Ciasca
Ciasca is a simple chat application (just in case you missed the recursion). This project idea started as a Slack alternative for the [robotics team](http://github.com/AUV-IITK/) I am working with (as of Oct, 2018), but I almost immediately discovered [Rocket chat](https://rocket.chat/) exists and there was no point in reinventing the wheel. The team eventually didn't switch from Slack and I repurposed this project to be a test bed so that I can learn web development. So, Ciasca is a Rocket-chat like platform, only difference is that it is entirely built by me :smiley:

## Testing the app

### Prerequisites

(Basically, the package versions I am currently using)

* [NodeJS v8.12](https://nodejs.org/en/download/)
* [npm v6.4](https://docs.npmjs.com/cli/install)
* [MongoDB v4.0](https://docs.mongodb.com/manual/installation/)

### Running the app

```
$ git clone https://github.com/rithvikp1998/Ciasca
$ cd Ciasca
$ sudo service mongod start
$ mongo &
$ node server/server.js
```
Visit [http://localhost:4000](http://localhost:4000) and you are good to go!
