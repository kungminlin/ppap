(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
      var socket = io();

      // Scene and Document Preparation

      var scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xffffff );
      //scene.fog = new THREE.FogExp2( 0xffffff, 0.05 );

      var light = new THREE.DirectionalLight(0xff0000, 5);
      scene.add(light);

      var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      socket.on('camera target', function(cam){
        camera.lookAt(new THREE.Vector3( cam.x, cam.y, cam.z ));
        console.log(cam.x + ' ' + cam.y + ' ' + cam.z);
      });

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      var controls = new THREE.OrbitControls(camera, renderer.domElement);

      document.body.appendChild(renderer.domElement);

      window.addEventListener( 'resize', onWindowResize, false );

      function onWindowResize(){

          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          renderer.setSize( window.innerWidth, window.innerHeight );

      }

      // Object Parent (All player-spawn objects will be child of this group)
      var objects = new THREE.Group();
      var users = new THREE.Group();

      // Spawning users (players)
      socket.on('client connect', function(id){
        var user = {name:id, x:(Math.random()-0.5)*30, y:(Math.random()-0.5)*30, z:(Math.random()-0.5)*30, color: 0xff0000};
        camera.position.set(user.x, user.y, user.z);
        socket.emit('add user', user);

        socket.on('users', function(new_users){
          for (var i in new_users) {
            addUser(new_users[i]);
          }
        });

        socket.on('objects', function(new_objects) {
          for (var i in new_objects) {
            addObj(new_objects[i]);
          }
        });

      });

      socket.on('remove user', function(user){
        removeUser(user);
      });

      // Adds a cube given an object {x: x-pos, y: y-pos, z: z-pos, color: new Color()}
      var addObj = function(new_obj) {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: new_obj.color});
        var obj = new THREE.Mesh(geometry, material);
        obj.position.x = new_obj.x;
        obj.position.y = new_obj.y;
        obj.position.z = new_obj.z;
        objects.add(obj);
      };

      // Spawns a user (player)
      var addUser = function(new_user) {
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshBasicMaterial({color: new_user.color, wireframe: true});
        var user = new THREE.Mesh(geometry, material);
        user.position.set(new_user.x, new_user.y, new_user.z);
        user.name = new_user.name;
        users.add(user);
      }

      var removeUser = function(user) {
        var selectedUser = scene.getObjectByName(user.name);
        users.remove(selectedUser);
      }

      socket.on('add object', function({x, y, z, color}) {
        addObj({x:x, y:y, z:z, color:color});
        socket.emit('objects', {x:x, y:y, z:z, color:color});
      });

      scene.add(objects);
      scene.add(users);

      var animate = function () {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
      };

      animate();

      $(document).keydown(function(e) {
        e.preventDefault();
        switch(e.keyCode) {
          // case 65:
          //   camera.rotation.y += 0.1;
          //   break;
          // case 87:
          //   camera.rotation.x -= 0.1;
          //   break;
          // case 68:
          //   camera.rotation.y -= 0.1;
          //   break;
          // case 83:
          //   camera.rotation.x += 0.1;
          //   break;
          case 32:
            socket.emit('add object', {x:(Math.random()-0.5)*30, y:(Math.random()-0.5)*30, z:(Math.random()-0.5)*30, color: new THREE.Color(Math.random() * 0xffffff)});
            break;
          default: return;
        }
      });
},{}]},{},[1]);
