# Knowledge Discovery for Interpretability and Insight in Network Approaches to Automatic Fake News Detection

Steve Kasica and Ali Mohammad Mehr

## Converting PHEME raw data into CSV files
The `pheme-rnr-dataset` directory contains tabular subsets of data from the PHEME Rumor Non-Rumor dataset in CSV format. These CSV files were created by opening an interactive Python 3 shell from the repository root, which is one directory up, and running the following commands:

```
Python 3.6.7 (default, Oct 22 2018, 11:32:17)
[GCC 8.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from lib.pheme_parsing import pheme_to_csv
>>> pheme_to_csv("ottawashooting")
```

## Project Presentation

For our project presentation, we're using [Jupyter Notebook's slides features]https://medium.com/@mjspeck/presenting-code-using-jupyter-notebook-slides-a8a3c3b59d67()

### Converting Notebooks to Slides

Convert `.ipynb` files into HTML slideshows with the following command:

```
$ jupyter nbconvert my_notebook.ipynb --to slides
```

### Running Presentation

Slides in the `docs` directory can be run using the server spun up by Jupyter.

## Presentation Order
In lieu of copying everything in our notebooks into one master presentation, we should show our slides from our individual Jupyter Notebooks in the following order:

1. intro.slides.html
2. data_cleaning.slides.html
   exploratory_data_analysis.slides.html