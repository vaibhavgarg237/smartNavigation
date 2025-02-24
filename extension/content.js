
window.onload = function() {
    console.log("loaded",document.getElementsByClassName("yt-core-image")[0]);
}

document.addEventListener('mousemove', function(event) {
    if (window.location.href.includes("youtube.com")) {
    //   console.log('Mouse moved on home page:', event.clientX, event.clientY);
    }
});
