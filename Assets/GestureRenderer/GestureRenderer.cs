using UnityEngine;
using System.Collections.Generic;


[RequireComponent(typeof(LineRenderer))]
public class GestureRenderer : MonoBehaviour
{
    [SerializeField] private Color beginColor;
    [SerializeField] private Color endColor;
    [SerializeField] private float lineWidth;

    private List<Vector3> verts = new List<Vector3>();
    private LineRenderer lr;
    private TouchManager _touch_manager;

    void Start()
    {
        this._touch_manager = new TouchManager();
        this.lr = GetComponent<LineRenderer>();
        this.lr.startColor = beginColor;
        this.lr.endColor = endColor;
        this.lr.startWidth = lineWidth;
        this.lr.endWidth = lineWidth;
        this.lr.positionCount = 0;
        this.lr.sortingLayerName = "ForeGround";
        this.lr.sortingOrder = 2000;1
    }

    void Update()
    {
        this._touch_manager.update();
        var touch_state = this._touch_manager.getTouch();
        if (touch_state._touch_phase == TouchPhase.Ended) {
            verts.Clear();
            lr.positionCount = verts.Count;
            //var pos = Camera.main.ScreenToWorldPoint(touch_state._touch_position);
        }

        if (touch_state._touch_flag) {
            if (touch_state._touch_phase == TouchPhase.Moved) {
                var pos = Camera.main.ScreenToWorldPoint(Input.mousePosition + Vector3.forward * 10);
                if (verts.Count == 0 || pos != verts[verts.Count - 1]) {
                    verts.Add(pos);
                }
            }
        }

        if (verts.Count > 1) {
            lr.positionCount = verts.Count;
            lr.SetPositions(verts.ToArray());
        }
    }
}