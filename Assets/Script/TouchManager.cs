using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TouchManager {
    public bool _touch_flag;
    public Vector3 _touch_position;
    public TouchPhase _touch_phase;

    public TouchManager(bool flag = false, Vector3? position = null, TouchPhase phase = TouchPhase.Began)
	{
        this._touch_flag = flag;
        if (position == null) {
            this._touch_position = new Vector3(0, 0, 0);
        } else {
            this._touch_position = (Vector3)position;
        }
        this._touch_phase = phase;
    }

    public void update()
	{
        this._touch_flag = false;

        if (Application.isEditor) {
            if (Input.GetMouseButtonDown(0)) {
                this._touch_flag = true;
                this._touch_phase = TouchPhase.Began;
            }

            if (Input.GetMouseButtonUp(0)) {
                this._touch_flag = true;
                this._touch_phase = TouchPhase.Ended;
            }

            if (Input.GetMouseButton(0)) {
                this._touch_flag = true;
                this._touch_phase = TouchPhase.Moved;
            }

            if (this._touch_flag) {
                this._touch_position = Input.mousePosition;
            }

        } else {
            if (Input.touchCount > 0) {
                Touch touch = Input.GetTouch(0);
                this._touch_position = touch.position;
                this._touch_phase = touch.phase;
                this._touch_flag = true;
            }
        }
    }

    public TouchManager getTouch()
	{
        return new TouchManager(this._touch_flag, this._touch_position, this._touch_phase);
    }
}
