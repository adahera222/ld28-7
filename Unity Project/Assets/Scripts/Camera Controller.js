﻿/*
Camera Controller.js

Project:
LD28

Author:
Team Tampere Threesome
*/

function Update() {

	var translationX: float = Input.GetAxis("Horizontal");
	var translationY: float = Input.GetAxis("Vertical");

	var fastTranslationX: float = 2 * Input.GetAxis("Horizontal");
	var fastTranslationY: float = 2 * Input.GetAxis("Vertical");

	transform.Translate(translationX + translationY, 0, translationY - translationX);

	var mousePosX = Input.mousePosition.x;
	var mousePosY = Input.mousePosition.y;

	var scrollDistance: int = 5;
	var scrollSpeed: float = 70;

	if (mousePosX < scrollDistance) {
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
	}

	var MainCamera:GameObject = GameObject.Find("Main Camera");

	if (Input.GetAxis("Mouse ScrollWheel") > 0 && MainCamera.camera.orthographicSize > 4) {
		MainCamera.camera.orthographicSize = MainCamera.camera.orthographicSize - 4;
	}

	if (Input.GetAxis("Mouse ScrollWheel") < 0 && MainCamera.camera.orthographicSize < 80) {
		MainCamera.camera.orthographicSize = MainCamera.camera.orthographicSize + 4;
	}

}