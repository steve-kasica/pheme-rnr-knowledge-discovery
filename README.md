# Knowledge Discovery for Interpretability and Insight in Network Approaches to Automatic Fake News Detection

Steve Kasica and Ali Mohammad Mehr

Machine learning classifiers that utilize network-based features for fake news detection have resulted in surprisingly low verification/test error rates. By fake new detection, we mean a supervised-learning approaching to classifying conversational threads as being binary rumor or non-rumor. Given the disproportionate number of fake news article and the resources available to determine their veracity, automated approaches to classification are one compelling approach to solving this problem. Instead of focusing on improving accuracy, our project aims to interpret and understand what features are most important in many machine-learning classifiers and why are some features better than others. Our contributions include: detailed code on engineering 58 features available in the Twitter API from the PHEME Rumor Dataset, several visualization idioms for interpreting whether or not features will be effective in fake news classification, and accuracy results from many common machine-learning classification models.

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

For our project presentation, we're using [Jupyter Notebook's slides features](https://medium.com/@mjspeck/presenting-code-using-jupyter-notebook-slides-a8a3c3b59d67)

### Converting Notebooks to Slides

Convert `.ipynb` files into HTML slideshows with the following command:

```
$ jupyter nbconvert my_notebook.ipynb --to slides
```

### Running Presentation

Slides are in the `docs` director.
