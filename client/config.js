require.config( {
    
    baseUrl: '/',
    paths: {
        'components': 'bower_components',
        'jquery': 'bower_components/jquery/jquery',
        'codemirror': 'bower_components/codemirror/lib/codemirror',
        'codemirror.dialog': 'bower_components/codemirror/addon/dialog/dialog',
        'codemirror.shell': 'bower_components/codemirror/mode/shell/shell',
        'codemirror.markdown': 'bower_components/codemirror/mode/markdown/markdown',
        'codemirror.javascript': 'bower_components/codemirror/mode/javascript/javascript',
        'codemirror.python': 'bower_components/codemirror/mode/python/python',
        'codemirror.vim': 'bower_components/codemirror/keymap/vim',
        'markdown': 'bower_components/marked/lib/marked',
        'angular': 'bower_components/angular/angular',
        'angular-route': 'bower_components/angular-route/angular-route',
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap-tpls',
        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap'
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
        'codemirror.javascript': {
            deps: [ 'codemirror' ],
            exports: 'CodeMirror'
        },
        'codemirror.python': {
            deps: [ 'codemirror' ],
            exports: 'CodeMirror'
        },
        'codemirror.vim': {
            deps: [ 'codemirror' ],
            exports: 'CodeMirror'
        },
        'angular': {
            exports: 'angular'
        },
        'angular-resource': {
            deps: [ 'angular' ],
            exports: 'angular'
        },
        'angular-bootstrap': {
            deps: [ 'angular', 'bootstrap' ],
            exports: 'angular'
        },
        'angular-route': {
            deps: [ 'angular' ],
            exports: 'angular'
        }
    }

} );