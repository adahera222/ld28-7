﻿/*
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
	 GameObject.Find("Main Camera").camera.orthographicSize = 6;

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

	if (Input.GetAxis("Mouse ScrollWheel") < 0 && MainCamera.camera.orthographicSize < 20) {
		MainCamera.camera.orthographicSize = MainCamera.camera.orthographicSize + 4;
	}
	
	
	//pivots
	
	if(Input.GetKeyDown("q")){
		transform.Rotate(0, 90, 0);
	}
	
	if(Input.GetKeyDown("e")){
		transform.Rotate(0, -90, 0);
	}
	

}
