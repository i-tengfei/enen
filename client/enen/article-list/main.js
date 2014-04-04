require( [ 'coo', 'client/gallery/front' ], function ( COO ) {

    var renderer = new COO.CSS3DRenderer( );

    var view = new COO.View( {
        width: 720,
        height: 1600
    } );

    view.camera.position.z = 960;

    view.setRenderer( renderer );

    view.add( new COO.CSS3D( ) )

} );