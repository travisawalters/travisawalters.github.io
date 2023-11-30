document.addEventListener('DOMContentLoaded', function () {
    let snapPoints = document.querySelectorAll('.page');
    let currentSnapPoint = 0;
    let isScrolling;
    let zooming = false;

    window.addEventListener('resize', function() {
        // Detect zoom by checking the change in window dimensions
        zooming = checkZoom();
    });

    window.addEventListener('wheel', function (e) {
        if (zooming) return; // Don't snap if the user is zooming

        clearTimeout(isScrolling);

        isScrolling = setTimeout(function () {
            if (e.deltaY > 20 && currentSnapPoint < snapPoints.length - 1 && atPageEnd()) {
                currentSnapPoint++;
            } else if (e.deltaY < -20 && currentSnapPoint > 0 && atPageStart()) {
                currentSnapPoint--;
            }
            snapPoints[currentSnapPoint].scrollIntoView({behavior: 'smooth'});
        }, 66);
    });

    function checkZoom() {
        return window.outerWidth !== window.innerWidth;
    }

    function atPageEnd() {
        // Custom logic to check if the user is at the end of the page
        // This is a placeholder and needs to be refined based on actual requirements
        return window.innerHeight + window.scrollY >= document.body.offsetHeight;
    }

    function atPageStart() {
        // Custom logic to check if the user is at the start of the page
        // This is a placeholder and needs to be refined based on actual requirements
        return window.scrollY === 0;
    }
});
