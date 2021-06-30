const sampleData = [{
    date: "2021-01-15T10:00:00.000",
    price: .5
},
{
    date: "2021-01-16T10:00:00.000",
    price: 1.5
},
{
    date: "2021-01-17T10:00:00.000",
    price: 1.4
},
{
    date: "2021-01-18T10:00:00.000",
    price: 1.3
},
{
    date: "2021-01-19T10:00:00.000",
    price: 1.2
},
{
    date: "2021-01-20T10:00:00.000",
    price: 2.5
},
{
    date: "2021-01-21T10:00:00.000",
    price: 2.0
}];

const formatedData = d3.csvFormat(sampleData);
formatedData && console.log('formatData=', formatedData);
/* Line 1: "Feed", unit=Kilograms per hector (kg/ha)
[
    {
        timestamp: "2021-01-15T10:00:00.000",
        value: .5
    },
    {
        timestamp: "2021-01-16T10:00:00.000",
        value: 1.5
    },
    {
        timestamp: "2021-01-17T10:00:00.000",
        value: 1.4
    },
    {
        timestamp: "2021-01-18T10:00:00.000",
        value: 1.3
    },
    {
        timestamp: "2021-01-19T10:00:00.000",
        value: 1.2
    },
    {
        timestamp: "2021-01-20T10:00:00.000",
        value: 2.5
    },
    {
        timestamp: "2021-01-21T10:00:00.000",
        value: 2.0
    }
]Line 2: "Biomass", unit=Kilograms per hector (kg/ha)
[
    {
        timestamp: "2021-01-15T10:00:00.000",
        value: 10
    },
    {
        timestamp: "2021-01-16T10:00:00.000",
        value: 11
    },
    {
        timestamp: "2021-01-17T10:00:00.000",
        value: 12
    },
    {
        timestamp: "2021-01-18T10:00:00.000",
        value: 12
    },
    {
        timestamp: "2021-01-19T10:00:00.000",
        value: 13.5
    },
    {
        timestamp: "2021-01-20T10:00:00.000",
        value: 9
    },
    {
        timestamp: "2021-01-21T10:00:00.000",
        value: 8
    }
]Line 3: "Ammonia", unit=Kilograms per hector (kg/ha)
[
     {
        timestamp: "2021-01-15T10:00:00.000",
        value: 5.1
    },
    {
        timestamp: "2021-01-16T10:00:00.000",
        value: 7
    },
    {
        timestamp: "2021-01-17T10:00:00.000",
        value: 7
    },
    {
        timestamp: "2021-01-18T10:00:00.000",
        value: 6
    },
    {
        timestamp: "2021-01-19T10:00:00.000",
        value: 5
    },
    {
        timestamp: "2021-01-20T10:00:00.000",
        value: 4
    },
    {
        timestamp: "2021-01-21T10:00:00.000",
        value: 3.1
    }
]

 */
console.log('formatted date =', new Date("2021-01-21T10:00:00.000"));
const margin = { top: 40, right: 80, bottom: 60, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;

const parseDate = d3.timeParse("%m/%d/%Y");
const formatDate = d3.timeFormat("%b %d");
const formatMonth = d3.timeFormat("%b");
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const area = d3
    .area()
    .x((d) => { return x(d.date); })
    .y0(height)
    .y1((d) => { return y(d.price); })
    .curve(d3.curveCardinal);

const valueline = d3
    .line()
    .x((d) => { return x(d.date); })
    .y((d) => { return y(d.price); })
    .curve(d3.curveCardinal);

const svg = d3
    .select("#root")
    .append("svg")
    .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(formatMonth));

svg.append("g").attr("class", "y axis").call(d3.axisLeft(y));

svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("USD");

svg
    .append("a")
    .attr("xlink:href", (d) => {
        return "https://www.moex.com/ru/index/rtsusdcur.aspx?tid=2552";
    })
    .attr("class", "subtitle")
    .attr("target", "_blank")
    .append("text")
    .attr("x", 0)
    .attr("y", height + 50)
    .text("Source: Moscow Exchange");

appendData(2020);
appendData(2019);

function appendData(year) {
    d3.selectAll("path.area").remove();
    d3.selectAll("path.line").remove();
    d3.selectAll(".title").remove();

    filename = "https://raw.githubusercontent.com/jukuznets/datasets/main/usd-" + year + ".csv";
    d3.csv(filename).then((data) => {
        console.log('d3.csv=', data);

        data = data.reverse();
        console.log('d3.csv reversed=', data);
        data.forEach((d) => {
            // d.date = new Date(d.date);
            //  console.log("d.date=", d.date);
            d.date = parseDate(d.date);
            // console.log("d.date==", d.date);
            d.price = Number(d.price);
        });

        x.domain(
            d3.extent(data, (d) => { return d.date; })
        );
        y.domain([
            55,
            d3.max(data, (d) => { return d.price; }),
        ]);

        svg
            .select(".x.axis")
            .transition()
            .duration(750)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));
        svg
            .select(".y.axis")
            .transition()
            .duration(750)
            .call(d3.axisLeft(y));

        /*   const areaPath = svg
              .append("path")
              .data([data])
              .attr("class", "area")
              .attr("d", area)
              .attr("transform", "translate(0,300)")
              .transition()
              .duration(1000)
              .attr("transform", "translate(0,0)"); */

        const linePath = svg
            .append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)

        const dataPoint = svg.append("circle")
            .data([data])
            .attr("class", "y")
            .style("fill", "none")
            .attr("r", 4);

        const pathLength = linePath.node().getTotalLength();

        linePath
            .attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-width", 3)
            .transition()
            .duration(1000)
            .attr("stroke-width", 0)
            .attr("stroke-dashoffset", 0);

        svg
            .append("text")
            .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "middle")
            .text("USD to RUB Exchange Rates, " + year);

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
            const bisect = d3.bisector((d) => d.date).left,
                x0 = x.invert(d3.pointer(event, this)[0]),
                i = bisect(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            focus
                .select("circle.y")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");

            focus
                .select("text.y1")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .text(d.price);

            focus
                .select("text.y2")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .text(d.price);

            focus
                .select("text.y3")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .text(formatDate(d.date));

            focus
                .select("text.y4")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .text(formatDate(d.date));

            focus
                .select(".x")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")")
                .attr("y2", height - y(d.price));

            focus
                .select(".y")
                .attr("transform", "translate(" + width * -1 + "," + y(d.price) + ")")
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