# Therese Plath Realestate v2


[defunct] Real Estate listings and marketing website for Therese Plath Real Estate, Cairns.

This was a Jekyll project that uses Siteleaf as a CMS, and the Siteleaf API as a trigger for data recieved from a server built to handle the property data.

Formerly the site was at: http://thereseplath.com.au

As a keepsake, the site is now at: https://callumflack.github.io/thereseplath-realestate-02

## Set-up

The site uses Jekyll to build out pages, real estate listings and a blog. 

Real Estate listings were populated by JSON files in the data directory, fed by an external server chron-job every day. 

## Data server 

…can be found at: https://github.com/callumflack/thereseplath-realestate-02-server

This external server recieved a listings XML, converted it to JSON and pushed the JSON to the _data directory here.
