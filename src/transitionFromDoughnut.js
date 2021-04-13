import { interpolate } from 'flubber';

export default (g) => {

    const lineData =[
        {x: 0, y: 10},
        {x: 10, y: 10},
        {x: 20, y: 10},
        {x: 30, y: 10},
        {x: 40, y: 10},
        {x: 50, y: 10},
        {x: 60, y: 10},
        {x: 70, y: 10},
        {x: 80, y: 10},
        {x: 90, y: 10},
        {x: 100, y: 10},
        {x: 110, y: 10},
        {x: 120, y: 10},
    ]
g.selectAll('path').transition()
    .delay((d, i) => 50 * i)
    .duration(300)
    .attrTween('d',function (d, i) {
        console.log(arcFun(d), [lineData[i].x, lineData[i].y])
        return interpolate(arcFun(d), [
            [lineData[i].x, lineData[i].y],
            [lineData[i + 1].x, lineData[i].y]]
            );
    })
}