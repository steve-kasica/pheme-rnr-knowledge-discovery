# /data Directory
This directory houses processed and "cached" data used in our analysis.

## Converting PHEME raw data into CSV files
The `pheme-rnr-dataset` directory contains tabular subsets of data from the PHEME Rumor Non-Rumor dataset in CSV format. These CSV files were created by opening an interactive Python 3 shell from the repository root, which is one directory up, and running the following commands:

```
Python 3.6.7 (default, Oct 22 2018, 11:32:17)
[GCC 8.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from lib.pheme_parsing import get_event_data
>>> pheme_to_csv("ottawashooting")
```

Valid event name for the first argument of `get_event_data` include:

* charliehebdo
* ottawashooting

Depending on your system, this process may take up to 20 minutes for some PHEME events.