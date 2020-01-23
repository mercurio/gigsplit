#!/bin/bash
#
# Copy the CSS files from node_modules into static/css
#

mkdir -p static/css
cp node_modules/jexcel/dist/jexcel.css static/css
cp node_modules/jsuites/dist/jsuites.css static/css

