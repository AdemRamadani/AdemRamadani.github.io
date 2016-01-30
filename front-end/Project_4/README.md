## Website Performance Optimization portfolio project

### Setup

1. `git clone git@github.com:robbdempsey/front-end-course-p4.git`

2. `npm install`

3. `grunt imagemin`

4. `grunt responsive_images`

5. `grunt run:server`


### Optimizations

Using this [requestAnimationFrame ployfill](https://gist.github.com/paulirish/1579671) along with a few minor tweeks to the `eventListener` I was able to change the way the animation is rendered and produce significant performance results.

For the resizing of the pizzas, I went the [CSS](views/css/style.css#L49) route.  In [changePizzaSizes(size)](views/js/main.js#L445), I removed the math pieces and replaced it with a helper function to clean up css classes prior to adding back the necessary class for the size received as an argument.