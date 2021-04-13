import * as d3 from 'd3';
export default function (element, container, pathId = 'textpathId') {
    //A regular expression that captures all in between the start of a string
    //(denoted by ^) and the first capital letter L
    var firstArcSection = /(^.+?)M/;

    //The [1] gives back the expression between the () (thus not the L as well)
    //which is exactly the arc statement
    var newArc = firstArcSection.exec( d3.select(element).attr("d"))[1];
    //Replace all the comma's so that IE can handle it -_-
    //The g after the / is a modifier that "find all matches rather than
    //stopping after the first match"
    newArc = newArc.replace(/,/g , " ");

    //Create a new invisible arc that the text can flow along
    container.append("path")
        .attr("class", "hiddenDonutArcs")
        .attr("id", pathId)
        .attr("d", newArc)
        .style("fill", "none");
}