#version 300 es

precision highp float;

uniform mat4 u_worldViewProjection;

out float height;
layout(location = 0) in vec4 a_position;
void main() {
  
  gl_Position = u_worldViewProjection * a_position;
  gl_PointSize = 0.0;

  height = a_position.y;
}