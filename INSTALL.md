# ProjectMotivator: Increase motivation for finishing projects

## Installing

### Step 1: Prerequisites


### Step 2: Download a copy of the project

```
> cd
> git clone https://github.com/ToolChainGang/ProjectMotivator.git
```


### Step 2: Add your own project keywords

Choose a small number of projects you would like to complete, then make a list of
keywords that relate to those projects. The keywords should include the name
and/or title of the project (if you have one), and any tags that would describe them.

Some examples:

BlinkyWatch, arduino, circuit, soldering, components, LED, strap, band

GabeCostume, sewing, fabric, buttons, belt, mask, sword, scabbard

Bookshelf, wood, varnish, lumber, tablesaw, router, doors, hinges

Using an editor, add the keywords, one word per line, to the "MyTags.txt" file in the
Data project subdirectory. See the file INSTRUCTIONS.md in the Data subdirectory.


### Step 2: Add your own project images

For your chosen projects, create some images that are relevant to the projects. Place
these in the "MyImages" subdirectory in the "Data" directory.  See the file INSTRUCTIONS.md
in the Data subdirectory for more info.

Example images might include a circuit schematic, scans of hand-drawn diagrams, internet images
you use for inspiration, fusion360 previews, cad/cam previews, and so on.

Note that most computers support screen capture tools, and ccreen captures of the software
tools you use work well for this. Images of your physical tools (tablesaw, soldering iron, etc.)
also work well.


### Step 3: Set the project to run each morning

The project should be run as early as possible after waking.

One way to do this is to run the project when you first log in to the computer each morning.

For Linux systems, the following command will run the project at first login:

```
(from the project directory)

> echo "node `pwd`/Motivator.js" >>~/.profile
```

### Step 4: 

Run the program once each day for 30 days, and follow the instructions.

Each run should take about a minute and a half.

You will be shown a series of words and images, and asked a question at the end.

Complete information about the program, what it is doing, and why it should work
can be found in the help sections of the running program.

Good luck with your projects!
