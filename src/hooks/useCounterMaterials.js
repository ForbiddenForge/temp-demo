import * as THREE from 'three';
import { useControls } from 'leva';
import { useEffect, useMemo } from 'react';

export const useCounterMaterials = (counterObject) => {
	const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

	const materialsConfig = useMemo(
		() => ({
			'Granite 001': {
				path: 'Granite_001_SD/Granite_001',
				metadata: {
					price: '$45.99',
					manufacturer: 'GraniteCo',
					collection: 'Premium Series',
					finish: 'Polished',
				},
			},
			'Granite 002': {
				path: 'Granite_002_SD/Granite_002',
				metadata: {
					price: '$52.99',
					manufacturer: 'StoneWorks',
					collection: 'Luxury Line',
					finish: 'Honed',
				},
			},
		}),
		[]
	);

	const materials = useMemo(() => {
		const createMaterial = (prefix) => {
			const material = new THREE.MeshStandardMaterial({
				metalness: 0.2,
				roughness: 1,
				envMapIntensity: 1,
				color: 0xffffff,
				side: THREE.FrontSide,
			});

			const loadTexture = (path) => {
				const texture = textureLoader.load(`/textures/${prefix}_${path}`, () => {
					material.needsUpdate = true;
				});
				texture.colorSpace = THREE.SRGBColorSpace;
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(2, 2);
				return texture;
			};

			material.map = loadTexture('COLOR.jpg');
			material.normalMap = loadTexture('NORM.jpg');
			material.roughnessMap = loadTexture('ROUGH.jpg');
			material.aoMap = loadTexture('OCC.jpg');

			return material;
		};

		return {
			'Granite 001': createMaterial('Granite_001_SD/Granite_001'),
			'Granite 002': createMaterial('Granite_002_SD/Granite_002'),
		};
	}, [textureLoader]);

	const [{ counterMaterial }, setControls] = useControls('Counter', () => ({
		counterMaterial: {
			options: Object.keys(materialsConfig),
			value: 'Granite 001',
		},
	}));

	useControls(
		'Material Info',
		{
			price: {
				value: materialsConfig[counterMaterial].metadata.price,
				label: 'Price',
				editable: false,
			},
			manufacturer: {
				value: materialsConfig[counterMaterial].metadata.manufacturer,
				label: 'Manufacturer',
				editable: false,
			},
			collection: {
				value: materialsConfig[counterMaterial].metadata.collection,
				label: 'Collection',
				editable: false,
			},
			finish: {
				value: materialsConfig[counterMaterial].metadata.finish,
				label: 'Finish',
				editable: false,
			},
		},
		[counterMaterial]
	);

	useEffect(() => {
		if (counterObject && materials[counterMaterial]) {
			counterObject.material = materials[counterMaterial];
			counterObject.material.needsUpdate = true;

			if (counterObject.geometry) {
				counterObject.geometry.computeVertexNormals();
			}
		}
	}, [counterObject, counterMaterial, materials]);

	useEffect(() => {
		return () => {
			Object.values(materials).forEach((material) => {
				if (material.map) material.map.dispose();
				if (material.normalMap) material.normalMap.dispose();
				if (material.roughnessMap) material.roughnessMap.dispose();
				if (material.aoMap) material.aoMap.dispose();
				material.dispose();
			});
		};
	}, [materials]);

	return counterMaterial;
};
