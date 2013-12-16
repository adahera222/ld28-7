using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using WebSocketSharp;

public class SocketEvents {

	private LinkedList<string> messages = new LinkedList<string>();

	private WebSocket ws;

	public SocketEvents () {
		using (ws = new WebSocket ("ws://palikka.koodimonni.fi/websocket"))
		{
			
			ws.OnOpen += (sender, e) =>
			{
				Debug.Log("Connection Opened!");
			};
			
			ws.OnMessage += (sender, e) =>
			{
				messages.AddLast(e.Data);
			};
			
			ws.Connect ();

		}
	}

	public bool MessagesReady() {
		return messages.Count > 0;
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
