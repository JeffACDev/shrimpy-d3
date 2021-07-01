# d3-line-chart
***This is an in-progress peek*** <br/>
<p>The chart is setup to handle a non-specified number of lines. I could set the color designation to loop back around, if there were ever more lines than colors. I used a color picker to find the colors and wrote a color array to dynamically color each line as it is looped. Typically, if an API endpoint is not available to set up a microservice, I would run a Json server, to access the initial data from a local json file, like the file I included, but did not use, yet. This data is a hard-coded const. Often my first step for a rough-in.</p>
<p>For interactivity, when you hover over data points, the info for the nearest focussed point should display. Currently, only the last line in the loop works, and I have that in my list of todos, below. </p>
 
***With more time, I would:*** <br/>
<ul>
 <li>refine style, including adding subtle y grid dashed lines, etc.</li>
 <li>figure out how to have the data lines begin and end before and after the first and last data points</li>
 <li>setup promised data</li>
 <li>make mouse move work for all lines</li>
 <li>move the chart into React (The example I demoed, durring the first interview, was a d3.js bar chart reusable component with a live API search in React)</li>
 <li>figure out what's going on with the y axis initial format, before the animation</li>
</ul>


![image](https://user-images.githubusercontent.com/2840356/124076912-7b6aed80-da0c-11eb-97f3-f47d081f38a2.png)
