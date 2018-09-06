using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Line : MonoBehaviour
{
    public Material _mat;

    List<Vector3> points = new List<Vector3>();
    List<Vector3> vertices = new List<Vector3>();
    List<Vector2> uvs = new List<Vector2>();
    List<int> tris = new List<int>();

    Mesh mesh;
    public int offset = 0;
    public float xoffset = 0;
    public float penSize = 0.6f;
    public float uScrollSpeed = 0.18f;

    void CreateMesh(float size)
    {
        Vector2 prev = this.points[this.points.Count - 2];
        Vector2 top = this.points[this.points.Count - 1];
        Vector2 dir = (top - prev).normalized;

        Vector2 plus90  = top + new Vector2(-dir.y, dir.x) * size;
        Vector2 minus90 = top + new Vector2(dir.y, -dir.x) * size;

        // 頂点を追加
        this.vertices.Add(minus90);
        this.vertices.Add(plus90);

        // UVを追加
        this.uvs.Add(new Vector2(xoffset, 0));
        this.uvs.Add(new Vector2(xoffset, 1));
        xoffset += (top - prev).magnitude / 6.0f;

        this.tris.Add(offset);
        this.tris.Add(offset + 1);
        this.tris.Add(offset + 2);
        this.tris.Add(offset + 1);
        this.tris.Add(offset + 3);
        this.tris.Add(offset + 2);

        offset += 2;

        mesh.vertices = this.vertices.ToArray();
        mesh.uv = this.uvs.ToArray();
        mesh.triangles = this.tris.ToArray();

        GetComponent<MeshFilter>().sharedMesh = mesh;
        GetComponent<MeshRenderer>().material = _mat;
    }

    public void PenDown(Vector3 tp)
    {
        // 開始点を保存
        this.points.Add(tp);

        // 頂点を２つ生成
        this.vertices.Add(tp);
        this.vertices.Add(tp);

        // uv座標を設定
        this.uvs.Add(new Vector2(0, 1f));
        this.uvs.Add(new Vector2(0, 0));
        this.offset = 0;

        // メッシュ生成
        this.mesh = new Mesh();
    }

    public void PenMove(Vector3 tp, float size)
    {
        this.points.Add(tp);

        CreateMesh(size);
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            this.points.Clear();
            this.vertices.Clear();
            this.uvs.Clear();
            this.tris.Clear();

            Vector3 tp = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            PenDown(tp);
        }
        else if (Input.GetMouseButton(0))
        {
            Vector3 tp = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            PenMove(tp, this.penSize);
        }
    }
}