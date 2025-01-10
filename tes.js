function isTouchEnabled() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}

document.addEventListener('DOMContentLoaded', function() {
    var intBase = document.getElementById('int_base');
    var extBase = document.getElementById('ext_base');
    var goInt = document.querySelector('.go_int');
    var goExt = document.querySelector('.go_ext');

    intBase.style.display = 'none';
    intBase.style.opacity = '0';

    goInt.addEventListener('click', function() {
        extBase.style.opacity = '0';
        setTimeout(function() {
            extBase.style.display = 'none';
            intBase.style.display = 'block';
            intBase.style.opacity = '1';
        }, 100);
    });

    goExt.addEventListener('click', function() {
        intBase.style.opacity = '0';
        setTimeout(function() {
            intBase.style.display = 'none';
            extBase.style.display = 'block';
            extBase.style.opacity = '1';
        }, 100);
    });

    for (let i = 1; i <= 8; i++) {
        int_addEvent('int_' + i);
    }

    for (let i = 1; i <= 27; i++) {
        ext_addEvent('ext_' + i);
    }
});

function ext_addEvent(id) {
    var _obj = document.getElementById(id);
    var config = ext_config[id];

    _obj.setAttribute('fill', config.upColor);
    _obj.setAttribute('fill-opacity', config.upOpacity);
    _obj.setAttribute('stroke', config.outlineUpColor);
    _obj.setAttribute('stroke-opacity', config.outlineUpOpacity);
    _obj.style.cursor = 'default';

    if (config.enable) {
        if (isTouchEnabled()) {
            _obj.addEventListener('touchstart', function(e) {
                var touch = e.touches[0];
                var x = touch.pageX + 10, y = touch.pageY + 15;
                var tipw = document.getElementById('organs-tip').offsetWidth;
                var tiph = document.getElementById('organs-tip').offsetHeight;

                x = (x + tipw > window.scrollX + window.innerWidth) ? x - tipw - (20 * 2) : x;
                y = (y + tiph > window.scrollY + window.innerHeight) ? window.scrollY + window.innerHeight - tiph - 10 : y;

                _obj.setAttribute('fill', config.overColor);
                _obj.setAttribute('fill-opacity', config.downOpacity);
                _obj.setAttribute('stroke', config.outlineDownColor);
                _obj.setAttribute('stroke-opacity', config.outlineDownOpacity);
                var tip = document.getElementById('organs-tip');
                tip.style.display = 'block';
                tip.innerHTML = config.hover;
                tip.style.left = x + 'px';
                tip.style.top = y + 'px';
            });

            _obj.addEventListener('touchend', function() {
                _obj.setAttribute('fill', config.upColor);
                _obj.setAttribute('fill-opacity', config.upOpacity);
                _obj.setAttribute('stroke', config.outlineUpColor);
                _obj.setAttribute('stroke-opacity', config.outlineUpOpacity);
                if (config.target === 'modal') {
                    $(config.url).modal("show");
                }
            });
        }

        _obj.style.cursor = 'pointer';

        _obj.addEventListener('mouseenter', function() {
            var tip = document.getElementById('organs-tip');
            tip.style.display = 'block';
            tip.innerHTML = config.hover;
            _obj.setAttribute('fill', config.overColor);
            _obj.setAttribute('fill-opacity', config.overOpacity);
            _obj.setAttribute('stroke', config.outlineOverColor);
            _obj.setAttribute('stroke-opacity', config.outlineOverOpacity);
        });

        _obj.addEventListener('mouseleave', function() {
            var tip = document.getElementById('organs-tip');
            tip.style.display = 'none';
            _obj.setAttribute('fill', config.upColor);
            _obj.setAttribute('fill-opacity', config.upOpacity);
            _obj.setAttribute('stroke', config.outlineUpColor);
            _obj.setAttribute('stroke-opacity', config.outlineUpOpacity);
        });

        _obj.addEventListener('mousedown', function() {
            _obj.setAttribute('fill', config.downColor);
            _obj.setAttribute('fill-opacity', config.downOpacity);
            _obj.setAttribute('stroke', config.outlineDownColor);
            _obj.setAttribute('stroke-opacity', config.outlineDownOpacity);
        });

        _obj.addEventListener('mouseup', function() {
            _obj.setAttribute('fill', config.overColor);
            _obj.setAttribute('fill-opacity', config.overOpacity);
            _obj.setAttribute('stroke', config.outlineOverColor);
            _obj.setAttribute('stroke-opacity', config.outlineOverOpacity);
            if (config.target === 'modal') {
                $(config.url).modal("show");
            }
        });

        _obj.addEventListener('mousemove', function(e) {
            var x = e.pageX + 10, y = e.pageY + 15;
            var tipw = document.getElementById('organs-tip').offsetWidth;
            var tiph = document.getElementById('organs-tip').offsetHeight;

            x = (x + tipw > window.scrollX + window.innerWidth) ? x - tipw - (20 * 2) : x;
            y = (y + tiph > window.scrollY + window.innerHeight) ? window.scrollY + window.innerHeight - tiph - 10 : y;

            var tip = document.getElementById('organs-tip');
            tip.style.left = x + 'px';
            tip.style.top = y + 'px';
        });
    }
}

function int_addEvent(id) {
    var _obj = document.getElementById(id);
    var config = int_config[id];

    _obj.setAttribute('fill', config.upColor);
    _obj.setAttribute('fill-opacity', config.upOpacity);
    _obj.setAttribute('stroke', config.outlineUpColor);
    _obj.setAttribute('stroke-opacity', config.outlineUpOpacity);
    _obj.style.cursor = 'default';

    if (config.enable) {
        if (isTouchEnabled()) {
            _obj.addEventListener('touchstart', function(e) {
                var touch = e.touches[0];
                var x = touch.pageX + 10, y = touch.pageY + 15;
                var tipw = document.getElementById('organs-tip').offsetWidth;
                var tiph = document.getElementById('organs-tip').offsetHeight;

                x = (x + tipw > window.scrollX + window.innerWidth) ? x - tipw - (20 * 2) : x;
                y = (y + tiph > window.scrollY + window.innerHeight) ? window.scrollY + window.innerHeight - tiph - 10 : y;

                _obj.setAttribute('fill', config.overColor);
                _obj.setAttribute('fill-opacity', config.downOpacity);
                _obj.setAttribute('stroke', config.outlineDownColor);
                _obj.setAttribute('stroke-opacity', config.outlineDownOpacity);
                var tip = document.getElementById('organs-tip');
                tip.style.display = 'block';
                tip.innerHTML = config.hover;
                tip.style.left = x + 'px';
                tip.style.top = y + 'px';
            });

            _obj.addEventListener('touchend', function() {
                _obj.setAttribute('fill', config.upColor);
                _obj.setAttribute('fill-opacity', config.upOpacity);
                _obj.setAttribute('stroke', config.outlineUpColor);
                _obj.setAttribute('stroke-opacity', config.outlineUpOpacity);
                if (config.target === 'modal') {
                    $(config.url).modal("show");
                }
            });
        }

        _obj.style.cursor = 'pointer';

        _obj.addEventListener('mouseenter', function() {
            var tip = document.getElementById('organs-tip');
            tip.style.display = 'block';
            tip.innerHTML = config.hover;
            _obj.setAttribute('fill', config.overColor);
            _obj.setAttribute('fill-opacity', config.overOpacity);
            _obj.setAttribute('stroke', config.outlineOverColor);
            _obj.setAttribute('stroke-opacity', config.outlineOverOpacity);
        });

        _obj.addEventListener('mouseleave', function() {
            var tip = document.getElementById('organs-tip');
            tip.style.display = 'none';
            _obj.setAttribute('fill', config.upColor);
            _obj.setAttribute('fill-opacity', config.upOpacity);
            _obj.setAttribute('stroke', config.outlineUpColor);
            _obj.setAttribute('stroke-opacity', config.outlineUpOpacity);
        });

        _obj.addEventListener('mousedown', function() {
            _obj.setAttribute('fill', config.downColor);
            _obj.setAttribute('fill-opacity', config.downOpacity);
            _obj.setAttribute('stroke', config.outlineDownColor);
            _obj.setAttribute('stroke-opacity', config.outlineDownOpacity);
        });

        _obj.addEventListener('mouseup', function() {
            _obj.setAttribute('fill', config.overColor);
            _obj.setAttribute('fill-opacity', config.overOpacity);
            _obj.setAttribute('stroke', config.outlineOverColor);
            _obj.setAttribute('stroke-opacity', config.outlineOverOpacity);
            if (config.target === 'modal') {
                $(config.url).modal("show");
            }
        });

        _obj.addEventListener('mousemove', function(e) {
            var x = e.pageX + 10, y = e.pageY + 15;
            var tipw = document.getElementById('organs-tip').offsetWidth;
            var tiph = document.getElementById('organs-tip').offsetHeight;

            x = (x + tipw > window.scrollX + window.innerWidth) ? x - tipw - (20 * 2) : x;
            y = (y + tiph > window.scrollY + window.innerHeight) ? window.scrollY + window.innerHeight - tiph - 10 : y;

            var tip = document.getElementById('organs-tip');
            tip.style.left = x + 'px';
            tip.style.top = y + 'px';
        });
    }
}