## The HN Search app

The goal is to extract the popular (most frequent) queries that have been done during a specific time range.

## Approach

The chosen data structure is a search tree for which each node is a date/time element (year, month, day, hours, minute) storing a associatve array with all the queries and their respective count for that date/time. This allows for:
* immediate lookup for search count
* sort associative array according to values (count) for popular queries

Outline of the app:
* start server
* read .tsv file line by line and parse each line
* extract date information as well as query
* populate data structure 
* immediate lookup for search count
* sort associative array according to values (count) for popular queries

## Try it

http://localhost:3000/1/queries/count/2015-08-03
http://localhost:3000/1/queries/popular/2015?size=3  