require( [ 'angular', 'angular-resource' ], function ( angular ) {

    angular.module( 'article', [ 'ngResource' ] )
    .factory( 'Articles', [ '$resource', function( $resource ) {
        return $resource( '/api/article/:id', { articleId: '@id' }, {
            'update': { method: 'PUT' }
        } );
    } ] )
    .controller( 'ArticlesCtrl', [ '$scope', 'Articles', function( $scope, Articles ) {

        $scope.update = function( article ) {
            article.$update( );
        };

        $scope.find = function( ) {
            Articles.query( function( articles ) {
                $scope.articles = articles;
            } );
        };

        $scope.findOne = function( ) {
            Articles.get( {
                articleId: $routeParams.articleId
            } , function( article ) {
                $scope.article = article;
            } );
        };

    } ] );

    // requirejs的加载执行顺序与angular解析顺序有冲突，我们自己初始化
    angular.element( document ).ready( function( ) {
        angular.bootstrap( document, [ 'article' ] );
    } );

/*
    //TODO: 暂时不要删除，有用
    var delay = ( function( ){
        var t;
        return function( fn, s ){
            clearTimeout( t );
            t = setTimeout( fn, s * 1000 );
        }
    } )( )

    var codeMirror = CodeMirror( $( '#codemirror' )[0], {
        value: 'test',
        mode: 'markdown'
    } );

    codeMirror.on( 'change', render );

    $( '#save' ).on( 'click', function( ){
        $.ajax( {
            type: 'post',
            url: '/api/article',
            data: {
                title: $( '#title' ).val( ),
                content: codeMirror.getValue( )
            }
        } ).done( function( data ){
            console.log( data );
        } )
    } );

    function render( ){
        delay( function( ){
            $( '#markdown' ).html( markdown.parse( codeMirror.getValue( ) ) );
            // code( );
        }, .5 );
    }

    render( );
*/
} );