document.addEventListener('DOMContentLoaded', function () {
    let snapPoints = document.querySelectorAll('.page');
    let currentSnapPoint = 0;
    let isScrolling;
    let lastWidth = window.innerWidth;
    let zooming = false;

    window.addEventListener('resize', function() {
        if (window.innerWidth !== lastWidth) {
            zooming = true;
            document.body.style.scrollSnapType = 'none';
            lastWidth = window.innerWidth;
        } else {
            zooming = false;
            document.body.style.scrollSnapType = 'y mandatory';
        }
    });

    window.addEventListener('wheel', function (e) {
        if (zooming) return;

        clearTimeout(isScrolling);

        isScrolling = setTimeout(function () {
            if (e.deltaY > 20 && currentSnapPoint < snapPoints.length - 1) {
                currentSnapPoint++;
            } else if (e.deltaY < -20 && currentSnapPoint > 0) {
                currentSnapPoint--;
            }
            snapPoints[currentSnapPoint].scrollIntoView({behavior: 'smooth'});
        }, 66);
    });
});
