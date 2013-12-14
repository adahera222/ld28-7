#pragma strict

import SimpleJson;

var floor:GameObject;
var block:GameObject;

function Start () {
	//init function

	BuildWorld();

}

function Update () {
	//tick function

}

function BuildWorld() {

	//builds the world

	//add floor
	Instantiate(floor, Vector3(0, -1, 0), Quaternion.identity);

	for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 5; x++) {

			AddBlock(block, Vector3(x, y, 0));

        }
    }

}

//adds block to the game world
function AddBlock(prefab, translate) {

	//clone the prefab
	Instantiate(prefab, translate, Quaternion.identity);



}