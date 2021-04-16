import * as d3 from 'd3';
import { interpolate } from 'flubber';
import addHiddenDonutArc from './src/addHiddenDonutArc';
import countryData from './data/countryData.json';
import {
    ecologicalData, socialShortfallData, stylizedCircles,
quadrantData,} from './data/data'
// import nmac from './data/nmac.svg';
// import eu from './data/eu.svg';
// import uk from './data/uk.svg';

// const flags = {
//     nmac,
//     eu,
//     uk
// };


let transitionedFromDoughnut = false;
let transitionedFromChart = false;
const margin = ({top: 25, right: 20, bottom: 35, left: 40});

const width = 800, height = 800,
    innerRadius = 50, padAngle = 0.02;

const radius = Math.min(width, height) / 2,
    outerRadius = radius - 10;
const viewportWidth = width - margin.right - margin.left;
const viewportHeight = height - margin.bottom - margin.top;
let circles;


const pie = d3.pie()
    .padAngle(padAngle)
    .value(1);

const planetaryBoundariesRadius = Math.min(width, height) / 3;
const socialFoundationRadius = planetaryBoundariesRadius / 1.47;
// console.log('planetarbyBoundariesRadius', planetaryBoundariesRadius, 'socialFoundation ', socialFoundationRadius)
const socialShortfallArcFun =
    d3.arc()
    .innerRadius(() => 100 + Math.random() * (socialFoundationRadius - 100) )
    .outerRadius( socialFoundationRadius)

const socialBasisFoundationArcFun = d3.arc()
    .innerRadius(10).outerRadius(socialFoundationRadius);

const insidePlanetaryBoundariesArcFun = d3.arc()
    .innerRadius(socialFoundationRadius)
    .outerRadius(
        (d) => {
            if (d.data.full) {
                return planetaryBoundariesRadius;
            }
            return socialFoundationRadius + 40 + Math.random() * (planetaryBoundariesRadius - socialFoundationRadius - 40);
        }
    )
const outsidePlanetaryBoundariesArcFun = d3.arc()
    .innerRadius(planetaryBoundariesRadius)
    .outerRadius(
        (d) => {
            if (!d.data.full) {
                return planetaryBoundariesRadius;
            }
            return planetaryBoundariesRadius + 20 + Math.random() * 20;
        }
    )

// DOUGHNUT CHART
const socialPie = pie(socialShortfallData);
const ecoPie = pie(ecologicalData);

const svg = d3.select('svg');
const g = d3.select('g');

const doughnutThresholds = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

const smallCircle = d3.arc()
    .innerRadius(socialFoundationRadius - 20)
    .outerRadius(socialFoundationRadius)
    .startAngle(Math.PI).endAngle(Math.PI * 3)

const largeCircle = d3.arc()
    .innerRadius(planetaryBoundariesRadius - 20)
    .outerRadius(planetaryBoundariesRadius)
    .startAngle(Math.PI).endAngle(Math.PI * 3)

const socialThresholdCircle = doughnutThresholds.data([{value: 1}])
    .append('path')
    .attr('class',  'social-threshold')
    .attr('d', smallCircle)
    .attr('fill', 'green')
    .attr('stroke', 'green')
    .attr('stroke-width', 0)
    .each(function(d,i) {
        return addHiddenDonutArc(this, svg, "social-threshold-text-arc")
});

const planetaryThresholdCircle = doughnutThresholds.data([{value: 1}])
    .append('path')
    .attr('class',  'planetary-threshold')
    .attr('d', largeCircle)
    .attr('fill', 'green')
    .attr('stroke', 'green')
    .attr('stroke-width', 0)
    .each(function(d,i) {
        return addHiddenDonutArc(this, svg, "planetary-threshold-text-arc")
});

doughnutThresholds
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data([{name: "Social Foundations"}])
        .join("text")
        .append('textPath')
            .attr("startOffset","50%")
            .attr('xlink:href', '#social-threshold-text-arc')
            .style("text-anchor","middle") //place the text halfway on the ar
            .call(text => text.append("tspan")
        // .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .attr('x', 5)
            .attr('fill', 'white')
            .attr('dy', 15)
            .text(d => d.name))

doughnutThresholds
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data([{name: "Planetary Boundaries"}])
.join("text")
    .append('textPath')
        .attr("startOffset","50%")
    .attr('xlink:href', '#planetary-threshold-text-arc')
    .style("text-anchor","middle") //place the text halfway on the ar
    .call(text => text.append("tspan")
        // .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .attr('x', 5)
        .attr('fill', 'white')
        .text(d => d.name))

const socialArcs = g.selectAll('path.social-arc')
    .data(socialPie)
    .join('path')
    .attr('d', socialBasisFoundationArcFun)
    .attr('stroke', 'lightblue')
    .attr('class', 'social-arc')
    .attr('fill', 'lightblue');

const socialShortfallArcs = g.selectAll('path.social-shortfall-arc')
    .data(socialPie)
    .join('path')
    .attr('d', socialShortfallArcFun)
    .attr('stroke', 'red')
    .attr('class', 'social-shortfall-arc')
    .attr('fill', 'red');

const planetaryArcs = g.selectAll('path.planetary-arc')
    .data(ecoPie)
    .join('path')
    .attr('d', insidePlanetaryBoundariesArcFun)
    .attr('class', 'planetary-arc')
    .attr('fill', 'lightgreen');

const planetaryOvershootArcs = g.selectAll('path.planetary-overshoot-arc')
    .data(ecoPie)
    .join('path')
    .attr('d', outsidePlanetaryBoundariesArcFun)
    .attr('class', 'planetary-overshoot-arc')
    .attr('fill', 'red');



const socialFoundationLabels = svg.append("g")
    .attr('transform', `translate(${width / 2}, ${height / 2})`)
    .attr("font-family", "sans-serif")
    .attr("font-size", 8)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(socialPie)
    .join("text")
    .attr("transform", d => `translate(${socialBasisFoundationArcFun.centroid(d)})`)
    .call(text => text.append("tspan")
    //   .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name));
const planetaryBoundariesLabels = svg.append("g")
    .attr('transform', `translate(${width / 2}, ${height / 2})`)
    .attr("font-family", "sans-serif")
    .attr("font-size", 8)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(ecoPie)
    .join("text")
    .attr("transform", d => `translate(${insidePlanetaryBoundariesArcFun.centroid(d)})`)
    .call(text => text.append("tspan")
    //   .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name));

const y = d3.scaleLinear()
    .domain([0, socialShortfallData.length])
    .range([height - margin.bottom, margin.top])
const x = d3.scaleLinear()
    .domain([0, ecologicalData.length])
    .range([margin.left, width - margin.right]);
const z = d3.scaleLinear()
    .domain(d3.extent(countryData.map(_ => _.population)))
    .range([4, 50]);

const xAxis = g => g
.attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
.style('opacity', 0)
.call(d3.axisBottom(x).ticks(ecologicalData.length))
.call(g => g.select(".domain").remove())
.call(g => g.append("text")
    .attr("x", width - margin.right - 20)
    .attr("y", margin.bottom - 4)
    .attr("fill", "currentColor")
    .attr("text-anchor", "end")
    .attr('font-size', 14)
    .text('Ecological Thresholds Passed'))

const yAxis = g => g
.attr("transform", `translate(${margin.left},0)`)
.style('opacity', 0)
.call(d3.axisLeft(y).ticks(socialShortfallData.length))
.call(g => g.select(".domain").remove())
.call(g => g.append("text")
    .attr("x", -margin.left)
    .attr("y", 10)
    .attr("fill", "currentColor")
    .attr('font-size', 14)
    .attr("text-anchor", "start")
    .text('Social Thresholds Achieved'))
const gx = svg.append("g").attr('class', 'x-axis')

const gy = svg.append("g").attr('class', 'y-axis');
const gridGroup = svg.append("g");
const color = d3.scaleOrdinal().domain(quadrantData.map(_ => `${_.impact}-${_.dev}`))
    .range(d3.schemeCategory10)
const quadrantGroup = svg.append('g').attr('class', 'quadrants-group')

const transitionFromDoughnut = async () => {

const grid = g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
    .selectAll("line")
    .data(x.ticks())
    .join("line")
        .attr('class', 'x-grid')
        .style('opacity', 0)
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
    .call(g => g.append("g")
    .selectAll("line")
    .data(y.ticks())
    .join("line")
        .attr('class', 'y-grid')
        .style('opacity', 0)
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right));


    gx.call(xAxis);
    gy.call(yAxis);

    let animationPromises = [];
    animationPromises = animationPromises.concat(
        planetaryThresholdCircle.transition().duration(400).style('opacity', 0).end(),
        socialFoundationLabels.transition().duration(400).style('opacity', 0).end(),
        planetaryBoundariesLabels.transition().duration(400).style('opacity', 0).end(),
        socialThresholdCircle.transition().duration(400).style('opacity', 0).end()
    );
    const coordRegex = /translate\((-?\d*\.?\d*),(-?\d*\.?\d*)\)/;
    let planetaryArcsAnimation =
        g.selectAll('path.planetary-arc').transition()
        .delay((d, i) => 50 * i)
        .duration(300)
        .attrTween('fill', () => d3.interpolateRgb('lightgreen', 'black'))
        .attrTween('stroke', () => d3.interpolateRgb('lightgreen', 'black'))
        .attrTween('d',function (d, i) {
            const xTicks = gx.selectAll('.tick');
            const tick = d3.select(xTicks._groups[0][i]);
            const nextTick = d3.select(xTicks._groups[0][ i+1 ]);

            const coordinates = coordRegex.exec(tick.attr('transform'));
            const nextCoordinates = coordRegex.exec(nextTick.attr('transform'));

            return interpolate(socialBasisFoundationArcFun(d), [
                [parseInt(coordinates[1]) -400 + margin.left, parseInt(coordinates[2]) - 400 + height - margin.bottom],
                [parseInt(nextCoordinates[1]) -400 + margin.left, parseInt(nextCoordinates[2]) - 400 + height - margin.bottom]]
                );
        }).end();
    let planetaryOvershootArcsAnimation =
        g.selectAll('path.planetary-overshoot-arc').transition()
        .delay((d, i) => 50 * i)
        .duration(300)
        .attrTween('stroke', () => d3.interpolateRgb('red', 'black'))
        .attrTween('d',function (d, i) {
            const xTicks = gx.selectAll('.tick');
            const tick = d3.select(xTicks._groups[0][i]);
            const nextTick = d3.select(xTicks._groups[0][ i+1 ]);

            const coordinates = coordRegex.exec(tick.attr('transform'));
            const nextCoordinates = coordRegex.exec(nextTick.attr('transform'));


            return interpolate(socialBasisFoundationArcFun(d), [
                [parseInt(coordinates[1]) -400 + margin.left, parseInt(coordinates[2]) - 400 + height - margin.bottom],
                [parseInt(nextCoordinates[1]) -400 + margin.left, parseInt(nextCoordinates[2]) - 400 + height - margin.bottom]]
                );
        }).end()

    let xAxisAnimation =
        gx.transition()
        .duration(300)
        .delay(1000)
        .style('opacity', 1).end()

    animationPromises.push(
        planetaryArcsAnimation, planetaryOvershootArcsAnimation, xAxisAnimation
    );

    await Promise.all([planetaryArcsAnimation, planetaryOvershootArcsAnimation, xAxisAnimation]);
    let socialArcsAnimation =
        g.selectAll('path.social-arc').transition()
        .delay((d, i) => 50 * i)
        .duration(300)
        .attrTween('fill', () => d3.interpolateRgb('lightblue', 'black'))
        .attrTween('stroke', () => d3.interpolateRgb('lightblue', 'black'))
        .attrTween('d',function (d, i) {
            const yTicks = gy.selectAll('.tick');
            const tick = d3.select(yTicks._groups[0][i]);
            const nextTick = d3.select(yTicks._groups[0][ i+1 ]);

            const coordinates = coordRegex.exec(tick.attr('transform'));
            const nextCoordinates = coordRegex.exec(nextTick.attr('transform'));

            return interpolate(socialBasisFoundationArcFun(d), [
                [parseInt(coordinates[1]) - 400 + margin.left, parseInt(coordinates[2]) - 400],
                [parseInt(nextCoordinates[1]) - 400 + margin.left, parseInt(nextCoordinates[2]) - 400]]
                );
    }).end();
    let socialShortfallArcsAnimation =
        g.selectAll('path.social-shortfall-arc').transition()
        .delay((d, i) => 50 * i)
        .duration(300)
        .attrTween('fill', () => d3.interpolateRgb('red', 'black'))
        .attrTween('stroke', () => d3.interpolateRgb('red', 'black'))
        .attrTween('d',function (d, i) {
            const yTicks = gy.selectAll('.tick');
            const tick = d3.select(yTicks._groups[0][i]);
            const nextTick = d3.select(yTicks._groups[0][ i+1 ]);

            const coordinates = coordRegex.exec(tick.attr('transform'));
            const nextCoordinates = coordRegex.exec(nextTick.attr('transform'));


            return interpolate(socialBasisFoundationArcFun(d), [
                [parseInt(coordinates[1])- 400 + margin.left, parseInt(coordinates[2]) - 400],
                [parseInt(nextCoordinates[1])- 400 + margin.left, parseInt(nextCoordinates[2]) - 400]]
                );
        }).end()

    animationPromises.push(
        socialArcsAnimation, socialShortfallArcsAnimation
    );

    gridGroup.call(grid);
    animationPromises.push(
        gridGroup.selectAll('line').transition()
        .duration(300)
        .delay((d, i) => i * 100)
        .style('opacity', 1).end()
    )
    animationPromises.push(
    gy.transition()
        .duration(300)
        .delay(1000)
        .style('opacity', 1).end()
    )

    const circleGroup = svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .attr('class', 'circles-group')
    circles = circleGroup.selectAll('circle')
        .data(countryData)
        .join('circle')
        .style('opacity', 0)
        .attr('fill-opacity', 0.5)
        .attr('fill', 'lightblue')
        .attr('r', d => z(d.population))
        .attr('cx', d => x(d.biophysicalTransgressed))
        .attr('cy', d => y(d.socialAchieved));
    animationPromises.push(
    circles
        .transition().delay((d, i) => 1700 + 10 * i).duration(200).style('opacity', 1).end()
    );

                // firstTransition.then(
                //     () => (
                // flagsGroup.selectAll('circle')
                // .transition()
                //     .attr('cx', (d) => (
                //         d.name !== 'nmac' ? x(d.biophysicalTransgressed + 3) :
                //         x(d.biophysicalTransgressed - 1))
                //     )
                //     .attr('cy', (d) => (
                //         d.name !== 'nmac' ? y(d.socialAchieved - 1) :
                //         y(d.socialAchieved - 5))
                //     )
                //     .duration(500)
                //     .ease(d3.easeCubicIn)
                //     .delay(1000).end()
                //     ).then(() => ((
                // flagsGroup.selectAll('circle')
                // .transition()
                //     .attr('cx', (d) => (
                //         d.name !== 'nmac' ? x(d.biophysicalTransgressed - 3) :
                //         x(d.biophysicalTransgressed - 4))
                //     )
                //     .attr('cy', (d) => (
                //         d.name !== 'nmac' ? y(d.socialAchieved + 1) :
                //         y(d.socialAchieved + 6))
                //     )
                //     .duration(500)
                //     .ease(d3.easeCubicIn)
                //     .delay(1000).end()
                // ))

    return Promise.all(animationPromises)
};

const transitionFromChartToQuadrants = async () => {
    let transition = new Promise((resolve, reject) => {
        resolve();
    });
    if (!transitionedFromDoughnut) {
        transition = transitionFromDoughnut();
    }
    await transition;
    quadrantGroup.selectAll('g')
        .data(quadrantData)
        .join('g')
        .style('opacity', 0)
        .append('rect')
            .attr('width', viewportWidth / 2)
            .attr('height', viewportHeight / 2)
            .attr('fill-opacity', 0.4)
            .attr('fill', (d) => color(`${d.impact}-${d.dev}`))
            .attr('x', (d, i) => i % 2 ? viewportWidth / 2 + margin.left : margin.left)
            .attr('y', (d, i) => i > 1 ? viewportHeight  / 2 + margin.top : margin.top)
    quadrantGroup.selectAll('g')
        .attr("font-size", 18)
        .attr("text-anchor", "middle")
            .append("text")
                .attr("font-weight", "bold")
                .attr('x', (d, i) => {
                    return (i % 2 ? viewportWidth / 2 : 0) + viewportWidth / 4
                })
                .attr('y', (d, i) => (i > 1 ? viewportHeight / 2 : 0) + viewportHeight / 4)
                .attr('fill', 'white')
                .call(text => {
                    text.append('tspan')
                    .style("text-anchor","middle")
                    .text((d, i) => d.impact)
                    text.append('tspan')
                    .text((d, i) => d.dev)
                    .style("text-anchor","middle")
                    .attr('dy', 18)
                    .attr('x', (d, i) => `${50 + (i % 2 ? 25 : -25)}%`)
                })
    circles.transition().duration(300).style('opacity', 0);
    quadrantGroup.selectAll('g').transition()
        .delay((d, i) => 200 * i).duration(300)
        .style('opacity', 1)
    const flagsGroup = svg.append('g').attr('transform', `translate(${margin.left,0})`);
    flagsGroup.selectAll('circle').data(stylizedCircles)
        .join('circle')
            .style('opacity', 0)
            .attr('cx', (d) => x(d.biophysicalTransgressed))
            .attr('cy', d => y(d.socialAchieved))
            .attr('r', 45)
            .attr('class', (d) => d.name)
            .attr('fill', d => `url(#${d.name})`)
            .transition()
            .delay(2000)
            .duration(300)
            .style('opacity', 1);

    const firstTransition = flagsGroup.selectAll('circle')
        .transition()
            .attr('cx', (d) => (
                d.name !== 'nmac' ? x(d.biophysicalTransgressed - 3) :
                x(d.biophysicalTransgressed + 1))
            )
            .attr('cy', (d) => (
                d.name !== 'nmac' ? y(d.socialAchieved + 1) :
                y(d.socialAchieved + 5))
            )
            .duration(500)
            .ease(d3.easeExpIn)
            .delay(3200).end();

    };

    document.getElementById('transition-from-doughnut').addEventListener('click', transitionFromDoughnut)
    document.getElementById('transition-from-chart').addEventListener('click', transitionFromChartToQuadrants)