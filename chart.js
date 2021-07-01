const colors = ['#DE6E51', '#E8A339', '#68B253'];


const sampleData = [
    {
        "name": "Feed",
        "unit": "Kilograms per hector (kg/ha)",
        "values": [
            {
                "timestamp": "2021-01-15T10:00:00.000",
                "value": 0.5
            },
            {
                "timestamp": "2021-01-16T10:00:00.000",
                "value": 1.5
            },
            {
                "timestamp": "2021-01-17T10:00:00.000",
                "value": 1.4
            },
            {
                "timestamp": "2021-01-18T10:00:00.000",
                "value": 1.3
            },
            {
                "timestamp": "2021-01-19T10:00:00.000",
                "value": 1.2
            },
            {
                "timestamp": "2021-01-20T10:00:00.000",
                "value": 2.5
            },
            {
                "timestamp": "2021-01-21T10:00:00.000",
                "value": 2.0
            }
        ]
    },
    {
        "name": "Biomass",
        "unit": "Kilograms per hector (kg/ha)",
        "values": [
            {
                "timestamp": "2021-01-15T10:00:00.000",
                "value": 10
            },
            {
                "timestamp": "2021-01-16T10:00:00.000",
                "value": 11
            },
            {
                "timestamp": "2021-01-17T10:00:00.000",
                "value": 12
            },
            {
                "timestamp": "2021-01-18T10:00:00.000",
                "value": 12
            },
            {
                "timestamp": "2021-01-19T10:00:00.000",
                "value": 13.5
            },
            {
                "timestamp": "2021-01-20T10:00:00.000",
                "value": 9
            },
            {
                "timestamp": "2021-01-21T10:00:00.000",
                "value": 8
            }
        ]
    },
    {
        "name": "Ammonia",
        "unit": "Kilograms per hector (kg/ha)",
        "values": [
            {
                "timestamp": "2021-01-15T10:00:00.000",
                "value": 5.1
            },
            {
                "timestamp": "2021-01-16T10:00:00.000",
                "value": 7
            },
            {
                "timestamp": "2021-01-17T10:00:00.000",
                "value": 7
            },
            {
                "timestamp": "2021-01-18T10:00:00.000",
                "value": 6
            },
            {
                "timestamp": "2021-01-19T10:00:00.000",
                "value": 5
            },
            {
                "timestamp": "2021-01-20T10:00:00.000",
                "value": 4
            },
            {
                "timestamp": "2021-01-21T10:00:00.000",
                "value": 3.1
            }
        ]
    }
];

// set the dimensions and margins of the graph
const margin = { top: 40, right: 80, bottom: 60, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;

const parseDate = d3.timeParse("%m/%d/%Y");
const formatDate = d3.timeFormat("%m %d, %Y");
const formatMonth = d3.timeFormat("%b");
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// append the svg object to the body of the page
const svg = d3
    .select("#root")
    .append("svg")
    .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* x axis */

svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(3).tickFormat(formatDate));

/* y axis */

svg.append("g").attr("class", "y axis").call(d3.axisLeft(y));

/* y axis lable */

svg
    .append("text")
    .attr("y", -20)
    .attr("x", -20)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("kg/ha");

appendData(sampleData);

function appendData(sampleData) {

    /* combine all values for domain */
    const allValues = sampleData.map(d => d.values).flat();

    sampleData.forEach((line, index) => {

        // line.values = line.values.reverse();

        line.values.forEach((d) => {
            d.timestamp = new Date(d.timestamp);
            d.value = Number(d.value);
        });

        x.domain(
            d3.extent(allValues, (d) => d.timestamp)
        );
        y.domain([
            0,
            d3.max(allValues, (d) => d.value),
        ]);

        /* animate axis */
        svg
            .select(".x.axis")
            .transition()
            .duration(750)
            .call(d3.axisBottom(x).ticks(3).tickFormat(formatDate));
        svg
            .select(".y.axis")
            .transition()
            .duration(750)
            .call(d3.axisLeft(y));

        /* The data lines */

        const linePath =
            svg.append("path")
                .data([line.values])
                .attr("class", `line-${index}`)
                .attr("d", d3
                    .line()
                    .x((d) => x(d.timestamp))
                    .y((d) => y(d.value))
                    .curve(d3.curveCardinal))

        /* data point circles */

        line.values.forEach(d => {
            svg.selectAll()
                .data([d])
                .enter()
                .append("circle")
                .attr("fill", "white")
                .attr("stroke", colors[index])
                .attr("cx", (d) => x(d.timestamp))
                .attr("cy", (d) => y(d.value))
                .attr("r", 3)
        })

        const pathLength = linePath.node().getTotalLength();

        linePath
            .attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-width", 3)
            .transition()
            .duration(1000)
            .attr("stroke-width", 0)
            .attr("stroke-dashoffset", 0);

        /* dynamic legend text */
        svg
            .append("text")
            .attr("class", "title")
            .attr("x", (width / 2) + 100 * (index - 1))
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "left")
            .text(line.name);

        /* dynamic legend dots */

        svg.append("circle")
            .attr("fill", colors[index])
            .attr("stroke", "none")
            .attr("cx", ((width / 2) + 100 * (index - 1)) - 8)
            .attr("cy", -4 - margin.top / 2)
            .attr("r", 4)

        const focus = svg
            .append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus
            .append("line")
            .attr("class", "x")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.5)
            .attr("y1", 0)
            .attr("y2", height);

        focus
            .append("line")
            .attr("class", "y")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.5)
            .attr("x1", width)
            .attr("x2", width);

        focus
            .append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .attr("r", 4);

        focus.append("text").attr("class", "y1").attr("dx", 8).attr("dy", "-.3em");
        focus.append("text").attr("class", "y2").attr("dx", 8).attr("dy", "-.3em");

        focus.append("text").attr("class", "y3").attr("dx", 8).attr("dy", "1em");
        focus.append("text").attr("class", "y4").attr("dx", 8).attr("dy", "1em");

        function mouseMove(event) {
            const bisect = d3.bisector((d) => d.timestamp).left;
            const x0 = x.invert(d3.pointer(event, this)[0]);
            const i = bisect(line.values, x0, 1);
            const d0 = line.values[i - 1];
            const d1 = line.values[i];
            const d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;

            focus
                .select("circle.y")
                .attr("transform", "translate(" + x(d.timestamp) + "," + y(d.value) + ")");

            focus
                .select("text.y1")
                .attr("transform", "translate(" + x(d.timestamp) + "," + y(d.value) + ")")
                .text(`${line.name} ${d.value} ${line.unit}`);

            /*    focus
                   .select("text.y2")
                   .attr("transform", "translate(" + x(d.timestamp) + "," + y(d.value) + ")")
                   .text(d.value); */

            focus
                .select("text.y3")
                .attr("transform", "translate(" + x(d.timestamp) + "," + y(d.value) + ")")
                .text(formatDate(d.timestamp));

            focus
                .select("text.y4")
                .attr("transform", "translate(" + x(d.timestamp) + "," + y(d.value) + ")")
                .text(formatDate(d.timestamp));

            focus
                .select(".x")
                .attr("transform", "translate(" + x(d.timestamp) + "," + y(d.value) + ")")
                .attr("y2", height - y(d.value));

            focus
                .select(".y")
                .attr("transform", "translate(" + width * -1 + "," + y(d.value) + ")")
                .attr("x2", width + width);
        }

        svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => {
                focus.style("display", null);
            })
            .on("mouseout", () => {
                focus.style("display", "none");
            })
            .on("touchmove mousemove", mouseMove);

    });
}
