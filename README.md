# Practissimo

##Authors
Zachary Wong

YuetLong Leung

Jasmine Moran

##Overview
<a href="http://imgur.com/ECWdRh7.png"><img src="http://i.imgur.com/ECWdRh7.png" title="source: imgur.com" /></a>
Practissimo is a music practice manager that tracks your duration of practicing instruments by using our sound detection algorithm.

##Goals and Focus
The goals of application is to add a game to musical practice sessions to help motivate the musician.  The app has a focus on a simple, modern, and minimalistic UI that is appealing to most audiences.  To start our test we ask you to make an simple account to login in and hit start.

##Technologies and Packages

* **Meteor** - Framework and backend
* **Moment.js** - Time functions
* **Animate.css** - UI functions
* **Hover.css** - UI functions

##Documentation Tree

├── client <br>
│   ├── lib <br>
│   └── stylesheets <br>
│       └── fonts-mido <br>
├── imports <br>
│   ├── api <br>
│   ├── clockpicker <br>
│   ├── pitchdetection <br>
│   ├── startup <br>
│   └── ui <br>
├── node_modules <br>
├── public <br>
└── server <br>

##How To Use Practissimo
Practissimo currently has three features:

**Timer** - The main function of Practissimo
To access the timer, click on the "Start" button.

You can set up how long the practice session will be in two ways:
  * Entering the number of hours/minutes in the boxes provided
  * Set a specific time of when the practice session will end using the clock

When ready, hit the "I'm ready!" button. The practice session will begin. As you begin practicing, the application will pick up the sound and track you as you play.  When you are no longer practicing, the tracker will stop and wait for you to start again.

Once the practice session is over, you will be scored on how long you practiced under the set time limit.
This will be recorded into the progress section.

NOTE: Sound detection is still flimsy. Depending on the microphone, it may be sensitive and will pick up any kind of noise.

**Schedule** - Scheduling times for practice
When the schedule is opened, you may set a date and time when you will practice

NOTE: This was intended to be connected to the timer. However, we were unable to implement this.

**Progress** - Shows record of previous practice sessions and scores
When the progress is opened, a record of days practiced as well as the duration of the practice session, how long the user practices, and the score given based on the practice is displayed.

**Options** - Adjusts settings in Practissimo
NOTE: Currently under construction. Intended to help adjust settings such as microphone sensitivity levels.
