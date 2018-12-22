using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class test : MonoBehaviour {

	// Use this for initialization
	void Start () {
        GameObject prefabBg = Resources.Load("LoginBg") as GameObject;
        if (prefabBg == null)
        {
            Debug.LogError(" Load LoginBg fail,check path!");
        }
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}
