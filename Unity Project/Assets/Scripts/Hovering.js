#pragma strict

var spin:float = 50;
var bounce:float = 1;

function Update () {
	transform.Rotate(Vector3.up, spin * Time.deltaTime);
	//transform.position.y = Mathf.Sin(Time.time);
}