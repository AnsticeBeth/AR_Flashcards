const THREE = window.MINDAR.IMAGE.THREE;
import{loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './abc.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		const alligator = await loadGLTF("./alligator/scene.gltf");
		alligator.scene.scale.set(0.5, 0.5, 0.5);
		alligator.scene.position.set(0, -0.1, 0);
		
		const alligatorMixer = new THREE.AnimationMixer(alligator.scene);
		const alligatorAction = alligatorMixer.clipAction(alligator.animations[0]);
		alligatorAction.play();
		
		const alligatorAclip = await loadAudio("./sound/alligator.mp3");
		const alligatorListener = new THREE.AudioListener();
		const alligatorAudio = new THREE.PositionalAudio(alligatorListener);
		
		const bear = await loadGLTF("./bear/scene.gltf");
		bear.scene.scale.set(0.5, 0.5, 0.5);
		bear.scene.position.set(0, -0.3, 0);
		
		const bearMixer = new THREE.AnimationMixer(bear.scene);
		const bearAction = bearMixer.clipAction(bear.animations[0]);
		bearAction.play();
		
		const bearAclip = await loadAudio("./sound/bear.mp3");
		const bearListener = new THREE.AudioListener();
		const bearAudio = new THREE.PositionalAudio(bearListener);
		
		const cat = await loadGLTF("./cat/scene.gltf");
		cat.scene.scale.set(0.05, 0.05, 0.05);
		cat.scene.position.set(0, -0.3, 0);
		
		const catMixer = new THREE.AnimationMixer(cat.scene);
		const catAction = catMixer.clipAction(cat.animations[0]);
		catAction.play();
		
		const catAclip = await loadAudio("./sound/cat.mp3");
		const catListener = new THREE.AudioListener();
		const catAudio = new THREE.PositionalAudio(catListener);
		
		const alligatorAnchor = mindarThree.addAnchor(0);
		alligatorAnchor.group.add(alligator.scene);
		
		camera.add(alligatorListener);
		alligatorAudio.setRefDistance(100);
		alligatorAudio.setBuffer(alligatorAclip);
		alligatorAudio.setLoop(true);
		alligatorAnchor.group.add(alligatorAudio);
		alligatorAnchor.onTargetFound = () => {
			alligatorAudio.play();
		}
		
		alligatorAnchor.onTargetLost = () => {
			alligatorAudio.pause();
		}
		
		const bearAnchor = mindarThree.addAnchor(1);
		bearAnchor.group.add(bear.scene);
		
		camera.add(bearListener);
		bearAudio.setRefDistance(100);
		bearAudio.setBuffer(bearAclip);
		bearAudio.setLoop(true);
		bearAnchor.group.add(bearAudio);
		bearAnchor.onTargetFound = () => {
			bearAudio.play();
		}
		
		bearAnchor.onTargetLost = () => {
			bearAudio.pause();
		}
		
		const catAnchor = mindarThree.addAnchor(2);
		catAnchor.group.add(cat.scene);
		
		camera.add(catListener);
		catAudio.setRefDistance(100);
		catAudio.setBuffer(catAclip);
		catAudio.setLoop(true);
		catAnchor.group.add(catAudio);
		catAnchor.onTargetFound = () => {
			catAudio.play();
		}
		
		catAnchor.onTargetLost = () => {
			catAudio.pause();
		}
		
		const clock = new THREE.Clock();
		
		
		await mindarThree.start();
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			alligatorMixer.update(delta);
			bearMixer.update(delta);
			catMixer.update(delta);
			alligator.scene.rotation.set(0, alligator.scene.rotation.y + delta, 0);
			bear.scene.rotation.set(0, bear.scene.rotation.y + delta, 0);
			cat.scene.rotation.set(0, cat.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
	
});