using UnityEngine;
using UnityEditor;
using System.Diagnostics;
using System.IO;

public class ExportAssetBundles : EditorWindow
{

    [@MenuItem("AssetBundles/Build AssetBundles")]
    static void main()
    {
        EditorWindow.GetWindow<ExportAssetBundles>(false, "AssetBundles");
    }

    private Vector2 scrollVec2;
    private string rootPath = "Assets";
    private string _assetBundleName = "";
    private string _assetBundlePath = "Assets/StreamingAssets";
    private int _assetBundleElementNum = 4;
    private string[] _assetBundleElement = new string[4];


    [@MenuItem("AssetBundles/readTest AssetBundles")]
    static void Read()
    {
        string path = Application.streamingAssetsPath + "/GameEditorAssetBundle/Miner" + "/miner.assetbundle";
        AssetBundle asset = AssetBundle.LoadFromFile(path);
        GameObject go = asset.LoadAsset("MinerMainUI") as GameObject;
        GameObject go2 = GameObject.Instantiate(go) as GameObject;
    }

    void OnGUI()
    {
        scrollVec2 = EditorGUILayout.BeginScrollView(scrollVec2, GUILayout.Width(position.width), GUILayout.Height(position.height));

        EditorGUILayout.BeginHorizontal();
        GUILayout.Label("资源包名称:");
        _assetBundleName = EditorGUILayout.TextField(_assetBundleName);
        if (GUILayout.Button("清空"))
            EditorApplication.delayCall += Delete;
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        GUILayout.Label("资源包路径:");
        _assetBundlePath = EditorGUILayout.TextField(_assetBundlePath);
        if (GUILayout.Button("浏览"))
            EditorApplication.delayCall += Save;
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        GUILayout.Label("资源包容量:");
        _assetBundleElementNum = EditorGUILayout.IntField(_assetBundleElementNum);
        if (GUILayout.Button("增加"))
            EditorApplication.delayCall += Add;
        EditorGUILayout.EndHorizontal();

        if (_assetBundleElementNum > 0)
        {
            if (_assetBundleElement.Length != _assetBundleElementNum)
            {
                string[] temp = _assetBundleElement;
                _assetBundleElement = new string[_assetBundleElementNum];
                for (int i = 0; i < temp.Length; i++)
                {
                    if (i < _assetBundleElement.Length)
                        _assetBundleElement[i] = temp[i];
                }
            }
            for (int i = 0; i < _assetBundleElementNum; i++)
            {
                EditorGUILayout.BeginHorizontal();
                GUILayout.Label("资源" + (i + 1) + ":");
                _assetBundleElement[i] = EditorGUILayout.TextField(_assetBundleElement[i]);
                if (GUILayout.Button("浏览"))
                    Browse(i);
                EditorGUILayout.EndHorizontal();
            }
        }
        if (GUILayout.Button("打包"))
        {
            if (_assetBundleName == "")
            {
                //打开一个通知栏
                this.ShowNotification(new GUIContent("资源包名称不可为空"));
                return;
            }
            if (_assetBundlePath == "C:/" || _assetBundlePath == "D:/" || _assetBundlePath == "E:/" || _assetBundlePath == "F:/")
            {
                //打开一个通知栏
                this.ShowNotification(new GUIContent("资源包路径不可为根目录"));
                return;
            }
            if (_assetBundleElementNum <= 0)
            {
                //打开一个通知栏
                this.ShowNotification(new GUIContent("资源包容量必须大于0"));
                return;
            }
            for (int i = 0; i < _assetBundleElement.Length; i++)
            {
                if (_assetBundleElement[i] == null || _assetBundleElement[i] == "")
                {
                    //打开一个通知栏
                    this.ShowNotification(new GUIContent("资源" + (i + 1) + "路径为空"));
                    return;
                }
            }
            EditorApplication.delayCall += Build;
        }

        EditorGUILayout.EndScrollView();
    }
    /// <summary>
    /// 清空资源包名称
    /// </summary>
    void Delete()
    {
        _assetBundleName = "";
        //转移焦点至主窗口
        EditorUtility.FocusProjectWindow();
    }
    /// <summary>
    /// 选择资源存储路径
    /// </summary>
    void Save()
    {
        string path = EditorUtility.OpenFolderPanel("选择要存储的路径", "", "");
        if (path.Length != 0)
        {
            _assetBundlePath = path;
            EditorUtility.FocusProjectWindow();
        }
    }
    /// <summary>
    /// 资源包容量增加
    /// </summary>
    void Add()
    {
        _assetBundleElementNum += 1;
        EditorUtility.FocusProjectWindow();
    }
    /// <summary>
    /// 选择单个打包资源
    /// </summary>
    /// <param name="i">资源序号</param>
    void Browse(int i)
    {
        string path = EditorUtility.OpenFilePanel("选择要打包的资源", @"E:\hutao\Unity Project5.2\Course Cloud Platform\Assets", "*");
        if (path.Length != 0)
        {
            if (path.IndexOf(rootPath) >= 0)
            {
                //如果选中的资源是dll文件，则自动改后缀名为.bytes
                if (path.EndsWith(".dll"))
                {
                    string newpath = path.Substring(0, path.LastIndexOf('.')) + ".bytes";
                    File.Move(path, newpath);
                    _assetBundleElement[i] = newpath.Substring(newpath.IndexOf(rootPath));
                    AssetDatabase.Refresh();
                }
                else
                {
                    _assetBundleElement[i] = path.Substring(path.IndexOf(rootPath));
                }
            }
        }
    }
    /// <summary>
    /// 打包资源
    /// </summary>
    void Build()
    {
        //需要打包的资源（可打包成多个）
        AssetBundleBuild[] buildMap = new AssetBundleBuild[1];

        //资源包的名称
        buildMap[0].assetBundleName = _assetBundleName;
        //资源包下的资源名称，一个资源包可以包含多个资源，资源由从Assets开始的路径组成且包含自身后缀名
        buildMap[0].assetNames = _assetBundleElement;

        BuildPipeline.BuildAssetBundles(_assetBundlePath, buildMap, BuildAssetBundleOptions.None, BuildTarget.StandaloneWindows64);
    }
}
