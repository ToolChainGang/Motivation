# Adding your own projects

You can get a stronger effect from the program by creating your own project
category.

A ham radio operator would probably use "Electronics",
but would benefit from having a more specific "Ham Radio" category.
A writer might get a stronger effect from a "Writing/Screenplay"
category, or a mechanic might get a stronger effect from "Race Car".

Directories found here will appear as project categories in the Motivation
configuration page. To create a new project category:

1. Create a new directory
2. Create a file "Meta.txt" describing the project
3. Create a file "Words.txt" and fill it with project-related words
4. Create a subdir "Images" and populate it with project-related images
5. Run the MakeJS program (from the bin directory) to create a new Projects.js file
6. Verify the new category

Please consider making your category generic and useful to others,
and include it into the main project. Ask to be part of the development
team on GitHub and then "git push" your category into the main branch.

This program is available at no charge, you can help make it
better for others by managing a category you enjoy and have expertise in.

### Step 1: Create a directory for the new category

```
> cd Projects
> mkdir Ceramics
```

### Step 2: Create a "Meta.txt" file

The easiest way to do this is to copy one of the existing Meta.txt files from
another directory, then edit it to describe your new project.


```
> cd Ceramics
> cp ../Automotive/Meta.txt .
> vim Meta.txt
```

The file should look like the middle of a javascript dict definition, and contains
two fields: the display name and the "Doer" name.

The display name is what is shown on the web page, and can be any text. This is useful
when the name is different from the directory name. So for example we might use the
directory "Ceramics", but display as "Ceramics/Pottery" to present both words to the user.

The "Doer" is the person who "does" the project, such as "Welder" for welding, or "Mechanic"
for automotive. It's used in the slideshow and pasted into some of the web page templates.

```
    Display: 'Ceramics/Pottery',
    Doer:    'Potter',
```

### Step 3: Create a "Words.txt" file and fill it with project-related words

The "Words.txt" file is simply a text file of words, one per line, that evoke images
of doing the project in the viewer's mind. Here is an excerpt from the "Ceramics"
category:

```
> cat Words.txt
adobe
amorphous
art
artefacts
bentonite
brick
 :
smelting
stoneware
tableware
terracotta
tile
>
```

The project comes with applications that make creating the Words.txt file easier.

The "ScrapeWords" program will automatically look up synonyms for words you supply
(from RelatedWords.io) and generate the "Words.txt" file for you.

Many of the words will be unrelated to the actual project, so the Words.txt file
will need to be "culled" (ie - viewed and removed) by a human.

For example, the word "Chip" was used to find related images for the "Electronics"
category, and this returned all manner of images related to potato chips, tortilla
chips, cops on motorcycles, and so on. The author had to remove all the unrelated
images from the project.

The "CullWords" program makes this easier. Running "CullWords" will present the user
with a matrix of buttons, each containing one word. Pressing a button will cull that
word from the Words.txt file.

It takes a few minutes, but it's fast and easy to do.

```
> #
> # Grab an initial set project-related words for the project
> #
> ScrapeWords Ceramics Pottery Clay Kiln
> #
> # Cull (ie - remove) the ones that don't pertain
> #
> CullWords

```

You can run "ScrapeWords" multiple times, and new words will be added to the existing
file. You can run "CullWords" multiple times as needed.

### Step 4. Create a subdir "Images" and populate it with project-related images

Each project category has a subdir "Images" containing project related images -
images that evoke thoughts of doing the project.

Here's some of the files in Ceramics/Images:

```
> cd Images
> ls -1
    :           :
the_bowl_bowl_ceramics.jpg
tiger_figurine_bat_trang.jpg
tile_ceramic_la_mancha.jpg
toad_clay_figure_weel.jpg
tri_color_cup_china_0.jpg
tumacocari_pottery_arizona_clay.jpg
turtle_ceramic_decoration_three.jpg
vases_with_two_earrings.jpg
    :           :
>
```

The project comes with applications that make finding images easier.

The "ScrapeImages" program will automatically get free-to-use images for you
(from pexels.com or free-images.com).

Many images will be unrelated to the actual project, so need to be "culled" 
(viewed and removed) by a human.

For example, the word "Chip" was used to find related images for the "Electronics"
category, and this returned all manner of images related to potato chips, tortilla
chips, cops on motorcycles, and so on. The author had to remove all the unrelated
images from the project.

The "CullImages" program makes this easier. Running "CullImages" will present the user
with a matrix of images as buttons. Pressing a button will mark that
image for deletion, and at the end the user is given the option to delete the
marked ones.

It takes a few minutes, but it's fast and easy to do.

```
> #
> # Create the Images directory
> #
> mkdir Images
> #
> # Grab an initial set project-related images for the project
> #
> cd Images
> ScrapeImages Ceramics Pottery Clay Kiln
> #
> # Cull (ie - remove) the ones that don't pertain
> #
> CullImages

```

You can run "ScrapeImages" multiple times to add new images.
You can run "CullImages" multiple times as needed.


### Step 5: Recreate the "Projects.js" file

The "Projects.js" file lists all the files and words contained in the project
categories. It's used by the main project to locate images, since a web page
can't get a directory listing (for security reasons).

The project comes with the "MakeProjectJS" application, which will do this
automatically for the user.

```
> #
> # Create the Project.js file
> #
> cd ..     # Go up to the main "Projects"  directory
> cd ..     # Go up to the main "Motivator" directory
> MakeProjectJS
```

### Step 5: Verify the new category

Once you've created the new category, it's time to test it!

The main program can be given URL arguments to make this easy.

Appending the text "?Slideshow=Category" will cause the program to automatically
run the slideshow for the specified category.

For example, here's how to view the "Ceramics" slideshow, using Firefox:

```
> #
> # Run the Ceramics slideshow directly
> #
firefox index.html?Slideshow=Ceramics
```

Appending the text "?Lesson=Config" will cause the program to automatically
run the configuration section, which will allow you to view how your category
will be presented to others.

Cut and paste this to jump directly to the configuration section:

```
> #
> # Jump directly to the configuration section
> #
firefox index.html?Lesson=Config
```
