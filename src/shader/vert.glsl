#version 300 es

precision highp float;

uniform mat4 u_worldViewProjection;

out float height;
layout(location = 0) in vec4 a_position;
void main() {
  vec4 pos = u_worldViewProjection * a_position;
  gl_Position = pos;
  

  height = a_position.y;
}