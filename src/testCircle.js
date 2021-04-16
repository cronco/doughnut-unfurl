import * as d3 from 'd3';
const arc = d3.arc()
    .innerRadius(15)
    .outerRadius(35)
    .startAngle(Math.PI)
    .endAngle(Math.PI * 3);
const svg = d3.select('svg');
const g = svg.append('g').attr('transform', 'translate(400, 400)');
const arcSVG = g.append('path')
.attr('d', arc)
.attr('fill', 'none')
.attr('stroke', 'black')
.attr('stroke-width', 3);
const interpolator = arcFun => t => {

    const newArcFun = d3.arc();
    const innerRad = arcFun.innerRadius(),
        outerRad = arcFun.outerRadius();
   newArcFun.innerRadius(15 + 1020 * t)
    .outerRadius(35 + 1000 * t)
    .startAngle(Math.PI - Math.PI / 16 * t)
    .endAngle(Math.PI * 3 - Math.PI * 2 * t);
    // console.log(t, arcFun.innerRadius(), newArcFun.innerRadius())
   return newArcFun();

}
const transition = () => {
    arcSVG.transition()
        .duration(1000)
        .attrTween('transform', function(d, i) {
            return (t) => `translate(${-t * 400}, ${-t * 800}) scale(${1 + t * 4}, ${1 - t * 0.2})`
        })
        .attrTween('d', function(d, i) {
            return interpolator(arc)
        })

};
document.getElementById('transition').addEventListener('click', transition);