using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using WebSocketSharp;

public class SocketEvents {

	private LinkedList<string> messages = new LinkedList<string>();

	private WebSocket ws;

	//using (ws = new WebSocket ("ws://172.20.10.5:5000/chat"))
	//using (ws = new WebSocket ("ws://palikka.koodimonni.fi/chat"))

	public SocketEvents () {
		using (ws = new WebSocket ("ws://172.20.10.5:5000/chat"))
		{
			
			ws.OnOpen += (sender, e) =>
			{
				Debug.Log("Connection opened");
			};
			
			ws.OnMessage += (sender, e) =>
			{
				messages.AddLast(e.Data);
				Debug.Log (e.Data);
			};

			ws.OnError += (sender, e) =>
			{
				Debug.Log("Error: " + e.Message);
			};

			ws.OnClose += (sender, e) =>
			{
				Debug.Log("Closed: " + e.Reason);
				//attempt a reconnect
				ws.Connect ();

			};
			
			ws.Connect ();

		}
	}

	public bool MessagesReady() {
		return messages.Count > 0;
	}

	public bool SocketAlive() {
		return ws.IsAlive;
	}

	public string FetchLastMessage() {

		string msg = messages.First.Value;
		messages.RemoveFirst();

		return msg;
	}

	public void SendMessage(string msg) {
		ws.Send(msg);
		Debug.Log ("Message '" + msg + "' sent");
	}


}
