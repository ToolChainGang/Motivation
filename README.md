# Motivation

This program uses psychological methods to increase your motivation for completing
projects. Run it once a day for 30 days, and you should see an improvement in
project motivation.

Each run consists of a one-minute slideshow of words and images that bring your project
to mind, plus a short lesson on some psychological aspect of motivation.

The slideshow gets your mind thinking about the project, and the explanations help
you make small changes to your behavior and attitude that should boost your project
motivations.

The techniques are well documented and backed by scientific studies, no tricks or
subliminal messaging is involved.

## Details

The project consists of a web page with some embedded javascript to manage the presentation.
Everything happens in the browser, no compile or install is needed. Just clone the project
and go.

On first run, you will be asked to choose a project category for the project you want to
finish: the system will use words and images from this category for the slide show.

Then, once a day for 30 days, run the web page in your browser as soon as possible after waking.

A daily run consists of a slide show of words and images from your project category, to
highlight those ideas in your mind. The slide show takes about a minute.

While you watch the slideshow, look for a specially displayed word: a different color,
a different placement, bigger, smaller, crooked, or whatever. The method changes with each
run, but it will be obvious when you see it. After the slide show, you will be asked to
identify the special word.

After the slideshow you might be given some lesson text to read.

The lessons describe psychological aspects of motivation, and give suggestions for
how these might be improved. Knowing how motivation works will help you make changes that
will increase your own motivations.

Sometimes the program will ask you to do a small task such as thinking about an issue or
writing a todo list. The tasks work with the lessons to implement the psychological
techniques, and help you gain motivation.

After 30 days you should see an increased motivation for finishing your projects.

Good luck with your projects!

## Installing

Get the project from git, in the normal manner:

````
> git clone git@github.com:ToolChainGang/Motivation.git
````

That's it! No other installation steps are needed.

## Running the program

To run the project, double-click on "public_html/index.html" in the project directory
to start the program in your default browser.

## Running at first boot

The project should be run once a day for 30 days, as early as possible after waking.

If you always open a browser as part of your daily routine, you can open the project in a tab and set
the browser to restore tabs on restart. Each time you open the browser, the program will be available,
and you can view it once each day.

You can also set the system to open the web page in the default broswer when you first log on, using the "xdg-open"
command (linux) or "start" command (windows). Cut/Paste the following into your system "startup applications":

````
# Linux
> xdg-open $HOME/Motivation/public_html/index.html

# Windows
> start %HOMEDRIVE%%HOMEPATH%/Motivation/public_html/index.html 
````
(If you cloned the application to another directory, make the necessary changes to the command lines.)


Alternately for Linux systems, run the following command from the project directory to run
the project at first login:

```
> echo "xdg-open $PWD/public_html/index.html" >>~/.profile
```

