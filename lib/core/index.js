import { version } from '../../package.json';
import _App from './App';
import _Page from './Page';
import _Component from './Component';
import utils from './utils';
import emitter from './managers/emitter';

export default {
    version,
    App: _App,
    Page: _Page,
    Component: _Component,
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
    utils,
};
