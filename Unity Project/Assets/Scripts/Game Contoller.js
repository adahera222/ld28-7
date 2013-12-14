#pragma strict

import SimpleJSON;

function Start () {
	//init function

	BuildWorld();

	sendBlock();


}

function Update () {
	//tick function

}


function BuildWorld() {

	//builds the world

	var url = "http://162.243.64.58:49162/blocks.json";
	var response = new WWW(url);
	yield response;

	var worldData = JSON.Parse(response.text);

	for(var block:SimpleJSON.JSONNode in worldData) {

		var texture = Resources.Load("Blocks/sandCubeFull", Texture2D);
		var translate = Vector3(block['x'].AsFloat, block['y'].AsFloat, block['z'].AsFloat);

		AddBlock(translate, texture);
	}

}

//adds block to the game world
function AddBlock(translate:UnityEngine.Vector3, texture:UnityEngine.Texture) {

	var block:GameObject = GameObject.CreatePrimitive(PrimitiveType.Cube); //creates 1x1x1 block
	block.transform.position = translate; //moves it into position
	block.renderer.material.mainTexture = texture; //assigns it a texture

	block.AddComponent("BlockEntity");

	var behaviour = block.GetComponent("BlockEntity");
	Debug.Log(behaviour);

}


function sendBlock() {

	var url = "http://162.243.64.58:49162/";
	var form = new WWWForm();

	form.AddField( "block['type']", "typeid" );
	form.AddField( "block['x']", "1");
	form.AddField( "block['y']", "2");
	form.AddField( "block['z']", "5");

	var request = new WWW(url, form);

	// wait for request to complete
	yield request;

	// and check for errors
	if (request.error == null) {
	    // request completed!

	}

	else {
	    // something wrong!
	    Debug.Log("WWW Error: "+ request.error);
	}
}
