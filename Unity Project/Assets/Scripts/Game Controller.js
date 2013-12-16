import SimpleJSON;
import SocketEvents;

var blockOfTheDay = "sand";
var socket:SocketEvents;

function Start () {
	//init function

	connectToWebSocket();
	LoadWorld(BuildWorld);

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
			sendBlock(parseInt(translate.x), parseInt(translate.y), parseInt(translate.z));
			//AddBlock(translate, texture);
		}

		if(Input.GetMouseButtonDown(1)) {
			removeBlock(parseInt(translate.x), parseInt(translate.y), parseInt(translate.z));
			Destroy(targetCube);
		}

	}

	if(Input.GetKeyDown('tab')) {
		changeType();
	}
	
	if(Input.GetKey(KeyCode.Escape)) {
        Application.Quit();
    }
	
	//fetches new messages from websocket
	while(socket.MessagesReady()) {

		
		//handle message
		
		var message = socket.FetchLastMessage();
		
		Debug.Log(message);
		
		var json = JSON.Parse(message);
		
		//check if it was valid json
		if(json != null) {
		
			var action:String = json['action'];
			
			switch(action) {
			
				case "welcome" :
				
					var block:String = json['params']['block'];
					SetBlockOfTheDay(block);
					
					Debug.Log("Block of the day is: " + block);
					
					break;
					
				case "add_block" :
					
					var pos = new Vector3(json['params']['x'].AsFloat, json['params']['y'].AsFloat, json['params']['z'].AsFloat);
					var skin = blockTexture(blockOfTheDay);
					AddBlock(pos, skin);
					
					break;
					
				case "delete_block" :
				
					Debug.Log("Action REMOVE BLOCK initiated");
					
					break;
				
				default: 
				
					Debug.Log("Unknown action");
				
					break;
			
			}
		
		}
		
	}
	
	//Debug.Log(socket.SocketAlive());

}

//deprecated: uses websocket connection welcome message instead
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
	GameObject.Find("Spinning Block").renderer.enabled = true;
	GameObject.Find("Block Type").GetComponent(TextMesh).text = type;

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
	
	/*ar r = 18;

	for(var x = -r; x < r; ++x) {
		for(var z = -r; z < r; ++z) {
			if( (x*x + z*z ) < (r*r) ) {
				var texture = blockTexture("water");
				var translate = Vector3(x, -1, z);
				AddBlock(translate, texture);
			}
		}
	}

	r = 7;

	for(x = -r; x < r; ++x) {
		for(z = -r; z < r; ++z) {
			if( (x*x + z*z ) < (r*r) ) {
				texture = blockTexture("sand");
				translate = Vector3(x, 0, z);
				AddBlock(translate, texture);
			}
		}
	}
	
	r = 2;

	for(x = -r; x < r; ++x) {
		for(z = -r; z < r; ++z) {
			if( (x*x + z*z ) < (r*r) ) {
				texture = blockTexture("ground");
				translate = Vector3(x, 1, z);
				AddBlock(translate, texture);
			}
		}
	}
	*/
	
	for(var block:SimpleJSON.JSONNode in worldData) {

		texture = blockTexture('sand');
		translate = Vector3(block['x'].AsFloat, block['y'].AsFloat, block['z'].AsFloat);

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
	
	//sendBlock(parseInt(translate.x), parseInt(translate.y), parseInt(translate.z));

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

function sendBlock(x:int, y:int, z:int) {

	socket.SendMessage('{"action":"add_block","params":{"x":'+ x +',"y":'+ y +',"z":'+ z +'}}');

}

function removeBlock(x:int, y:int, z:int) {

	socket.SendMessage('{"action":"remove_block","params":{"x":'+ x +',"y":'+ y +',"z":'+ z +'}}');;

}

function changeType() {

	var types = new Array();
	types.push('ground');
	types.push('iron');
	types.push('life');
	types.push('sand');
	types.push('rock');
	types.push('water');

	var typenum = 0;
	for(var i = 0; i < types.length; i++) {
		if(blockOfTheDay == types[i])
			typenum = i;
	}

	if(++typenum >= types.length)
		typenum = 0;

	SetBlockOfTheDay(types[typenum]);

}

function connectToWebSocket() {
	
	socket = new SocketEvents();
	
}
