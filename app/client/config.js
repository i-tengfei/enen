require.config( {
    
    baseUrl: '/',
    paths: {
        'components': 'bower_components',
        'jquery': 'bower_components/jquery/jquery',
        'codemirror': 'bower_components/codemirror/lib/codemirror',
        'codemirror.dialog': 'bower_components/codemirror/addon/dialog/dialog',
        'codemirror.shell': 'bower_components/codemirror/mode/shell/shell',
        'codemirror.markdown': 'bower_components/codemirror/mode/markdown/markdown',
        'codemirror.vim': 'bower_components/codemirror/keymap/vim'
    },
    shim: {
        'codemirror': {
            exports: 'CodeMirror'
        },
        'codemirror.dialog': {
            deps: [ 'codemirror' ],
            exports: 'CodeMirror'
        },
        'codemirror.shell': {
            deps: [ 'codemirror' ],
            exports: 'CodeMirror'
        },
        'codemirror.markdown': {
            deps: [ 'codemirror' ],
            exports: 'CodeMirror'
        },
        'codemirror.vim': {
            deps: [ 'codemirror' ],
            exports: 'CodeMirror'
        }
    }

} );