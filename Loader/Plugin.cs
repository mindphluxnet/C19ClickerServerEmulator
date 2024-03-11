using BepInEx;
using Steamworks;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;
using Debug = UnityEngine.Debug;

namespace C19Plugin
{
    [BepInPlugin("dev.gamedoc.plugin.c19clicker", "Covid-19 Clicker Plugin", "0.0.1")]
    public class Plugin : BaseUnityPlugin
    {
        private void Awake()
        {
            GameObject _go = new GameObject("SteamManager");
            _go.AddComponent<SteamManager>();
            DontDestroyOnLoad(_go);

            On.GameController.InitializeGame += GameController_InitializeGame;
            On.LanguageSystem.LanguageManager.LoadLanguageFields += LanguageManager_LoadLanguageFields;
            On.LanguageSystem.LanguageManager.GetField += LanguageManager_GetField;
            On.TasksServer.UpdateTask += TasksServer_UpdateTask;
            On.AuxiliaryMethods.GetUDID += AuxiliaryMethods_GetUDID;
            On.PlayerModel.ctor_JSONObject += PlayerModel_ctor_JSONObject;

        }

        private void PlayerModel_ctor_JSONObject(On.PlayerModel.orig_ctor_JSONObject orig, PlayerModel self, JSONObject json)
        {
            if (json != null && json.HasFields(new string[2] { "accountId", "rank" }))
            {
                self.accountId = json.GetField("accountId").str;
                self.rank = (int)json.GetField("rank").i;
                if (json.HasField("userBlocked"))
                {
                    self.userBlocked = json.GetField("userBlocked").b;
                }
                if (json.HasField("banDescription"))
                {
                    self.banDescription = json.GetField("banDescription").str;
                }
                long devPoints = json.GetField("evolutionPoints").i;
                Reflection.SetPrivateField(self, "devPoints", devPoints);
                long BTC = json.GetField("resistanceToVirus").i;
                Reflection.SetPrivateField(self, "BTC", BTC);
                
                if (json.HasField("ranking"))
                {
                    self.place = json.GetField("ranking").i;
                }
                if (json.HasField("score"))
                {
                    self.score = json.GetField("score").f;
                }
                if (json.HasField("userName"))
                {
                    self.userName = json.GetField("userName").str;
                }
                if (json.HasField("isNewUser"))
                {
                    self.isNewUser = json.GetField("isNewUser").b;
                }
            }
            else
            {
                Debug.LogWarning("Passed json null or invalid!");
            }
        }

        private string AuxiliaryMethods_GetUDID(On.AuxiliaryMethods.orig_GetUDID orig)
        {
            return SteamUser.GetSteamID().m_SteamID.ToString();
        }

        private async Task<TaskModel> TasksServer_UpdateTask(On.TasksServer.orig_UpdateTask orig, TaskModel model)
        {
            bool _success = false;

            if (model != null)
            {
                UnityWebRequest _webRequest = await new CustomRequest(ServerURLs.BasicURL + "/UpdateTask", CustomRequest.REQUEST_METHOD.POST_FORM, null, new Dictionary<string, string>()
                {
                    {
                        "UDID", AuxiliaryMethods.GetUDID()
                    },
                    {
                        "taskTypeId", model.taskTypeId.ToString()
                    },
                    {
                        "rawMaterialId", model.rawMaterialId.ToString()
                    },
                    {
                        "randomValue", model.value.ToString()
                    }
                }).Send();

                if (_webRequest.isNetworkError)
                {
                    Debug.LogError("Error while getting data from server: " + _webRequest.error);
                    return null;
                }

                if (new ResponseError(_webRequest.downloadHandler.text).IsError())
                {
                    Debug.LogWarning("RESPONSE IsError " + _webRequest.downloadHandler.text);
                    return null;
                }

                if (_webRequest.responseCode != 200)
                {
                    Debug.LogWarning(string.Format("request did not return success - response code: {0}", _webRequest.responseCode));
                    return null;
                }

                JSONObject _jsonObject = null;
                try
                {
                    _jsonObject = new JSONObject(_webRequest.downloadHandler.text, -2, false, false);
                }
                catch (Exception _ex)
                {
                    Debug.LogWarning("Exception while trying to deserialize response: " + _ex.Message);
                }

                if (_jsonObject != null)
                {
                    if (_jsonObject.HasField("success"))
                    {
                        _success = _jsonObject.GetField("success").b;
                    }
                    else if (_jsonObject.HasField("isSuccess"))
                    {
                        _success = _jsonObject.GetField("isSuccess").b;
                    }
                }

                if (_success)
                {
                    model.completed = true;
                }
            }

            return model;
        }

        private string LanguageManager_GetField(On.LanguageSystem.LanguageManager.orig_GetField orig, string key)
        {
            Dictionary<string, string> _fields = new Dictionary<string, string>();
            
            TextAsset textAsset = Resources.Load("LanguageSystem/EN") as TextAsset;
            if (textAsset == null)
            {
                throw new Exception("File Resources/LanguageSystem/EN.txt not found.");
            }
            foreach (string text in textAsset.text.Split(new string[]
            {
                "\r\n",
                "\n"
            }, StringSplitOptions.None))
            {
                int num;
                if ((num = text.IndexOf('=')) >= 0 && !text.StartsWith("#"))
                {
                    string _key = text.Substring(0, num);
                    string value = text.Substring(num + 1, text.Length - num - 1).Replace("\\n", Environment.NewLine);
                    _fields.Add(_key, value);
                }
            }

            return _fields[key];
        }

        private void LanguageManager_LoadLanguageFields(On.LanguageSystem.LanguageManager.orig_LoadLanguageFields orig, UnityEngine.SystemLanguage customLanguage)
        {
            orig.Invoke(UnityEngine.SystemLanguage.English);
        }

        private void GameController_InitializeGame(On.GameController.orig_InitializeGame orig, GameController self)
        {
            ServerURLs.BasicURL = "http://localhost:5000/covid";
            orig.Invoke(self);
        }
    }
}