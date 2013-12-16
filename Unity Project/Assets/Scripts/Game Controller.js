import SimpleJSON;
import SocketEvents;

var blockOfTheDay = "sand";
var socket:SocketEvents;

function Start () {
	//init function

	ConnectToWebSocket();
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

		var texture = BlockTexture(blockOfTheDay);
		var translate = crosshair.transform.position;

		if(Input.GetMouseButtonDown(0)) {
			SendBlock(parseInt(translate.x), parseInt(translate.y), parseInt(translate.z));
			//AddBlock(translate, texture);
		}

		if(Input.GetMouseButtonDown(1)) {
			RemoveBlock(parseInt(targetCube.transform.position.x), parseInt(targetCube.transform.position.y), parseInt(targetCube.transform.position.z));
			//Destroy(targetCube);
		}

	}

	//change block type for dev purposes
	if(Input.GetKeyDown('tab')) {
		ChangeType();
	}
	
	if(Input.GetKey(KeyCode.Escape)) {
        Application.Quit();
    }
	
	//fetches new messages from websocket
	while(socket.MessagesReady()) {

		
		//handle message
		var message = socket.FetchLastMessage();
		
		//Debug.Log(message);
		
		var json = JSON.Parse(message);
		var skin:Texture;
		var pos:Vector3;
		
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
					
					pos = new Vector3(json['params']['x'].AsFloat, json['params']['y'].AsFloat, json['params']['z'].AsFloat);
					skin = BlockTexture(blockOfTheDay);
					AddBlock(pos, skin);
					
					break;
					
				case "remove_block" :
					
					pos = new Vector3(json['params']['x'].AsFloat, json['params']['y'].AsFloat, json['params']['z'].AsFloat);
					DeleteBlock(pos);
					
					break;
				
				default: 
				
					Debug.Log("Unknown action: " + message);
				
					break;
			
			}
		
		}
		
	}
	
	//Debug.Log(socket.SocketAlive());

}

//DEPRECATED: use websocket connection welcome message instead
function LoadBlockOfTheDay(callback) {
	var url = "http://palikka.koodimonni.fi/blocks/typetoday.json";
	var response = new WWW(url);
	yield response;

	callback(response.text);
}

function SetBlockOfTheDay(type) {

	//set global
	blockOfTheDay = type;

	GameObject.Find("Spinning Block").renderer.material.mainTexture = BlockTexture(type); //assigns it a texture
	GameObject.Find("Spinning Block").renderer.enabled = true;
	GameObject.Find("Block Type").GetComponent(TextMesh).text = type;

}


function LoadWorld(callback) {

	Debug.Log("Loading world…");
	
	var url = "http://palikka.koodimonni.fi/blocks.json";
	var response = new WWW(url);
	yield response;

	var worldData = JSON.Parse(response.text);
	
	Debug.Log("World loaded!");

	callback(worldData);

}


function BuildWorld(worldData) {

	//builds the world
	
	/*ar r = 18;

	for(var x = -r; x < r; ++x) {
		for(var z = -r; z < r; ++z) {
			if( (x*x + z*z ) < (r*r) ) {
				var texture = BlockTexture("water");
				var translate = Vector3(x, -1, z);
				AddBlock(translate, texture);
			}
		}
	}

	r = 7;

	for(x = -r; x < r; ++x) {
		for(z = -r; z < r; ++z) {
			if( (x*x + z*z ) < (r*r) ) {
				texture = BlockTexture("sand");
				translate = Vector3(x, 0, z);
				AddBlock(translate, texture);
			}
		}
	}
	
	r = 2;

	for(x = -r; x < r; ++x) {
		for(z = -r; z < r; ++z) {
			if( (x*x + z*z ) < (r*r) ) {
				texture = BlockTexture("ground");
				translate = Vector3(x, 1, z);
				AddBlock(translate, texture);
			}
		}
	}
	*/
	
	for(var block:SimpleJSON.JSONNode in worldData) {
	
		var blocktype:String = block['oftype'];
		texture = BlockTexture(blocktype);
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
	
	//SendBlock(parseInt(translate.x), parseInt(translate.y), parseInt(translate.z));

}

function GetBlockAt(translate:UnityEngine.Vector3) {
	var colliders = Physics.OverlapSphere(translate, 1);
	if(colliders.length > 0) {
		for(var collider:MeshCollider in colliders) {
			if(collider.gameObject.transform.position == translate) {
				return collider.gameObject;
				break;
			}
		}
	}
	return null;
}

function DeleteBlock(translate:UnityEngine.Vector3) {
	
	Destroy(GetBlockAt(translate));
	
}

function BlockTexture(type) {

	var textures = new Hashtable();
	textures['ground'] = 'groundCubeFull';
	textures['iron'] = 'ironCubeFull';
	textures['life'] = 'lifeCube';
	textures['sand'] = 'sandCubeFull';
	textures['rock'] = 'rockCubeFull';
	textures['water'] = 'waterCubeFull';

	return Resources.Load("Blocks/" + textures[type], Texture2D);

}

function SendBlock(x:int, y:int, z:int) {

	var hash = Md5Sum("add_block" + "suola");
	socket.SendMessage('{"action":"add_block","params":{"x":'+ x +',"y":'+ y +',"z":'+ z +',"hash":"' + hash + '"}}');

}

function RemoveBlock(x:int, y:int, z:int) {

	var hash = Md5Sum("add_block" + "suola");
	socket.SendMessage('{"action":"remove_block","params":{"x":'+ x +',"y":'+ y +',"z":'+ z +',"hash":"' + hash + '"}}');

}

function ChangeType() {

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

function ConnectToWebSocket() {
	
	socket = new SocketEvents();
	
}

function Md5Sum(strToEncrypt: String) {
	var encoding = System.Text.UTF8Encoding();
	var bytes = encoding.GetBytes(strToEncrypt);
 
	// encrypt bytes
	var md5 = System.Security.Cryptography.MD5CryptoServiceProvider();
	var hashBytes:byte[] = md5.ComputeHash(bytes);
 
	// Convert the encrypted bytes back to a string (base 16)
	var hashString = "";
 
	for (var i = 0; i < hashBytes.Length; i++)
	{
		hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}
 
	return hashString.PadLeft(32, "0"[0]);
}
