import SimpleJSON;

function Start () {
	//init function

	BuildWorld();

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
		
		var texture = Resources.Load("Blocks/sandCubeFull", Texture2D);
		var translate = crosshair.transform.position;
		
		if(Input.GetMouseButtonDown(0)) {
			AddBlock(translate, texture);
		}
		
		if(Input.GetMouseButtonDown(1)) {
			Destroy(targetCube);
		}
		
	}

}


function BuildWorld() {

	//builds the world

	var url = "http://palikka.koodimonni.fi/blocks.json";
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

	block.AddComponent("BlockEntity"); //add behaviour script
	
	Destroy(block.GetComponent("BoxCollider")); //remove box collider
	block.AddComponent("MeshCollider"); //add mesh collider instead

	var behaviour = block.GetComponent("BlockEntity");

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
