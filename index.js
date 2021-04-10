import * as d3 from 'd3';
    console.log('hey sup', d3.select);
      const radius = Math.min(width, height) / 2,
    outerRadius = radius - 10;
         const arc = d3
    .arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)
    .context(context);


  const circle = d3
    .arc()
    .startAngle(0)
    .endAngle(2 * Math.PI)
    .innerRadius(0)
    .context(context);

  const pie = d3.pie().padAngle(padAngle);

  const arcs = pie(data);