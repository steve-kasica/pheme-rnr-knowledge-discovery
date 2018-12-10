# /data Directory
This directory houses processed and "cached" data used in our analysis.

* The `tweets` directory contains cleaned individual tweet data for each event in the PHEME dataset. CSV files in this directory are created with the `lib/parsing_pheme.py` script.
* The `threads` directory contains aggregated thread data for each event in the PHEME dataset. The CSV files in this directory are created with the `data_cleaning.ipynb` Jupyter notebook

Depending on your system, this process may take up to 20 minutes for some PHEME events.