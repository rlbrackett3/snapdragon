/////////////////////////////////////////////////////
// fuestablish variables
var container;

var camera, scene, projector, renderer;
var objects, controls, mesh, mixer;
var snappyObject;

/////////////////////////////////////////////////////////
// initiation calls
init();
animate();

/////////////////////////////////////////////////////////
// initialize the scene
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = '';
	container.appendChild( info );

	// cameras setup
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(10, 10, 12);
	camera.target = new THREE.Vector3( 0, 0, 5 );

	// scene intiation
	scene = new THREE.Scene();

	// lighting setup
	lighting();

	// load JSON
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load('models/snappy.js', function( geometry, materials ) {
		var material = new THREE.MeshPhongMaterial( { 
			color: 0xcb43df, 
			specular: 0xffffff, 
			shininess: 20, 
			morphTargets: true, 
			vertexColors: THREE.FaceColors, 
			side: THREE.DoubleSide,
			// shading: THREE.FlatShading 
		} );

		mesh = new THREE.Mesh( geometry, material );

		mesh.geometry.computeVertexNormals();
		
		// mesh.scale.set( 1.5, 1.5, 1.5 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		
		scene.add( mesh );

		mixer = new THREE.AnimationMixer( mesh );

		var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', geometry.morphTargets, 24 );
		mixer.clipAction( clip ).setDuration( 2.5 ).play();

		console.log(geometry.morphTargets);
	});




	// set renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	// renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );

	container.appendChild(renderer.domElement);

	// setup controls
	controls();

	//
	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


/////////////////////////////////////////////////////
// Prepare Orbit controls
function controls() {
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;
	controls.target = new THREE.Vector3(0, 0, 0);
	controls.maxDistance = 150;
}


/////////////////////////////////////////////////////
// lighting setup - sample
function lighting() {
	var ambientLight = new THREE.AmbientLight(0x404040, .25);
    scene.add(ambientLight);

    // var light = new THREE.PointLight( 0xFFFFDD );
    // light.position.set( -5, 5, 10 );
    // scene.add( light );	

    scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
	scene.fog.color.setHSL( 0.6, 0, 1 );

	// LIGHTS

	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 0, 500 );
	scene.add( hemiLight );

	//

	dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.1, 1, 0.95 );
	dirLight.position.set( -1, 1.75, 1 );
	dirLight.position.multiplyScalar( 50 );
	scene.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;

	var d = 50;

	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadow.camera.far = 3500;
	dirLight.shadow.bias = -0.0001;

}

/////////////////////////////////////////////////////
// animate scene
function animate() {
	requestAnimationFrame( animate );

	render();
}

/////////////////////////////////////////////////////
// render scene
var radius = 600;
var theta = 0;

var prevTime = Date.now();

function render() {
	// requestAnimationFrame( render );

	// theta += 0.1;

	// camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );

	// camera.lookAt( camera.target );

	if ( mixer ) {

		var time = Date.now();

		mixer.update( ( time - prevTime ) * 0.001 );

		prevTime = time;

	}

	renderer.render( scene, camera );
}

// Returns a random integer between min (inclusive) and max (inclusive)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

render();