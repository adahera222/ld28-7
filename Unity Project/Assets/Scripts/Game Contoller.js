import SimpleJSON;

var blockOfTheDay = "sand";

function Start () {
	//init function

	LoadBlockOfTheDay(SetBlockOfTheDay);
	LoadWorld(BuildWorld);
	

	//sendBlock();


}

function Update () {
	//tick function

	//move crosshairs
	var crosshair = GameObject.Find("Crosshair");
	var hit:RaycastHit;
	
	crosshair.renderer.enabled = false; 
	if (Physics.Raycast (GameObject.Find("Main Camera").camera.ScreenPointToRay(Input.mousePosition), hit)) {
		
		//targeting a block, display crosshairs
		crosshair.renderer.enabled = true;
		
		//the matrix for determining where the crosshairs go
		var offsets = new Array();
		offsets[0] = new Vector3(0, 0, 1);
		offsets[1] = new Vector3(0, 0, 1);
		offsets[2] = new Vector3(0, 1, 0);
		offsets[3] = new Vector3(0, 1, 0);
		offsets[4] = new Vector3(0, 0, -1);
		offsets[5] = new Vector3(0, 0, -1);
		offsets[6] = new Vector3(0, -1, 0);
		offsets[7] = new Vector3(0, -1, 0);
		offsets[8] = new Vector3(-1, 0, 0);
		offsets[9] = new Vector3(-1, 0, 0);
		offsets[10] = new Vector3(1, 0, 0);
		offsets[11] = new Vector3(1, 0, 0);
		
		var offset:Vector3 = offsets[hit.triangleIndex];
		
		var targetCube = hit.collider.gameObject;
		var targetPosition:Vector3 = targetCube.transform.position;
				
		crosshair.transform.position = new Vector3(
			targetCube.transform.position.x + offset.x, 
			targetCube.transform.position.y + offset.y, 
			targetCube.transform.position.z + offset.z
		);

	} 
	
	if(crosshair.renderer.enabled) {
		//we have a position we can add a block on
		
		//Debug.Log(hit.triangleIndex);
		
		var texture = blockTexture(blockOfTheDay);
		var translate = crosshair.transform.position;
		
		if(Input.GetMouseButtonDown(0)) {
			AddBlock(translate, texture);
		}
		
		if(Input.GetMouseButtonDown(1)) {
			Destroy(targetCube);
		}
		
	}
	
	if(Input.GetKeyDown('tab')) {
		changeType();
	}

}

function LoadBlockOfTheDay(callback) {
	var url = "http://palikka.koodimonni.fi/blocks/typetoday.json";
	var response = new WWW(url);
	yield response;

	callback(response.text);
}

function SetBlockOfTheDay(type) {
	
	//set global
	blockOfTheDay = type;
	
	GameObject.Find("Spinning Block").renderer.material.mainTexture = blockTexture(type); //assigns it a texture
	GameObject.Find("Block Type").guiText.text = type;
}


function LoadWorld(callback) {
	
	var url = "http://palikka.koodimonni.fi/blocks.json";
	var response = new WWW(url);
	yield response;

	var worldData = JSON.Parse(response.text);

	callback(worldData);

}


function BuildWorld(worldData) {

	//builds the world

	for(var block:SimpleJSON.JSONNode in worldData) {

		var texture = blockTexture('sand');
		var translate = Vector3(block['x'].AsFloat, block['y'].AsFloat, block['z'].AsFloat);

		AddBlock(translate, texture);
	}

}

//adds block to the game world
function AddBlock(translate:UnityEngine.Vector3, texture:UnityEngine.Texture) {

	var block:GameObject = GameObject.CreatePrimitive(PrimitiveType.Cube); //creates 1x1x1 block
	block.transform.position = translate; //moves it into position
	block.renderer.material.mainTexture = texture; //assigns it a texture

	block.AddComponent("BlockEntity"); //add behaviour script
	
	Destroy(block.GetComponent("BoxCollider")); //remove box collider
	block.AddComponent("MeshCollider"); //add mesh collider instead

	var behaviour = block.GetComponent("BlockEntity");

}

function blockTexture(type) {

	var textures = new Hashtable();
	textures['ground'] = 'groundCubeFull';
	textures['iron'] = 'ironCubeFull';
	textures['life'] = 'lifeCube';
	textures['sand'] = 'sandCubeFull';
	textures['rock'] = 'rockCubeFull';
	textures['water'] = 'waterCubeFull';
	
	return Resources.Load("Blocks/" + textures[type], Texture2D);

}

function sendBlock() {

	var url = "http://palikka.koodimonni.fi/blocks";

	var postData = System.Text.Encoding.UTF8.GetBytes(
	 "");

	var headers:Hashtable = new Hashtable();
	headers.Add("Content-Type", "application/json");
	
	var request = new WWW(url, postData, headers);
	yield request;
	Debug.Log(request.text);
	
		
}

function changeType() {
	
	var types = new Array();
	types.push('ground'); 
	types.push('iron');
	types.push('life');
	types.push('sand');
	types.push('rock');
	types.push('water');
	
	typenum = 0;
	for(var i = 0; i < types.length; i++) {
		if(blockOfTheDay == types[i]) 
			typenum = i;
	}
	
	if(++typenum >= types.length) 
		typenum = 0;
		
	SetBlockOfTheDay(types[typenum]);
	
}
