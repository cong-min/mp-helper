const isWindows = process.platform === 'win32';

const icons = {
    error: isWindows ? '\u00D7' : '\u2717',
    success: isWindows ? '\u221A' : '\u2713',
    add: '+',
    remove: '-',
    pending: '\u25E6',
    arrow: '\u2023',
    copy: '\u274F',
};

module.exports = icons;
