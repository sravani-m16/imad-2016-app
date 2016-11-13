console.log('Loaded!');

var element = document.getElementById("main-text");
element.innerHTML = "sravani";

var img = document.getElementById('image');
img.onclick = function() {
    var interval = setInterval(moveLeft, 100);
};