function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 2000 );
	camera.position.set( 2, 2, 3 );

	scene = new THREE.Scene();

	// Add the object
	scene.add( json_obj );

	particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	scene.add( particleLight );

	// Lights
	var ambientLight = new THREE.AmbientLight(0x111111);
      	scene.add(ambientLight);

	// var light = new THREE.HemisphereLight( 0xffeeee, 0x111122 );
	// scene.add( light );

	var pointLight = new THREE.PointLight( 0xffffff, 0.3 );
 	particleLight.add( pointLight );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	// document.body.appendChild( renderer.domElement );
	// renderer.setPixelRatio( window.devicePixelRatio );
	// renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	
}


// // render loop - display stuff
			// function render() {
			// 	requestAnimationFrame( render );

			// 	// updates to the scene caled within the render loop - can call out to functions
			// 	// snappyObject.rotation.x += 0.1;
			// 	// snappyObject.rotation.y += 0.1;

			// 	renderer.render( scene, camera );
			// }

			function render() {
				requestAnimationFrame( render );

				var timer = Date.now() * 0.0001;

				camera.position.x = Math.cos( timer ) * 17;
				camera.position.y = 10;
				camera.position.z = Math.sin( timer ) * 17;

				camera.lookAt( scene.position );

				particleLight.position.x = Math.sin( timer * 4 ) * 3009;
				particleLight.position.y = Math.cos( timer * 5 ) * 4000;
				particleLight.position.z = Math.cos( timer * 4 ) * 3009;

				renderer.render( scene, camera );
			}





			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var stats;

			var camera, controls, scene, renderer;

			init();
			animate();

			function init() {

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( scene.fog.color );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				var container = document.getElementById( 'container' );
				container.appendChild( renderer.domElement );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 500;

				controls = new THREE.OrbitControls( camera, renderer.domElement );
				//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
				controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = false;

				// world

				var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
				var material =  new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );

				for ( var i = 0; i < 500; i ++ ) {

					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.x = ( Math.random() - 0.5 ) * 1000;
					mesh.position.y = ( Math.random() - 0.5 ) * 1000;
					mesh.position.z = ( Math.random() - 0.5 ) * 1000;
					mesh.updateMatrix();
					mesh.matrixAutoUpdate = false;
					scene.add( mesh );

				}

				// lights

				light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 1, 1, 1 );
				scene.add( light );

				light = new THREE.DirectionalLight( 0x002288 );
				light.position.set( -1, -1, -1 );
				scene.add( light );

				light = new THREE.AmbientLight( 0x222222 );
				scene.add( light );

				//

				stats = new Stats();
				container.appendChild( stats.dom );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

				stats.update();

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}

	
	// load json object
	// var loader = new THREE.ObjectLoader();
	// loader.load( './models/snappy_morphFromBlender_03.js', function ( geo ) {

	// 	snappyObject = geo
	// 	// snappyObject.morphTargets = geo.morphTargets
	// 	// snappyObject.morphTargetInfluences = geo.children[3].geometry.morphTargetInfluences

	// 	console.log(geo.morphTargets);
	// 	console.log(snappyObject.morphTargets);
		
	// 	// var snap = new THREE.Mesh( snappyObject.children[3].geometry, new THREE.MeshLambertMaterial( {
	// 	// 	vertexColors: THREE.FaceColors,
	// 	// 	morphTargets: true
	// 	// } ) );
	// 	// console.log(snap);

	// 	snappyObject.scale.set( 1.5, 1.5, 1.5 );
	// 	scene.add( snappyObject );

	// 	mixer = new THREE.AnimationMixer( snappyObject );

	// 	// var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'snappy', snappyObject.children[3].geometry.morphTargets, 24 );
	// 	var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'snappy', geo.morphTargets, 24 );
	// 	mixer.clipAction( clip ).setDuration( 2.5 ).play();

	// } );