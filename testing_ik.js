import * as CCDIKSolver from 'CCDIKSolver';


let ikSolver;

//
// Bones hierarchy:
//
//   root
//     ├── bone0
//     │    └── bone1
//     │          └── bone2
//     │                └── bone3
//     └── target
//
// Positioned as follow on the cylinder:
//
//        o      <- target      (y =  20)
//        
//   +----o----+ <- bone3       (y =  12)
//   |         |
//   |    o    | <- bone2       (y =   4)
//   |         |
//   |    o    | <- bone1       (y =  -4)
//   |         |
//   +----oo---+ <- root, bone0 (y = -12)
//

let bones = []

// "root"
let rootBone = new Bone();
rootBone.position.y = -12;
bones.push( rootBone );

// "bone0"
let prevBone = new Bone();
prevBone.position.y = 0;
rootBone.add( prevBone );
bones.push( prevBone );

// "bone1", "bone2", "bone3"
for ( let i = 1; i <= 3; i ++ ) {
	const bone = new Bone();
	bone.position.y = 8;
	bones.push( bone );
	
	prevBone.add( bone );
	prevBone = bone;
}

// "target"
const targetBone = new Bone();
targetBone.position.y = 24 + 8
rootBone.add( targetBone );
bones.push( targetBone );

//
// skinned mesh
//

const mesh = new SkinnedMesh( geometry,	material );
const skeleton = new Skeleton( bones );

mesh.add( bones[ 0 ] ); // "root" bone
mesh.bind( skeleton );

//
// ikSolver
//

const iks = [
	{
		target: 5, // "target"
		effector: 4, // "bone3"
		links: [ { index: 3 }, { index: 2 }, { index: 1 } ] // "bone2", "bone1", "bone0"
	}
];
ikSolver = new CCDIKSolver( mesh, iks );

function render() {
	ikSolver?.update();
	renderer.render( scene, camera );
}