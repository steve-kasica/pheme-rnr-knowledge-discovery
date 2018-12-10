# PHEME Rumor Non-Rumor Feature Analysis



## Converting PHEME raw data into CSV files
The `pheme-rnr-dataset` directory contains tabular subsets of data from the PHEME Rumor Non-Rumor dataset in CSV format. These CSV files were created by opening an interactive Python 3 shell from the repository root, which is one directory up, and running the following commands:

```
Python 3.6.7 (default, Oct 22 2018, 11:32:17)
[GCC 8.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from lib.pheme_parsing import pheme_to_csv
>>> pheme_to_csv("ottawashooting")
```

Valid event name for the first argument of `pheme_to_csv` include:

* germanwings-crash, $\approx$ 2 minutes to convert
* ottawashooting, $\approx$ 8 minutes to convert 
