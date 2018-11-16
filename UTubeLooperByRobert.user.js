// ==UserScript==
// @name         UTubeLooperByRobert
// @namespace    http://tampermonkey.net/
// @version      1
// @description  loop your music from Youtube
// @author       RobertW
// @match        http*://www.youtube.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// ==/UserScript==


var count = 1;
var intervalGlobal = 0;
var uloopersActive = false;

function createStyles() {
    var fonts1 = document.createElement("link");
    fonts1.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    fonts1.rel = "stylesheet";
    $("head").append(fonts1);

    var fonts2 = document.createElement("link");
    fonts2.href = "https://use.fontawesome.com/releases/v5.0.8/css/all.css";
    fonts2.rel = "stylesheet";
    $("head").append(fonts2);

    var looperStyle = document.createElement("style");
    looperStyle.innerText = "";
    looperStyle.innerText += "/*#looper-U-tube * {box-sizing:border-box;}*/";
    looperStyle.innerText += "#looper-U-tube {position:fixed;height:100%;width:0px;background-color:rgba(255,255,255,0.9);color:black;transition:width 0.2s;z-index:100000;border-right:1px solid black;border-left:3px dashed black;overflow-x:hidden;font-size:12px;text-align:left; background: #ff5349;}";
    looperStyle.innerText += "#looper-U-tube:hover {width:300px;}";

    looperStyle.innerText += "#looper-U-tube.switch {right:0px;}";

    looperStyle.innerText += "#looper-U-tube button, #looper-U-tube i {cursor:pointer;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U i#switched.tools.material-icons {width:30px;height:30px;position:absolute;right:10px;top:10px;font-size:30px;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U i#switched.tools.material-icons:hover {width:30px;height:30px;color:white;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U {width:300px;height:auto;overflow-y:auto;overflow-x:hidden;position:relative;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #controls-U button {width:50px;height:50px;padding:10px;margin:20px 10px 20px 10px;border:1px solid transparent;border-radius:50%;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #controls-U button.start {background-color:#ff5349;color:white;font-weight:bold;border: 1px solid black;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #controls-U button.start:hover {background-color:#2A2C31;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #controls-U button.start .material-icons {font-size:28px;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #controls-U button.stop {background-color:red;color:white;font-weight:bold;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #controls-U button.stop:hover {background-color:darkred;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U p.logo-U {font-family:Roboto;font-size:42px;background-color:#ff5349;font-weight:700;text-align:center;color:red;text-shadow:3px 3px 3px black;margin-top:50px;margin-bottom:40px;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper {position:relative;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div {display:block;width:auto;text-align:left;margin:0px 15px;font-family:courier;color:red;font-weight:bold;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div.p-line {height:37px;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div .inp {display:inline-block;width:80px;height:35px;text-align:right;border:1px solid black;background-color:#ededf066;padding:0px 20px 0px 0px;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div .inp {border-color: #f5b74d #e5a73e #d79930;border-style: solid;border-width: 1px;background-color: #fed662;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div .inp:hover {background-color:white;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div .inp.from {border-top-right-radius:5px;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div .inp.to {border-bottom-right-radius:5px;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div span.leftInp {display:inline-block;vertical-align:top;width:50px;height:35px;line-height:35px;text-align:center;border:1px solid black;background-color:red;padding:0px;color:black;font-family:Roboto;font-size:11px;}";

    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div span.leftInp.f {border-top-left-radius:5px;   background: #ff5c49;background: -moz-linear-gradient(top, #ff5c49 0%, #ff0000 30%);background: -webkit-linear-gradient(top, #ff5c49 0%,#ff0000 30%);background: linear-gradient(to bottom, #ff5c49 0%,#ff0000 30%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff5c49', endColorstr='#ff0000',GradientType=0 );}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div span.leftInp.t {border-bottom-left-radius:5px;border-top:0px;    background: #ff0000;background: -moz-linear-gradient(top, #ff0000 70%, #ff5c49 100%);background: -webkit-linear-gradient(top, #ff0000 70%,#ff5c49 100%);background: linear-gradient(to bottom, #ff0000 70%,#ff5c49 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff0000', endColorstr='#ff5c49',GradientType=0 );}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div span.leftInp.f, #looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div span.leftInp.t {border-color: #f5b74d #e5a73e #d79930;border-style: solid;border-width: 1px;background-color: #fed662;background-image: -webkit-gradient(linear,left top,left bottom,from(#fee072),to(#ffc64a));background-image: -webkit-linear-gradient(top,#fee072,#ffc64a);background-image: -moz-linear-gradient(center top,#fee072,#ffc64a);background-image: -o-linear-gradient(top,#fee072,#ffc64a);background-image: linear-gradient(to bottom,#fee072,#ffc64a);background-repeat: repeat-x;color: #555;text-decoration: none;font-family: Helvetica,Arial,sans-serif;}";

    looperStyle.innerText += "/*#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div .looperBtn {width:110px;text-align:center;border:1px solid black;background-color:silver;color:black;border-radius:5px;}*/";
    looperStyle.innerText += "/*#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div .looperBtn:hover {border:1px solid black;background-color:black;color:white;}*/";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div hr {border:1px solid black;background-color:black;color:white;margin-top:20px;margin-bottom:20px;}";

    looperStyle.innerText += "#looper-U-tube button.looperBtn {width:30px;height:30px;display:inline-block;line-height:35px;position:relative;top:5px;color:black;background-color:transparent;border:0;border-radius:50%;margin:0;padding:0;}";
    looperStyle.innerText += "#looper-U-tube button.looperBtn:hover {border:0;border-radius:50%;color:red;}";
    looperStyle.innerText += "#looper-U-tube button.looperBtn i.material-icons {font-size:18px;}";

    looperStyle.innerText += "#looper-U-tube button.addNewLoop {width:50%;text-align:center;border:0;background-color:transparent;color:black;font-weight:bold;font-size:28px;}";
    looperStyle.innerText += "#looper-U-tube button.addNewLoop.add:hover {color:#00db00;}";
    looperStyle.innerText += "#looper-U-tube button.addNewLoop.remove:hover {color:red;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div.numberIco {color:#781111;position:absolute;right:10px;top:50px;text-shadow:none;}";
    looperStyle.innerText += "#looper-U-tube #outerWrapper-U #innerWrapper-U .oneLoopWrapper div.numberIco.active {color: #23e341;}";

    looperStyle.innerText += "#looper-U-tube .hiddeThis {visibility:hidden;}";

    $("head").append(looperStyle);
}

function createUWrapper() {
    var uBox = document.createElement("div");
    uBox.id = "looper-U-tube";
    uBox.innerHTML = "";
    uBox.innerHTML += '<div id="outerWrapper-U"><p class="logo-U"><span style="color:red;">A</span><span style="color:green;">L</span><span style="color:blue;">C</span><span style="color:orange;">O</span><span style="color:black;">H</span><span style="color:yellow;">O</span><span style="color:lightblue;">L</span></p><i id="switched" class="tools material-icons">compare_arrows</i><div id="controls-U"><button id="uLoopers" class="start"><i class="material-icons">check_circle</i></button><button id="noAdvertisment" class="start"><i class="material-icons">fast_forward</i></button><button id="clearuLoopers" class="start hiddeThis"><i class="material-icons">pan_tool</i></button></div><div id="innerWrapper-U"></div></div>';

    $("body").prepend(uBox);
}


function createUInnerWrapper() {
    if (count < 10) {

        var oneLoop = document.createElement("div");
        oneLoop.id = count;
        oneLoop.className = "oneLoopWrapper";
        oneLoop.innerHTML = '<div class="numberIco"><i class="material-icons">filter_' + count + '</i></div>' +
                '<div class="p-line"><span class="leftInp f">FROM</span><input class="inp from" type="text" name="from" value="0"><button id="' + count + 'from" class="looperBtn"><i class="material-icons">content_cut</i></button></div>' +
                '<div class="p-line"><span class="leftInp t">TO</span><input class="inp to" type="text" name="to" value="0"><button id="' + count + 'to" class="looperBtn"><i class="material-icons">content_cut</i></button></div>' +
                '<div><hr/></div>';

        $("body div#looper-U-tube div#outerWrapper-U div#innerWrapper-U").append(oneLoop);

        //domkniecie closure
        (function(count){
            document.getElementById(count+"from").onclick = function() {cutActualTime(count,"from");};
            document.getElementById(count+"to").onclick = function() {cutActualTime(count,"to");};
        })(count);

        count++;
    }
}

function removeUInnerWrapper() {
    if (count > 2) {
        count--;
        var list = document.getElementById("innerWrapper-U");
        list.removeChild(list.childNodes[count - 1]);
    }
}

function createUInnerWrapperMore() {
    var more = document.createElement("div");
    more.innerHTML = '<button class="addNewLoop add" id="addNewLoop"><i class="material-icons">add_box</i></button><button class="addNewLoop remove" id="removeNewLoop"><i class="material-icons">remove_circle</i></button>';

    $("body div#looper-U-tube div#outerWrapper-U").append(more);
}

//function looperUtube(start, end) {
//    var vi = document.getElementsByTagName("video");
//    vi[0].currentTime = start;
//    return setInterval(function () {
//        if (vi[0].currentTime > end)
//            vi[0].currentTime = start;
//    }, 1000);
//}

//var timestamps = [{start:100,end:105},{start:10,end:20},{start:50,end:65},{start:111,end:122}];

function Loop(start, end) {
    this.start = start;
    this.end = end;
}
Loop.prototype.check = function () {
    if (this.start > this.end)
        return false;
    else
        return true;
};

function uLoopers() {
    stopuLoopers();
    uloopersActive = true;
    document.getElementById("clearuLoopers").style.visibility = 'visible';

    //var tab = [{start: 100, end: 105}, {start: 10, end: 20}, {start: 600, end: 615}, {start: 110, end: 120}];
    var tab = new Array();

    for (var id = 1; id < count; id++) {
        var t1 = document.getElementById(id).getElementsByTagName('input')["from"];
        var t2 = document.getElementById(id).getElementsByTagName('input')["to"];

        tab.push(new Loop(t1.value, t2.value));
    }

    var vi = document.getElementsByTagName("video")[0];
    vi.currentTime = tab[0].start;

    var i = 0;

    document.getElementById("1").firstChild.className += " active";

    intervalGlobal = setInterval(function () {
        if (vi.currentTime > tab[i].end) {
            i++;
            if (i == tab.length) {
                i = 0;
            }
            vi.currentTime = tab[i].start;

            for(var a = 1;a < count;a++){ document.getElementById(a).firstChild.className = "numberIco"; }
            if(i+1 < count) document.getElementById(i+1).firstChild.className += " active";
        }
    }, 1000);
}
function stopuLoopers() {
    uloopersActive = false;
    for(var a = 1;a < count;a++){ document.getElementById(a).firstChild.className = "numberIco"; }
    document.getElementById("clearuLoopers").style.visibility = 'hidden';

    return clearInterval(intervalGlobal);
}

function noAdvertisment() {
    var vi = document.getElementsByTagName("video")[0];
    vi.currentTime = 100000;
}

function cutActualTime(id, txt) {
    var vi = document.getElementsByTagName("video")[0];
    current = vi.currentTime;

    console.log("cutActualTime"+id+" "+txt+" time:"+current+" seconds ");

    var idobj = document.getElementById(id).getElementsByTagName('input')[txt];
    idobj.value = current.toFixed(0);

}

function switched(){
    var c = document.getElementById("looper-U-tube");
    if(c.className=="switch")c.className = ""; else c.className = "switch";
}

function createEvents(){

    document.getElementById("switched").onclick = switched;
    document.getElementById("noAdvertisment").onclick = noAdvertisment;
    document.getElementById("uLoopers").onclick = uLoopers;
    document.getElementById("clearuLoopers").onclick = stopuLoopers;

    document.getElementById("addNewLoop").onclick = createUInnerWrapper;
    document.getElementById("removeNewLoop").onclick = removeUInnerWrapper;

}

createStyles();
createUWrapper();
createUInnerWrapper();
createUInnerWrapperMore();

createEvents();
