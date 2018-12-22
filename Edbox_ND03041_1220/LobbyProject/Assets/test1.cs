using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;

namespace haha
{

    class args
    {
        public string ProductId;
        public    string ReceiveUserId;
       public string SendUserId;
       public string SendUserName;

    }
    public class test1 : MonoBehaviour
    {

        // Use this for initialization
        void Start()
        {
            print(MakeOkURL_args("105dd156-8ae1-4e39-ba3d-99ef1f68dd9a", "1234567890", "34567890", "nickname"));
        }

        // Update is called once per frame
        void Update()
        {

        }

        public string MakeOkURL_args(string ProductId, string ReceiveUserId, string SendUserId, string SendUserName)
        {
            Encoding encoding = Encoding.GetEncoding("UTF-8");
            string content = "{\"ProductId\": \"" + ProductId + "\", 	\"ReceiveUserId\": \"" + ReceiveUserId + "\", 	\"SendUserId\": \"" + SendUserId + "\", 	\"SendUserName\": \"" + SendUserName + "\" }";
            return Convert.ToBase64String(encoding.GetBytes(content.Trim()));
        }
    }
}