/*
Camera Controller.js

Project:
LD28

Author:
Team Tampere Threesome
*/

var scrollDistance: int = 5;
var scrollSpeed: float = .70;

var rotation = 0;
var qTo = Quaternion.identity;

function Start() {

	//initial position
	transform.position = new Vector3(0, 0, 0);
	GameObject.Find("Main Camera").camera.orthographicSize = 6;
	
	rotation = transform.rotation.eulerAngles.y;

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
		MainCamera.camera.orthographicSize -= 1;
	}

	if (Input.GetAxis("Mouse ScrollWheel") < 0 && MainCamera.camera.orthographicSize < 20) {
		MainCamera.camera.orthographicSize += 1;
	}
	
	
	//pivots
	
	if(Input.GetKeyDown("q")){
		rotation += 90;
		 qTo = Quaternion.Euler(0, rotation, 0);
	}
	
	if(Input.GetKeyDown("e")){
		rotation -= 90;
		 qTo = Quaternion.Euler(0, rotation, 0);
	}
	
	transform.rotation = Quaternion.RotateTowards(transform.rotation, qTo, 500 * Time.deltaTime);

}
