const path = require('path')

module.exports = {
    cache: false,
    mode: 'development',
    entry: './scripts/app.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true
}
