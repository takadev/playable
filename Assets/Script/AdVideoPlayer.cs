using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Video;
using System.Collections;

public class AdVideoPlayer : MonoBehaviour
{
    [SerializeField] private Camera mainCamera = null;
    [SerializeField] private Canvas palyableView = null;
    
    private VideoPlayManager adVideoManager = null;
    private const string MOVIE_FILE = "test2.mp4";

    void Awake()
    {
        this.StartMovie();
    }

    private void StartMovie()
    {
        if (this.adVideoManager == null) {
            this.adVideoManager = VideoPlayManager.Create(this.mainCamera);
        }

        this.adVideoManager.OnPrepareCompleted = PrepareCompleted;
        this.adVideoManager.OnStarted = Started;
        this.adVideoManager.OnEnd = PlayEnd;
        this.adVideoManager.OnErrorReceived = ErrorReceived;

        this.adVideoManager.SetEnabled(true);
        this.adVideoManager.Preload(Application.streamingAssetsPath + "/" + MOVIE_FILE);
    }

    private void Pause()
    {
        this.adVideoManager.Pause();
    }

    private void Resume()
    {
        this.adVideoManager.Resume();
    }

    private void Started()
    {
        //Debug.Log("Started");
    }

    private void PlayEnd()
    {
        //Debug.Log("PlayEnd");
        this.adVideoManager.SetEnabled(false);
        this.palyableView.gameObject.SetActive(true);

    }

    private void ErrorReceived(string message)
    {
        Debug.LogError("ErrorReceived : " + message);
    }

    private void PrepareCompleted()
    {
        //Debug.Log("PrepareCompleted");
        this.adVideoManager.PlayPrepared(false, false);
    }
}
