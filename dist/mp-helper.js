var version = "0.1.1";

function _App(options) {
    return App(options);
}

function _Page(options) {
    return Page(options);
}

function _Component(options) {
    return Component(options);
}

var index = {
    version,
    App: _App,
    Page: _Page,
    Component: _Component,
};

export default index;
