using UnityEngine;
using UnityEngine.Video;


public class VideoPlayManager : MonoBehaviour
{
    public enum PlayState
    {
        Stoped = 0,
        Loading,
        Loaded,
        Playing,
        Paused
    }

    public System.Action<string> OnErrorReceived = null;
    public System.Action OnPrepareCompleted = null;
    public System.Action OnStarted = null;
    public System.Action OnEnd = null;

    private const string MOVIE_OBJECT_NAME = "Movie";
    private PlayState _playState = PlayState.Stoped;
    private GameObject _movieGameObject = null;
    private VideoPlayer _videoPlayer = null;
    private AudioSource _audioSource = null;
    //private bool _tapSkip = false;

    public PlayState State
    {
        get { return _playState; }
    }

    public static VideoPlayManager Create(Camera camera = null)
    {
        var movieGameObject = new GameObject(MOVIE_OBJECT_NAME);
        var movieBehaviour = movieGameObject.AddComponent<VideoPlayManager>();
        movieBehaviour.Init(movieGameObject, camera);

        return movieBehaviour;
    }

    public void Dispose()
    {
        this._videoPlayer.errorReceived -= this.ErrorReceived;
        this._videoPlayer.prepareCompleted -= this.PrepareCompleted;
        this._videoPlayer.started -= this.PlayStart;
        this._videoPlayer.loopPointReached -= this.PlayEnd;
        OnErrorReceived = null;
        OnPrepareCompleted = null;
        OnStarted = null;
        OnEnd = null;

        GameObject.Destroy(this._movieGameObject);
    }

    public void Preload(string filePath)
    {
        this._playState = PlayState.Loading;
#if WITH_DEVELOP
        this._movieGameObject.name = MOVIE_OBJECT_NAME + System.IO.Path.GetFileName(filePath);
#endif
        this._videoPlayer.url = filePath;
        this._videoPlayer.Prepare();
    }

    public void PlayPrepared(bool loop = false, bool tapSkip = true)
    {
        if (this._playState != PlayState.Loaded
            && this._playState != PlayState.Stoped)
        {
            this.ErrorReceived(_videoPlayer, "not Prepared");
            return;
        }

        //this._tapSkip = tapSkip;
        this._videoPlayer.isLooping = loop;
        this._playState = PlayState.Playing;
        this._videoPlayer.Play();
    }

    public void Play(string filePath, bool loop = false, bool tapSkip = true)
    {
        if (this._playState == PlayState.Playing
         || this._playState == PlayState.Paused)
        {
            this.ErrorReceived(_videoPlayer, "already playing");
            return;
        }

        if (this._playState == PlayState.Loading
         || this._playState == PlayState.Loaded)
        {
            this.ErrorReceived(_videoPlayer, "already Prepared");
            return;
        }
#if WITH_DEVELOP
        this._movieGameObject.name = MOVIE_OBJECT_NAME + System.IO.Path.GetFileName(filePath);
#endif
        //this._tapSkip = tapSkip;
        this._videoPlayer.url = filePath;
        this._videoPlayer.isLooping = loop;

        this._playState = PlayState.Playing;
        this._videoPlayer.Play();
    }

    public void Stop()
    {
        if (this._videoPlayer.isPlaying) {
            this._videoPlayer.Stop();
        }

        PlayEnd(this._videoPlayer);
    }

    public void Pause()
    {
        if (this._playState != PlayState.Playing) {
            return;
        }

        this._playState = PlayState.Paused;
        this._videoPlayer.Pause();
    }

    public void Resume()
    {
        if (this._playState != PlayState.Paused) {
            return;
        }

        this._playState = PlayState.Playing;
        this._videoPlayer.Play();
    }

    public void SetEnabled(bool enabled)
    {
        this._videoPlayer.enabled = enabled;
    }

    private void Init(GameObject gameObject, Camera camera)
    {
        this._movieGameObject = gameObject;

        this._audioSource = gameObject.AddComponent<AudioSource>();
        this._videoPlayer = gameObject.AddComponent<VideoPlayer>();

        // 表示設定
        this._videoPlayer.renderMode = VideoRenderMode.CameraNearPlane;
        this._videoPlayer.targetCamera = camera;
        this._videoPlayer.aspectRatio = VideoAspectRatio.FitInside;
        this._videoPlayer.playOnAwake = false;

        // サウンド設定
        //TODO: エディタだと音声が出力されない(Unity 2017.2.1f1)
        //      PrepareCompleted後に設定すると2回目以降は再生される…
        this._audioSource.playOnAwake = false;
        this._videoPlayer.audioOutputMode = VideoAudioOutputMode.AudioSource;
        this._videoPlayer.controlledAudioTrackCount = 1;
        this._videoPlayer.EnableAudioTrack(0, true);
        this._videoPlayer.SetTargetAudioSource(0, _audioSource);

        // イベント設定
        this._videoPlayer.errorReceived += this.ErrorReceived;
        this._videoPlayer.prepareCompleted += this.PrepareCompleted;
        this._videoPlayer.started += this.PlayStart;
        this._videoPlayer.loopPointReached += this.PlayEnd;
    }

    private void ErrorReceived(VideoPlayer player, string message)
    {
        if (this.OnErrorReceived != null) {
            this.OnErrorReceived(message);
        }
    }

    private void PrepareCompleted(VideoPlayer player)
    {
        this._playState = PlayState.Loaded;
        if (this.OnPrepareCompleted != null) {
            this.OnPrepareCompleted();
        }
    }

    private void PlayStart(VideoPlayer player)
    {
        if (this.OnStarted != null) {
            this.OnStarted();
        }
    }

    private void PlayEnd(VideoPlayer player)
    {
        if (this._playState == PlayState.Stoped) {
            return;
        }
        this._playState = PlayState.Stoped;

        if (this.OnEnd != null) {
            this.OnEnd();
        }
    }

    /*
    void Update ()
    {
        if (_playState != PlayState.Playing || !_tapSkip)
        {
            return;
        }

        // タップ確認
        if ( Input.GetMouseButtonUp(0) )
        {
            Stop();
        }
    }
    */
}
