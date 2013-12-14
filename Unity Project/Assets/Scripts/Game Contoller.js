#pragma strict

import SimpleJson;

var floor:GameObject;
var block:GameObject;

function Start () {
	//init function

	buildWorld();

}

function Update () {
	//tick function

}

function buildWorld() {

	//builds the world

	//add floor
	Instantiate(floor, Vector3(0, -1, 0), Quaternion.identity);

	Instantiate(block, Vector3(0, 0, 0), Quaternion.identity);


	 /*for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 5; x++) {

        	Debug.Log("Block added at: " + x + ", " + y + ", " + 0);



        }
    }*/

}
