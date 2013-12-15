/*
Camera Controller.js

Project:
LD28

Author:
Team Tampere Threesome
*/

var scrollDistance: int = 5;
var scrollSpeed: float = .70;

function Start() {

	//initial position
	transform.position = new Vector3(0, 0, 0);

	//TODO: position child camera as well

}

function Update() {

	var translationX: float = scrollSpeed * Input.GetAxis("Horizontal");
	var translationY: float = scrollSpeed * Input.GetAxis("Vertical");

	transform.Translate(translationX + translationY, 0, translationY - translationX);

	var mousePosX = Input.mousePosition.x;
	var mousePosY = Input.mousePosition.y;

	/*if (mousePosX < scrollDistance) {
		transform.Translate(-1, 0, 1);
	}

	if (mousePosX >= Screen.width - scrollDistance) {
		transform.Translate(1, 0, -1);
	}

	if (mousePosY < scrollDistance) {
		transform.Translate(-1, 0, -1);
	}

	if (mousePosY >= Screen.height - scrollDistance) {
		transform.Translate(1, 0, 1);
	}*/

	var MainCamera:GameObject = GameObject.Find("Main Camera");

	if (Input.GetAxis("Mouse ScrollWheel") > 0 && MainCamera.camera.orthographicSize > 4) {
		MainCamera.camera.orthographicSize = MainCamera.camera.orthographicSize - 4;
	}

	if (Input.GetAxis("Mouse ScrollWheel") < 0 && MainCamera.camera.orthographicSize < 80) {
		MainCamera.camera.orthographicSize = MainCamera.camera.orthographicSize + 4;
	}
	
	
	//pivots
	
	if(Input.GetKeyDown("q")){
		transform.Rotate(0, -90, 0);
	}
	
	if(Input.GetKeyDown("e")){
		transform.Rotate(0, 90, 0);
	}
	
	
	// Only if we hit something, do we continue
	var hit : RaycastHit;
	if (!Physics.Raycast (MainCamera.camera.ScreenPointToRay(Input.mousePosition), hit))
		return;
	// Just in case, also make sure the collider also has a renderer
	// material and texture
	var meshCollider = hit.collider as MeshCollider;
	if (meshCollider == null || meshCollider.sharedMesh == null)
		return;
	var mesh : Mesh = meshCollider.sharedMesh;
	var vertices = mesh.vertices;
	var triangles = mesh.triangles;
	// Extract local space vertices that were hit
	var p0 = vertices[triangles[hit.triangleIndex * 3 + 0]];
	var p1 = vertices[triangles[hit.triangleIndex * 3 + 1]];    
	var p2 = vertices[triangles[hit.triangleIndex * 3 + 2]];   
	// Transform local space vertices to world space
	var hitTransform : Transform = hit.collider.transform;
	p0 = hitTransform.TransformPoint(p0);
	p1 = hitTransform.TransformPoint(p1);
	p2 = hitTransform.TransformPoint(p2);
	// Display with Debug.DrawLine
	Debug.DrawLine(p0, p1);
	Debug.DrawLine(p1, p2);
	Debug.DrawLine(p2, p0);

}
