console.log('Loaded!');

var element = document.getElementById("main-text");
element.innerHTML = "sravani";

var img = document.getElementById('image');
var marginLeft = 10;
function moveRight() {
    marginLeft = marginLeft+ 10;
    img.style.marginLeft = marginLeft + 'px'; 
}

img.onclick = function() {
    var interval = setInterval(moveRight, 100);
};